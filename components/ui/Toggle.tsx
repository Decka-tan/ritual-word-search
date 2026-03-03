import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
    ({ checked, onChange, label, disabled = false, className }, ref) => {
        const handleClick = () => {
            if (!disabled) {
                onChange(!checked);
            }
        };

        return (
            <button
                ref={ref}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={handleClick}
                className={cn(
                    'relative inline-flex h-7 w-13 items-center rounded-full transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
                    checked ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-zinc-700',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >
                <span
                    className={cn(
                        'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200',
                        checked ? 'translate-x-7' : 'translate-x-1'
                    )}
                />
                {label && (
                    <span className="ml-3 text-sm font-semibold text-zinc-300">{label}</span>
                )}
            </button>
        );
    }
);

Toggle.displayName = 'Toggle';
