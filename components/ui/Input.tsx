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
                    'border-2 border-black',
                    'bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-black focus:border-black',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'font-mono text-sm',
                    'transition-colors duration-150',
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
