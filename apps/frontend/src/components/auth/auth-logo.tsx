interface AuthLogoProps {
  variant?: 'light' | 'dark';
}

export const AuthLogo = ({ variant = 'light' }: AuthLogoProps) => {
  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`h-10 w-10 shrink-0 rounded-full ${isLight ? 'bg-white' : 'bg-brand'}`}
        aria-hidden="true"
      />
      <span
        className={`text-xl font-bold tracking-tight sm:text-2xl ${isLight ? 'text-white' : 'text-brand'}`}
      >
        Free Tick
      </span>
    </div>
  );
};
