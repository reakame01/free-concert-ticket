import type { FieldErrors, FieldValues } from 'react-hook-form';

const formatFieldMessage = (
  message: string,
  field: string,
  invalidInputFallback: string,
): string => {
  if (message.startsWith('Invalid input')) {
    if (field === 'password') {
      return invalidInputFallback;
    }
    if (field === 'username') {
      return invalidInputFallback;
    }
    return invalidInputFallback;
  }
  return message;
};

export const getFirstFieldError = <T extends FieldValues>(
  errors: FieldErrors<T>,
  invalidInputFallback = 'Please check your input and try again',
): string | undefined => {
  const priority: string[] = [
    'username',
    'password',
    'confirmPassword',
    'name',
    'description',
    'totalSeats',
  ];

  for (const field of priority) {
    const error = errors[field as keyof T];
    if (error && typeof error === 'object' && 'message' in error) {
      return formatFieldMessage(
        String(error.message),
        field,
        invalidInputFallback,
      );
    }
  }

  const firstKey = Object.keys(errors)[0];
  if (!firstKey) {
    return undefined;
  }
  const error = errors[firstKey as keyof T];
  if (error && typeof error === 'object' && 'message' in error) {
    return formatFieldMessage(
      String(error.message),
      firstKey,
      invalidInputFallback,
    );
  }
  return undefined;
};
