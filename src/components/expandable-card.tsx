import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { ChevronDown } from "lucide-react";

interface ExpandableCardProps {
  title?: string;
  summary: React.ReactNode;
  fullContent: React.ReactNode;
  footer?: React.ReactNode;
}

export function ExpandableCard({
  title,
  summary,
  fullContent,
  footer,
}: ExpandableCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="rounded-xl text-left outline-primary">
          <Card className="w-full cursor-pointer group transition-all duration-300 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:shadow-lg">
            <CardHeader>
              {title && (
                <CardTitle className="text-white group-hover:text-primary transition-colors">
                  {title}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-white/80">{summary}</p>
            </CardContent>
            {footer && <CardFooter>{footer}</CardFooter>}
            <div className="absolute bottom-4 right-4 text-white/60 group-hover:text-primary transition-colors">
              <ChevronDown className="w-5 h-5" />
            </div>
          </Card>
        </button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-slate-900/30 z-50 backdrop-blur-xs" />
        <DialogContent className="bg-slate-950 md:max-w-2xl gap-8 max-h-[80vh] overflow-y-auto max-w-[90%] nice-scrollbar">
          <DialogTitle className="text-primary text-2xl">{title}</DialogTitle>
          {fullContent}

          {footer && (
            <DialogFooter className="items-start sm:justify-start">
              {footer}
            </DialogFooter>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
