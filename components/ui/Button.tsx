import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
    primary: 'bg-accent text-black hover:bg-accent/90 font-mono text-sm uppercase tracking-wider',
    secondary: 'bg-transparent border border-border text-text-primary hover:border-accent hover:text-accent font-mono text-sm uppercase tracking-wider',
    danger: 'bg-red-500 text-white hover:bg-red-600 font-mono text-sm uppercase tracking-wider',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface transition-colors',
};

const sizeStyles = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center',
                    'font-semibold',
                    'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-200',
                    'rounded-lg',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
