import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ExternalLinkIcon } from "lucide-react";
import * as React from "react";

const linkCardVariants = cva(
  "group relative flex items-center gap-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 focus:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border border-primary/20 bg-emerald-500/10 text-emerald-50 hover:bg-emerald-500/20 hover:border-emerald-500/30 shadow-sm",
        outline:
          "border border-slate-800/80 bg-slate-800/40 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-200",
        ghost:
          "border-transparent hover:bg-muted/50 text-foreground hover:text-primary",
        destructive:
          "border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 hover:border-destructive/50 text-destructive",
        event:
          "border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/50 hover:border-slate-700/80 text-slate-100",
      },
      size: {
        default: "p-4",
        sm: "p-3",
        lg: "p-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const iconVariants = cva(
  "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500/30 group-hover:text-emerald-200",
        outline:
          "bg-slate-800/20 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300",
        ghost: "bg-muted text-muted-foreground group-hover:text-primary",
        destructive:
          "bg-destructive/20 text-destructive group-hover:text-destructive",
        event: "bg-slate-800/60 text-slate-300 group-hover:text-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LinkCardProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkCardVariants> {
  asChild?: boolean;
  icon?: React.ElementType;
  showExternalIcon?: boolean;
  cardTitle: React.ReactNode;
  subtitle?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

const LinkCard = React.forwardRef<HTMLAnchorElement, LinkCardProps>(
  (
    {
      className,
      variant = "default",
      size,
      asChild = false,
      icon: Icon,
      showExternalIcon = true,
      cardTitle,
      subtitle,
      secondaryAction,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        className={cn(linkCardVariants({ variant, size, className }))}
        {...props}
      >
        {Icon && (
          <div className={cn(iconVariants({ variant }))}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium transition-colors truncate">
            {cardTitle}
          </h3>
          {subtitle && (
            <p className="text-xs transition-colors text-muted-foreground group-hover:text-current/80">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        <div className="flex items-center gap-2">
          {secondaryAction}
          {showExternalIcon && (
            <div className="relative flex items-center">
              <ExternalLinkIcon
                className={cn(
                  "w-4 h-4 transition-all transform opacity-0 group-hover:opacity-100 group-hover:translate-x-0 absolute right-0",
                  "text-current"
                )}
              />
              <div className="w-4 h-4 transition-all transform opacity-0 group-hover:opacity-0 group-hover:translate-x-1 absolute right-0">
                <ExternalLinkIcon className="w-4 h-4 text-current/30" />
              </div>
            </div>
          )}
        </div>
      </Comp>
    );
  }
);
LinkCard.displayName = "LinkCard";

export { LinkCard, linkCardVariants };
