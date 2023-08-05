import { ReactNode } from 'react';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
  type: 'button' | 'submit';
  variant: 'outlined' | 'contained' | 'text';
  onClick?(): void;
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({ type, variant, isLoading, onClick, children }: ButtonProps) {
	return (
		<MuiButton
			color="primary"
			type={type}
			variant={variant}
			disabled={isLoading}
			onClick={onClick}
		>
			{children}
		</MuiButton>
	);
}
