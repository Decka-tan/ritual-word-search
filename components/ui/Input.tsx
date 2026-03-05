import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', ...props }, ref) => {
        return (
            <input
                type={type}
                ref={ref}
                className={cn(
                    'w-full px-4 py-3',
                    'border border-border rounded-xl',
                    'bg-surface text-text-primary placeholder:text-text-secondary',
                    'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'font-sans text-sm',
                    'transition-all duration-200',
                    'hover:border-text-secondary/30',
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
