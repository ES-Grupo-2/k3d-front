import * as React from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
}

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",

  outline: "border border-primary/40 bg-transparent hover:bg-primary/10",

  ghost: "bg-transparent hover:bg-primary/10",

  destructive: "bg-destructive text-white hover:bg-destructive/90",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
