import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import * as React from "react";

type ColorTheme =
  | "emerald"
  | "blue"
  | "purple"
  | "pink"
  | "amber"
  | "indigo"
  | "orange"
  | "red";

const themeClasses = {
  emerald: {
    background: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    title: "text-emerald-100",
    borderTop: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  blue: {
    background: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    title: "text-blue-100",
    borderTop: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  purple: {
    background: "bg-gradient-to-br from-purple-500/10 to-purple-600/5",
    border: "border-purple-500/20",
    icon: "text-purple-400",
    title: "text-purple-100",
    borderTop: "border-purple-500/20",
    dot: "bg-purple-400",
  },
  pink: {
    background: "bg-gradient-to-br from-pink-500/10 to-pink-600/5",
    border: "border-pink-500/20",
    icon: "text-pink-400",
    title: "text-pink-100",
    borderTop: "border-pink-500/20",
    dot: "bg-pink-400",
  },
  amber: {
    background: "bg-gradient-to-br from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    title: "text-amber-100",
    borderTop: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  indigo: {
    background: "bg-gradient-to-br from-indigo-500/10 to-indigo-600/5",
    border: "border-indigo-500/20",
    icon: "text-indigo-400",
    title: "text-indigo-100",
    borderTop: "border-indigo-500/20",
    dot: "bg-indigo-400",
  },
  orange: {
    background: "bg-gradient-to-br from-orange-500/10 to-orange-600/5",
    border: "border-orange-500/20",
    icon: "text-orange-400",
    title: "text-orange-100",
    borderTop: "border-orange-500/20",
    dot: "bg-orange-400",
  },
  red: {
    background: "bg-gradient-to-br from-red-500/10 to-red-600/5",
    border: "border-red-500/20",
    icon: "text-red-400",
    title: "text-red-100",
    borderTop: "border-red-500/20",
    dot: "bg-red-400",
  },
} as const;

// Create theme context
const FancyCardContext = React.createContext<{
  colorTheme: ColorTheme;
  theme: (typeof themeClasses)[ColorTheme];
} | null>(null);

const useFancyCardContext = () => {
  const context = React.useContext(FancyCardContext);
  if (!context) {
    throw new Error(
      "FancyCard compound components must be used within a FancyCard"
    );
  }
  return context;
};

interface FancyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  colorTheme: ColorTheme;
}

const FancyCard = React.forwardRef<HTMLDivElement, FancyCardProps>(
  ({ className, colorTheme, children, ...props }, ref) => {
    const theme = themeClasses[colorTheme];

    const contextValue = React.useMemo(
      () => ({ colorTheme, theme }),
      [colorTheme, theme]
    );

    return (
      <FancyCardContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            `relative rounded-lg ${theme.background} border ${theme.border} p-6 flex flex-col gap-4`,
            className
          )}
          {...props}
        >
          {children}
        </div>
      </FancyCardContext.Provider>
    );
  }
);
FancyCard.displayName = "FancyCard";

interface FancyCardTitleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: string;
  titleClassName?: string;
}

const FancyCardTitle = React.forwardRef<HTMLDivElement, FancyCardTitleProps>(
  ({ className, title, icon, tooltip, titleClassName, ...props }, ref) => {
    const { theme } = useFancyCardContext();

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 justify-between", className)}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon ? (
            <div className={theme.icon}>{icon}</div>
          ) : (
            <div className={`w-2 h-2 rounded-full ${theme.dot}`} />
          )}
          <h3
            className={cn(
              `font-semibold text-lg ${theme.title}`,
              titleClassName
            )}
          >
            {title}
          </h3>
        </div>
        {tooltip && (
          <ResponsiveTooltip
            trigger={<Info className={`w-5 h-5 ${theme.icon} cursor-help`} />}
          >
            {tooltip}
          </ResponsiveTooltip>
        )}
      </div>
    );
  }
);
FancyCardTitle.displayName = "FancyCardTitle";

const FancyCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { theme } = useFancyCardContext();

  return (
    <div
      ref={ref}
      className={cn(`border-t pt-3 ${theme.borderTop}`, className)}
      {...props}
    >
      {children}
    </div>
  );
});
FancyCardFooter.displayName = "FancyCardFooter";

export { FancyCard, FancyCardFooter, FancyCardTitle };
export type { ColorTheme };
