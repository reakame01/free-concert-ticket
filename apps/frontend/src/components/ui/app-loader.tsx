import { Loader2 } from 'lucide-react';

interface AppLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const AppLoader = ({
  message = 'Loading...',
  fullScreen = false,
}: AppLoaderProps) => {
  const content = (
    <div
      className="flex flex-col items-center gap-3 text-center"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2
        className="h-10 w-10 animate-spin text-brand"
        strokeWidth={1.75}
        aria-hidden
      />
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page px-4">
        {content}
      </div>
    );
  }

  return content;
};
