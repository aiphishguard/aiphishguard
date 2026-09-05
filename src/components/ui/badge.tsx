import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        safe: "border-transparent bg-[hsl(var(--threat-safe)/0.15)] text-[hsl(var(--threat-safe))]",
        low: "border-transparent bg-[hsl(var(--threat-low)/0.15)] text-[hsl(var(--threat-low))]",
        medium: "border-transparent bg-[hsl(var(--threat-medium)/0.15)] text-[hsl(var(--threat-medium))]",
        high: "border-transparent bg-[hsl(var(--threat-high)/0.15)] text-[hsl(var(--threat-high))]",
        critical: "border-transparent bg-[hsl(var(--threat-critical)/0.18)] text-[hsl(var(--threat-critical))]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
