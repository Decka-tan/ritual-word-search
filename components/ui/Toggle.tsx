import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    icon?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
    ({ checked, onChange, label, disabled = false, className, icon }, ref) => {
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
                    'flex items-center justify-between gap-3 w-full',
                    'py-2',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-lg">{icon}</span>}
                    {label && (
                        <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                            {label}
                        </span>
                    )}
                </div>

                <div
                    className={cn(
                        'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all duration-200',
                        checked
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                            : 'bg-gray-300 dark:bg-zinc-700',
                        disabled && 'cursor-not-allowed'
                    )}
                >
                    <span
                        className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200',
                            checked ? 'translate-x-6' : 'translate-x-1'
                        )}
                    />
                </div>
            </button>
        );
    }
);

Toggle.displayName = 'Toggle';
