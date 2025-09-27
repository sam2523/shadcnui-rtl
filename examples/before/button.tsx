import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "pl-4 pr-4 py-2",
          "hover:bg-primary/90",
          "text-left",
          "border-l-2 border-r",
          "ml-2 mr-4",
          "rounded-tl-lg rounded-br-md",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

export function NavigationButtons() {
  return (
    <div className="flex items-center gap-4">
      <Button className="pl-2 pr-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      <Button className="pl-4 pr-2">
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

export default Button