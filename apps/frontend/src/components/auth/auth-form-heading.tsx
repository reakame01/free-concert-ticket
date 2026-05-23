interface AuthFormHeadingProps {
  title: string;
}

export const AuthFormHeading = ({ title }: AuthFormHeadingProps) => {
  return (
    <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900">
      {title}
    </h1>
  );
};
