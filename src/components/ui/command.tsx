"use client";

import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const Command = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive>) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md text-popover-foreground bg-background",
      className
    )}
    {...props}
  />
);
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-slate-900/30 z-50 backdrop-blur-xs" />
        <DialogContent className="overflow-hidden p-0 shadow-2xl shadow-primary/10 max-w-[95%] sm:max-w-lg border border-white/10 top-[10%] sm:top-[50%] translate-y-[-10%] sm:translate-y-[-50%]">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            {children}
          </Command>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const CommandInput = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Input>) => (
  <div
    className="flex items-center border-b border-white/10 px-3"
    cmdk-input-wrapper=""
  >
    <Search className="mr-2 h-4 w-4 shrink-0 text-slate-600" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden text-white placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
);

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.List>) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[300px] overflow-y-auto overflow-x-hidden nice-scrollbar",
      className
    )}
    {...props}
  />
);

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = ({
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Empty>) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-white/60"
    {...props}
  />
);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-white [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-primary",
      className
    )}
    {...props}
  />
);

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Separator>) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-white/10", className)}
    {...props}
  />
);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden text-white/70 transition-colors duration-75",
      "data-[disabled=true]:pointer-events-none",
      "data-[selected='true']:bg-linear-to-r from-primary/20 via-primary/10 to-transparent",
      "data-[selected=true]:text-white",
      "data-[disabled=true]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-teal-300",
      className
    )}
    {...props}
  />
);

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-primary/50",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
