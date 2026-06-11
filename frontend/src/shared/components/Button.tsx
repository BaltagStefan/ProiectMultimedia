import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} className={cn("button", className)} {...props}>
      {children}
    </button>
  ),
);
Button.displayName = "Button";

