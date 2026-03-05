import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    'w-full px-4 py-3',
                    'border border-border rounded-xl',
                    'bg-surface text-text-primary placeholder:text-text-secondary',
                    'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'resize-y min-h-[120px]',
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

Textarea.displayName = 'Textarea';
