import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export interface ButtonWithIconProps {
  text?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  variant?: 'white' | 'black';
}

export const ButtonWithIcon = ({
  text = "Descubra como",
  onClick,
  href,
  target,
  rel,
  className = "",
  variant = 'white',
}: ButtonWithIconProps) => {
  const isBlack = variant === 'black';

  const content = (
    <>
      <span className={`relative z-10 transition-all duration-500 ${isBlack ? 'text-white' : 'text-black'}`}>
        {text}
      </span>
      <div className={`absolute right-1 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-40px)] group-hover:rotate-45 ${
        isBlack ? 'bg-white text-black' : 'bg-black text-white'
      }`}>
        <ArrowUpRight size={15} />
      </div>
    </>
  );

  const baseClassName = `relative inline-flex items-center text-sm font-medium ${
    isBlack ? 'bg-black text-white hover:bg-neutral-900' : 'bg-white text-black hover:bg-white/90'
  } rounded-full h-11 p-1 ps-5 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-5 w-fit overflow-hidden cursor-pointer shadow-xl ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={baseClassName}
      >
        {content}
      </a>
    );
  }

  return (
    <Button onClick={onClick} className={baseClassName}>
      {content}
    </Button>
  );
};

export default ButtonWithIcon;
