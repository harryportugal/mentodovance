import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export interface ButtonWithIconProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export const ButtonWithIcon = ({
  text = "Descubra como",
  onClick,
  className = "",
}: ButtonWithIconProps) => {
  return (
    <Button
      onClick={onClick}
      className={`relative text-sm font-medium bg-white text-black hover:bg-white/90 rounded-full h-11 p-1 ps-5 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-5 w-fit overflow-hidden cursor-pointer shadow-xl ${className}`}
    >
      <span className="relative z-10 transition-all duration-500 text-black">
        {text}
      </span>
      <div className="absolute right-1 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-40px)] group-hover:rotate-45">
        <ArrowUpRight size={15} />
      </div>
    </Button>
  );
};

export default ButtonWithIcon;
