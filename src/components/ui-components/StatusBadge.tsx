
import { cn } from "@/lib/utils";

type StatusType = "Open" | "Closed" | "Pending";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case "Open":
        return "bg-success/15 text-success border-success/30";
      case "Closed":
        return "bg-destructive/15 text-destructive border-destructive/30";
      case "Pending":
        return "bg-warning/15 text-warning border-warning/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <span 
      className={cn(
        "status-badge border", 
        getStatusClasses(), 
        className
      )}
    >
      {status}
    </span>
  );
}
