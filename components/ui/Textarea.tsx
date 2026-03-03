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
                    'border-2 border-black',
                    'bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-black focus:border-black',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'resize-y min-h-[120px]',
                    'font-mono text-sm',
                    'transition-colors duration-150',
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';
