import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const rainbowButtonVariants = cva(
  cn(
    "relative cursor-pointer group transition-all animate-rainbow",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
    "text-sm font-semibold whitespace-nowrap tracking-wide",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default:
          "border-0 bg-[linear-gradient(rgba(18,18,19,0.7),rgba(18,18,19,0.7)),linear-gradient(rgba(18,18,19,0.5)_50%,rgba(18,18,19,0.3)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(168_100%_56%),hsl(338_100%_65%),hsl(168_100%_56%),hsl(338_100%_65%),hsl(168_100%_56%))] bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(168_100%_56%),hsl(338_100%_65%),hsl(168_100%_56%),hsl(338_100%_65%),hsl(168_100%_56%))] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(rgba(255,255,255,0.15),rgba(255,255,255,0.15)),linear-gradient(rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.05)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(168_100%_56%),hsl(338_100%_65%),hsl(168_100%_56%),hsl(338_100%_65%),hsl(168_100%_56%))] text-white/90 font-semibold shadow-lg hover:shadow-xl [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] backdrop-blur-sm",
        outline:
          "border-2 border-primary/60 bg-background/80 text-primary hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-primary/20 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary/5 before:to-accent-secondary/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-13 px-8 py-4 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean;
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="button"
        className={cn(rainbowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

RainbowButton.displayName = "RainbowButton";

export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps };
