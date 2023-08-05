import { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { MuiDialogContent } from './styles';

interface DialogContentProps {
  children: ReactNode;
}

export function DialogContent({ children }: DialogContentProps) {
	return (
		<MuiDialogContent>
			<Grid container spacing={3}>
				{children}
			</Grid>
		</MuiDialogContent>
	);
}
