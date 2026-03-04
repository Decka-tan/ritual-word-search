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
                    'border-2 border-gray-300 dark:border-zinc-600 rounded-xl',
                    'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'font-sans text-sm',
                    'transition-all duration-200',
                    'hover:border-gray-400 dark:hover:border-zinc-500',
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
