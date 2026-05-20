export const AUTH_BRAND_QUOTE =
  'Book unforgettable live moments, one ticket at a time.';

export const AUTH_BRAND_DESCRIPTION =
  'Discover concerts, reserve your seats, and manage events with Free Tick — your all-in-one concert ticket booking platform.';

export const AuthBrandContent = () => {
  return (
    <div className="mt-10 lg:mt-0">
      <blockquote className="text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl xl:text-[2.75rem] xl:leading-tight">
        &ldquo;{AUTH_BRAND_QUOTE}&rdquo;
      </blockquote>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base lg:mt-6">
        {AUTH_BRAND_DESCRIPTION}
      </p>
    </div>
  );
};
