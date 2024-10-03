import bcrypt from "bcrypt";
import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { emailRegex, mobileNumberLength, mobileNumberRegex, nameMaxLength, nameMinLength } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, password, mobileNumber } =
      await request.json();

    if (!email || !firstName || !lastName || !password) {
      return new NextResponse("Please provide all info", { status: 400 });
    }

    const testEmail = emailRegex.test(email);
    if (!testEmail) {
      return new NextResponse("Please enter a valid email", { status: 400 });
    }

    const testMobileNumber = mobileNumberRegex.test(mobileNumber);
    if (!testMobileNumber) {
      return new NextResponse("Please enter a valid phone number", {
        status: 400,
      });
    }

    const testFirstNameLength =
      typeof firstName === "string" &&
      firstName.length >= nameMinLength &&
      firstName.length <= nameMaxLength;
    if (!testFirstNameLength) {
      return new NextResponse("The first name doesn't meet size requirements", {
        status: 400,
      });
    }
    const testLastNameLength =
      typeof lastName === "string" &&
      lastName.length >= nameMinLength &&
      lastName.length <= nameMaxLength;
    if (!testLastNameLength) {
      return new NextResponse("The last name doesn't meet size requirements", {
        status: 400,
      });
    }

    const testMobileNumberLength = typeof mobileNumber === "string" && mobileNumber.length === mobileNumberLength
    if (!testMobileNumberLength) {
      return new NextResponse("The last name doesn't meet size requirements", {
        status: 400,
      });
    }

    const isEmailUsed = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailUsed) {
      return new NextResponse("That email is already in use", { status: 400 });
    }

    const isMobileNumberUsed = await prismadb.user.findUnique({
      where: {
        mobileNumber,
      },
    });

    if (isMobileNumberUsed) {
      return new NextResponse("That mobile number is already in use", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );
    const user = await prismadb.user.create({
      data: {
        email,
        firstName,
        lastName,
        hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.log("[REGISTRATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}