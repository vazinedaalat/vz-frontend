import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-navy-900 text-white shadow-soft hover:bg-navy-800 hover:text-white hover:shadow-lift',
        accent: 'bg-gold-500 text-navy-900 shadow-gold hover:bg-gold-400 hover:text-navy-900 hover:shadow-lift',
        outline:
          'border border-navy-200 bg-white text-navy-900 hover:border-gold-400 hover:bg-navy-50 hover:text-navy-900',
        ghost: 'text-navy-900 hover:bg-navy-50 hover:text-navy-900',
        onDark: 'bg-white text-navy-900 shadow-lift hover:bg-gold-100 hover:text-navy-900',
        outlineOnDark:
          'border border-white/30 bg-transparent text-white hover:border-gold-400 hover:bg-white/10 hover:text-white',
        link: 'text-navy-900 underline-offset-4 hover:text-gold-700 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-4 text-xs [&_svg]:size-4',
        default: 'h-11 px-5 text-sm [&_svg]:size-4',
        lg: 'h-12 px-7 text-sm [&_svg]:size-5 sm:text-base',
        xl: 'h-14 px-8 text-base [&_svg]:size-5',
        icon: 'size-11 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
