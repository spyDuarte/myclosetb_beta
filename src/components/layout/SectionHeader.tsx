import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const SectionHeader = ({
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/50 pb-6 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
};
