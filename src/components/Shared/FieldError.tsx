import { CircleAlert } from 'lucide-react';

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-expense-strong"
    >
      <CircleAlert size={14} aria-hidden className="shrink-0" />
      {message}
    </p>
  );
}
