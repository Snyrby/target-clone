"use client";
import { FinanceBarLinks } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

type FinanceBarProps = {
  zipCode?: string;
};

export const FinanceBar = ({ zipCode }: FinanceBarProps) => {
  const router = useRouter();
  const { onOpen } = useModal();

  return (
    <div className="h-[50px] target-red w-full relative z-[48]">
      <div className="flex justify-between items-center mx-auto my-0 h-full max-w-[1400px]">
        <div className="h-full flex items-center justify-start gap-x-4">
          <Button
            type="button"
            onClick={() => onOpen("LOCATION", { zipCode })}
            className="hover:bg-slate-600/20 focus-visible:outline-white focus:underline gap-x-4"
          >
            <MapPin size={16} />
            {zipCode ? `Ship to ${zipCode}` : "Use Your Location"}
          </Button>
          {/* TODO: Fix this and add a few stores */}
          <Button
            type="button"
            onClick={() => onOpen("LOCATION", { zipCode })}
            className="hover:bg-slate-600/20 gap-x-4 focus:underline focus-visible:outline-white"
          >
            Store
          </Button>
        </div>
        <div className="justify-end items-center text-sm text-white gap-x-5 hidden lg:flex">
          {FinanceBarLinks.map((link) => (
            <button
              key={link.key}
              type="button"
              className="hover:underline hover:cursor-pointer focus-visible:outline-dotted
            focus-visible:outline-2
            focus-visible:outline-white hover:focus:outline-0"
              onClick={() => router.push("/test")}
            >
              {link.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
