import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type AppBadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface AppBadgeProps {
  label: string;
  labelClassName?: string;
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

function Badge({
  label,
  variant = "default",
  className,
  labelClassName = "",
  asChild = false,
  ...props
}: AppBadgeProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(
        "border rounded-full font-medium text-sm px-2 py-0.5",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <span className={cn("", labelClassName)}>{label}</span>
    </Comp>
  );
}

export { Badge };
