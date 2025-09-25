import { cn } from "@/lib/utils";
import { Icons } from "../icons";

interface LoaderProps {
  className?: string;
  text?: string;
}

export default function Loader({ className, text }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}
