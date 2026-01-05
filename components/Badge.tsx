import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AppBadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface AppBadgeProps {
  label: string;
  variant?: AppBadgeVariant;
  className?: string;
}

const variantClasses: Record<AppBadgeVariant, string> = {
  default: "",
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  danger: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
};

const AppBadge: React.FC<AppBadgeProps> = ({
  label,
  variant = "default",
  className,
}) => {
  return (
    <Badge
      className={cn(
        "border font-medium text-xs px-2 py-0.5",
        variantClasses[variant],
        className
      )}
    >
      {label}
    </Badge>
  );
};

export default AppBadge;
