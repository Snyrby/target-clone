"use client";
import { useModal } from "@/hooks/use-modal-store";
import { X, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { retrieveLocation, setLocationCookie } from "@/lib/set-location-cookie";
import { cn } from "@/lib/utils";

type LocationFormProps = {
  zipCode: string;
};

export const LocationModal = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const { isOpen, onClose, type, data } = useModal();
  const { register, handleSubmit, formState, setValue } =
    useForm<LocationFormProps>();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (data.zipCode) {
      setValue("zipCode", data.zipCode);
    }
  }, [data]);

  if (type !== "LOCATION" || isOpen === false) {
    return null;
  }

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: LocationFormProps) => {
    try {
      setLocationCookie(data.zipCode);
      onClose();
      // Simulate an async operation with delay
      // await new Promise((resolve) => setTimeout(resolve, 10000));

      console.log("Data submitted:", data);
    } catch (error) {
      console.log("Location Modal Submit Error:", error);
    } finally {
      console.log("Loading state set to false");
    }
  };

  const onUseLocation = () => {
    retrieveLocation();
    onClose();
  };

  const onCloseClick = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white w-[25rem] shadow-lg transform transition-transform duration-300",
          isAnimating ? "animate-slideOut" : "animate-slideIn"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flexBetween my-3 border-b h-16">
            <p className="text-2xl font-bold ml-5">Update shipping location</p>
            <div className="bg-gray-100 opacity-50 rounded-full transition hover:opacity-100 size-7 flexCenter mr-5">
              <X
                onClick={() => onClose()}
                className="cursor-pointer opacity-100"
                size={28}
                color="black"
              />
            </div>
          </div>
          <form
            className="h-full flex flex-col justify-between mx-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="flexStart gap-y-4 flex-col">
              <p className="text-sm my-2">
                Item availability and shipping options will change based on
                location.
              </p>
              <div className="w-full relative">
                <label
                  htmlFor="zipCode"
                  className={cn(
                    "absolute -top-2 left-3 text-xs z-10",
                    formState.errors.zipCode?.message
                      ? "text-red-600 bg-amber-100"
                      : "text-black bg-white"
                  )}
                >
                  Zip code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  {...register("zipCode", {
                    required: {
                      value: true,
                      message: "Zipcode is required",
                    },
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: "Invalid zipcode",
                    },
                  })}
                  className={cn(
                    "p-[10px] border-[1px] border-[rgb(136, 136, 136)] rounded-sm w-full outline-none focus:bg-white focus:border-[2px]",
                    formState.errors.zipCode?.message &&
                      "border-red-600 bg-amber-100 focus:bg-amber-100"
                  )}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-red-600 w-full">
                {formState.errors.zipCode?.message}
              </p>
              <Button
                secondary
                type="button"
                className="gap-x-2 pl-6"
                fullWidth
                start
                disabled={isLoading}
                onClick={onUseLocation}
              >
                <MapPin size={26} color="red" strokeWidth={2} />
                <p className="underline text-base text-gray-500">
                  Use my current location
                </p>
              </Button>
            </div>
            <div className="border-t flexCenter h-20">
              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                center
                className="mx-4 h-12 text-xl"
              >
                {isLoading ? "Updating" : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </aside>
      <button
        className="bg-black fixed inset-0 bg-opacity-50 backdrop-blur-sm z-[49]"
        onClick={onCloseClick}
      />
    </>
  );
};
