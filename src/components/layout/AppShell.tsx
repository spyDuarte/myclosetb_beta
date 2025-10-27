import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export const AppShell = ({ children, className }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-surface">
      <div
        className={cn(
          "bg-gradient-to-br from-white/90 via-white/70 to-white/40 dark:from-zinc-900/80 dark:via-zinc-900/60 dark:to-zinc-900/40",
          "backdrop-blur-[80px] min-h-screen",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
