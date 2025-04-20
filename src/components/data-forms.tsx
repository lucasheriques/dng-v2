import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import React from "react";
import Balancer from "react-wrap-balancer";

export function DataForm({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden dark:bg-slate-900/50",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DataFormHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-muted px-3 py-2 font-semibold", className)}>
      {children}
    </div>
  );
}

export function DataFormRow<T extends React.ElementType = "label">({
  as,
  label,
  children,
  className = "",
  tooltipContent,
  inputId,
  ...props
}: {
  as?: T;
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tooltipContent?: string;
  inputId?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">) {
  const Component = as || "label";
  const labelProps = Component === "label" ? { htmlFor: inputId } : {};

  return (
    <div
      className={`grid grid-cols-2 items-stretch border-b last:border-b-0 ${className}`}
    >
      <Component
        {...labelProps}
        className="px-3 py-2 bg-slate-800/50 border-r text-sm flex justify-between items-center"
        {...props}
      >
        {label}
        {tooltipContent && (
          <>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="hidden lg:block">
                  <Info size={16} />
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  <Balancer>{tooltipContent}</Balancer>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Popover>
              <PopoverTrigger className="block lg:hidden">
                <Info size={16} />
              </PopoverTrigger>
              <PopoverContent className="text-sm">
                {tooltipContent}
              </PopoverContent>
            </Popover>
          </>
        )}
      </Component>
      <div>{children}</div>
    </div>
  );
}

interface TableInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  autoFocus?: boolean;
  id?: string;
  className?: string;
}

export function DataFormInput({
  value,
  onChange,
  required,
  placeholder,
  prefix,
  suffix,
  autoFocus = false,
  id,
  className,
}: TableInputProps) {
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    // Remove any non-numeric characters except comma and dot
    let newValue = pastedText.replace(/[^\d.,]/g, "");

    // Replace comma with dot for calculation
    newValue = newValue.replace(".", "");
    newValue = newValue.replace(",", ".");

    onChange(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative flex items-center w-full">
      {prefix && (
        <span className="absolute left-2 text-tertiary-text pointer-events-none">
          {prefix}
        </span>
      )}
      <Input
        id={id}
        type="number"
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        className={cn(
          "w-full bg-transparent p-2 focus-visible:ring-offset-0 border-none rounded",
          prefix ? "pl-8" : "pl-2",
          suffix ? "pr-8" : "pr-2",
          "[appearance:textfield]",
          "[&::-webkit-outer-spin-button]:appearance-none",
          "[&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
      />
      {suffix && (
        <span className="absolute right-2 text-tertiary-text pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function DataFormInfoRow({
  label,
  value,
  type = "neutral",
  tooltipContent,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  type?: "addition" | "deduction" | "neutral";
  tooltipContent?: string;
  className?: string;
}) {
  const valueClassName = {
    addition: "text-green-400",
    deduction: "text-red-400",
    neutral: "text-secondary-text",
  };

  const potentialInputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <DataFormRow
      label={label}
      as="div"
      tooltipContent={tooltipContent}
      inputId={potentialInputId}
    >
      <div
        className={cn("px-3 py-2 text-right", valueClassName[type], className)}
      >
        {type === "addition" ? "+" : type === "deduction" ? "-" : ""}
        {value}
      </div>
    </DataFormRow>
  );
}
