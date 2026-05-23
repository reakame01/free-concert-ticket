import Link from 'next/link';

interface AuthFooterLinkProps {
  message: string;
  linkText: string;
  href: string;
}

export const AuthFooterLink = ({
  message,
  linkText,
  href,
}: AuthFooterLinkProps) => {
  return (
    <p className="mt-8 text-center text-sm text-gray-600 sm:text-base">
      {message}{' '}
      <Link
        href={href}
        className="font-semibold text-accent transition-colors hover:text-accent-hover hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
};
