import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import React from "react";

interface CustomPopUpProps {
  btnTrigger: React.ReactElement;
  children: React.ReactElement;
}

export default function CustomPopUp({
  btnTrigger,
  children,
}: CustomPopUpProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{btnTrigger}</PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-44 p-2 rounded-xl border bg-background shadow-md"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
