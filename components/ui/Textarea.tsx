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
                    'border-2 border-gray-200 rounded-xl',
                    'bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'resize-y min-h-[120px]',
                    'font-sans text-sm',
                    'transition-all duration-200',
                    'hover:border-gray-300',
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';
