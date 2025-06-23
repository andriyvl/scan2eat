import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/utils/utils"
import { Checkbox } from "./checkbox";

export interface ToggleOptionProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  iconClassName?: string;
}

const ToggleOption = React.forwardRef<HTMLDivElement, ToggleOptionProps>(
  ({ icon: Icon, title, description, checked, onChange, className, iconClassName }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className={cn("w-5 h-5 text-gray-500", iconClassName)} />
          <div>
            <div className="font-semibold">{title}</div>
            {description && (
              <div className="text-xs text-gray-500">{description}</div>
            )}
          </div>
        </div>
        <Checkbox
          checked={checked}
          onCheckedChange={() => onChange(!checked)}
        />
      </div>
    );
  }
)
ToggleOption.displayName = "ToggleOption"

export { ToggleOption } 