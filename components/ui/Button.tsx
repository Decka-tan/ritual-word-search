import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-900 border-2 border-black',
    secondary: 'bg-white text-black hover:bg-gray-100 border-2 border-black',
    ghost: 'bg-transparent text-black hover:bg-gray-100 border-2 border-transparent',
};

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center',
                    'font-semibold',
                    'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors duration-150',
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
