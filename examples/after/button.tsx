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
          "ps-4 pe-4 py-2",
          "hover:bg-primary/90",
          "text-start",
          "border-s-2 border-e",
          "ms-2 me-4",
          "rounded-ts-lg rounded-be-md",
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
      <Button className="ps-2 pe-4">
        <ChevronLeft className="me-2 h-4 w-4 rtl:rotate-180" />
        Previous
      </Button>
      <Button className="ps-4 pe-2">
        Next
        <ChevronRight className="ms-2 h-4 w-4 rtl:rotate-180" />
      </Button>
    </div>
  )
}

export default Button