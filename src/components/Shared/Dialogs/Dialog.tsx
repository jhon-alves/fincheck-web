import { ReactNode } from 'react';
import { Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MuiDialog, MuiDialogTitle } from './styles';

interface DialogProps {
  open: boolean;
  onClose?(): void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, title, onClose, children }: DialogProps) {
	return (
		<MuiDialog open={open} onClose={onClose}>
			<MuiDialogTitle>
				<Typography variant="h3">{title}</Typography>
				<IconButton onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</MuiDialogTitle>
			{children}
		</MuiDialog>
	);
}
