import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const variantClasses = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:opacity-90 hover:shadow-md",
  secondary:
    "bg-transparent text-foreground border border-border hover:border-primary hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] active:duration-75",
          "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
