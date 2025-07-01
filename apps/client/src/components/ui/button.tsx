import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  // pointer-events-auto transition-all disabled:opacity-60 disabled:cursor-not-allowed
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary-hover",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        pill: "w-full flex items-center justify-between gap-4 font-semibold px-6  shadow-lg ",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        md: "h-10 rounded-xl px-4 py-2 text-sm",
        lg: "h-14 rounded-2xl px-6 py-4 text-md",
        xl: "h-16 rounded-3xl px-8 py-4 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, leftIcon: leftContent, rightContent, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <div className="relative grid grid-cols-[1fr,4fr,1fr] items-center w-full gap-4">
          <div className="flex justify-start">
            {leftContent && (
              <span className="flex-shrink-0 font-bold text-xl flex items-center justify-center">
                {leftContent}
              </span>
            )}
          </div>
          <span className="text-center font-semibold">
            {children}
          </span>
          <div className="flex justify-end">
            {rightContent && (
              <span className="flex-shrink-0 font-bold text-xl flex items-center justify-center">
                {rightContent}
              </span>
            )}
          </div>
        </div>
      </Comp>
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
