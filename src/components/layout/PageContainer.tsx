import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-7xl px-4 pb-16 pt-10 md:px-8 lg:px-12",
        className
      )}
    >
      {children}
    </main>
  );
};
