import { CheckCircle2 } from "lucide-react"
import { cn } from "@/utils/utils"

interface SelectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean
  icon?: React.ReactNode
  title: string
  description?: string
  price?: number
  selectedClassName?: string
  unselectedClassName?: string
}

export const SelectButton = ({
  isSelected = false,
  icon,
  title,
  description,
  price,
  selectedClassName = "border-primary bg-primary/5",
  unselectedClassName = "border-gray-200 bg-white hover:border-primary/30",
  className,
  ...props
}: SelectButtonProps) => {
  return (
    <button
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left w-full",
        isSelected ? selectedClassName : unselectedClassName,
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <CheckCircle2 style={{ visibility: isSelected ? 'visible' : 'hidden' }} className="text-primary w-5 h-5" />
        {icon && <span className="text-xl">{icon}</span>}
        <div>
          <div className={cn("font-semibold", isSelected ? "text-primary" : "text-gray-900")}>
            {title}
          </div>
          {description && (
            <div className="text-xs text-gray-500">{description}</div>
          )}
        </div>
      </div>
      {price !== undefined && (
        <div className={cn("font-semibold text-lg", isSelected ? "text-red-500" : "text-gray-700")}>
          {price > 0 ? `+₫${price.toLocaleString()}` : 'Free'}
        </div>
      )}
    </button>
  )
} 