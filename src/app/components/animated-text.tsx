import { cn } from "@/lib/utils";
type Props = {
  text: string;
  delay?: number;
  className?: string;
};

export default function AnimatedText({ text, className = "" }: Props) {
  return (
    <span
      className={cn(
        "inline-block",
        "motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-1000",
        className
      )}
    >
      {text}
    </span>
  );
}
