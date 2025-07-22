import { Button } from "../ui/button";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <div className="flex items-center w-full pt-6 px-6 pb-3 z-50 dark:bg-[#1f1f1f]">
      <Logo />
      <div className="flex md:ml-auto w-full justify-between md:justify-end items-center gap-x-2">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </div>
  );
};
