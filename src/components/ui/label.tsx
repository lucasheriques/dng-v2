"use client";

import { Label as HLabel } from "@headlessui/react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const HeadlessLabel = React.forwardRef<
  React.ElementRef<typeof HLabel>,
  React.ComponentPropsWithoutRef<typeof HLabel>
>(({ className, ...props }, ref) => (
  <HLabel ref={ref} className={cn(labelVariants(), className)} {...props} />
));
HeadlessLabel.displayName = HLabel.displayName;

export { HeadlessLabel, Label };
