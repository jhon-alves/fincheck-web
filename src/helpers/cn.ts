import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CnProps {
  value: string;
}

export function cn({ value }: CnProps) {
	return twMerge(clsx(value));
}
