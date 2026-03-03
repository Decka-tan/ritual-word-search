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
                    'relative inline-flex h-8 w-14 items-center rounded-none transition-colors duration-150',
                    'border-2 border-black',
                    'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
                    checked ? 'bg-black' : 'bg-white',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >
                <span
                    className={cn(
                        'inline-block h-5 w-5 bg-white border-2 border-black transition-transform duration-150',
                        checked ? 'translate-x-7' : 'translate-x-0.5'
                    )}
                />
                {label && (
                    <span className="ml-3 text-sm font-semibold text-black">{label}</span>
                )}
            </button>
        );
    }
);

Toggle.displayName = 'Toggle';
