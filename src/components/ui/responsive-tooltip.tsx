import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface Props {
  trigger?: React.ReactNode;
  duration?: number;
  children: React.ReactNode;
}

export function ResponsiveTooltip({
  trigger,
  children,
  duration = 100,
}: Props) {
  return (
    <>
      <TooltipProvider delayDuration={duration}>
        <Tooltip>
          <TooltipTrigger className="hidden lg:flex gap-1 cursor-help items-center justify-center">
            {trigger || <Info size={16} />}
          </TooltipTrigger>
          <TooltipContent className="max-w-[250px]">
            <div className="max-w-fit">{children}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Popover>
        <PopoverTrigger className="flex lg:hidden gap-1 items-center justify-center cursor-pointer">
          {trigger || <Info size={16} />}
        </PopoverTrigger>
        <PopoverContent className="text-sm">{children}</PopoverContent>
      </Popover>
    </>
  );
}
