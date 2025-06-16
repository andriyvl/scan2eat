import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Drawer = DialogPrimitive.Root
const DrawerTrigger = DialogPrimitive.Trigger
const DrawerClose = DialogPrimitive.Close

const DrawerPortal = DialogPrimitive.Portal

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    isOverlayImage?: boolean
  }
>(({ className, children, isOverlayImage = false, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      aria-describedby="drawer-description"
      ref={ref}
      className={cn(
        isOverlayImage 
          ? "fixed inset-0 z-[100] flex items-end justify-center bg-transparent p-0 m-0"
          : "fixed inset-0 z-[100] flex flex-col bg-transparent p-0 m-0 overflow-y-auto",
        className
      )}
      {...props}
    >
      {isOverlayImage ? (
        <div className="w-full max-w-md mx-auto rounded-t-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      ) : (
        children
      )}
    </DialogPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = DialogPrimitive.Content.displayName

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
} 