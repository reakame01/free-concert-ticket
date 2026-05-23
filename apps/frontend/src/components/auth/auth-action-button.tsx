import type { ButtonHTMLAttributes } from 'react';

interface AuthActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const AuthActionButton = ({
  label,
  className = '',
  type = 'submit',
  ...buttonProps
}: AuthActionButtonProps) => {
  return (
    <button
      type={type}
      className={`w-full rounded-lg bg-accent py-3.5 text-base font-semibold text-white transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...buttonProps}
    >
      {label}
    </button>
  );
};
