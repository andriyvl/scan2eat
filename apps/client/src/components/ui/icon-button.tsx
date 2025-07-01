import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/utils"

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-colors  disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover",
        outline: "bg-white/80 hover:bg-white text-red-500 shadow",
        ghost: "hover:bg-gray-100",
      },
      size: {
        sm: "w-6 h-6 [&_svg]:size-4",
        md: "w-8 h-8 [&_svg]:size-5",
        lg: "w-10 h-10 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants } 