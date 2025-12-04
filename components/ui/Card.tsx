// Карточка с hover-эффектами
import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  gradient?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, gradient = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-white shadow-md transition-all duration-300',
          hover && 'hover:shadow-xl hover:-translate-y-1',
          gradient && 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-50/50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
          className
        )}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-3', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-3', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-3 flex items-center', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'
