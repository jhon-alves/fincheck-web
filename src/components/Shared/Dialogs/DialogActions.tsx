import { ReactNode } from 'react';
import { MuiDialogActions } from './styles';

interface DialogActionsProps {
  children: ReactNode;
}

export function DialogActions({ children }: DialogActionsProps) {
	return (
		<MuiDialogActions>
			{children}
		</MuiDialogActions>
	);
}
