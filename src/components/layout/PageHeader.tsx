import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 border-b border-border/60 pb-8 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <div className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </div>
        {description && (
          <div className="text-base text-muted-foreground md:text-lg">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
};
