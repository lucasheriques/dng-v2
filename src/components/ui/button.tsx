import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ScaleLoader } from "react-spinners";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium group transition-all disabled:pointer-events-none disabled:opacity-75 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ease-in-out transform active:scale-[0.97] hover:scale-[1.02] focus:outline focus:outline-primary/70 focus:outline-2 focus:outline-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:ring-yellow-40 0 active:bg-primary/70",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline:
          "border shadow-xs bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:border-primary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-primary/10 hover:text-primary disabled:text-white",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 px-3 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = (
  {
    ref,
    className,
    variant = "default",
    size,
    asChild = false,
    loading = false,
    children,
    ...props
  }: ButtonProps & {
    ref: React.RefObject<HTMLButtonElement>;
  }
) => {
  const Comp = asChild ? Slot : "button";

  const loadingColors = {
    default: "black",
    outline: "white",
    ghost: "white",
    secondary: "white",
    destructive: "white",
    link: "black",
  };

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ScaleLoader
          color={variant ? loadingColors[variant] : "white"}
          height={12}
          width={2}
          margin={1}
        />
      ) : (
        children
      )}
    </Comp>
  );
};
Button.displayName = "Button";

export { Button, buttonVariants };
