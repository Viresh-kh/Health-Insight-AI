import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glass";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
      destructive:
        "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:shadow-xl hover:shadow-destructive/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
      outline:
        "border-2 border-primary/20 bg-transparent text-primary hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10",
      secondary:
        "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80",
      ghost: "hover:bg-accent/10 hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      glass: "glass-card text-foreground hover:bg-white/90 dark:hover:bg-white/10 shadow-sm hover:shadow-md transition-all",
    };

    const sizes = {
      default: "h-11 px-5 py-2",
      sm: "h-9 rounded-md px-3 text-sm",
      lg: "h-12 rounded-xl px-8 text-base",
      xl: "h-14 rounded-2xl px-10 text-lg",
      icon: "h-11 w-11",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
