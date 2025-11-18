import { cn } from "@/lib/utils";

type RiskLevel = "low" | "medium" | "high";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const riskConfig = {
  low: {
    label: "Low Risk",
    className: "bg-success/10 text-success border-success/20",
  },
  medium: {
    label: "Medium Risk",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  high: {
    label: "High Risk",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const RiskBadge = ({ level, className }: RiskBadgeProps) => {
  const config = riskConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
