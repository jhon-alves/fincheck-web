import {
	styled,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';

export const MuiDialog = styled(Dialog)({
	'& .MuiDialog-paper': {
		maxWidth: 500,
		borderRadius: 18,
	},

	'& .MuiBackdrop-root': {
		background: 'rgba(0, 0, 0, 0.6)',
		backdropFilter: 'blur(5px)'
	}
});

export const MuiDialogTitle = styled(DialogTitle)({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '24px 32px'
});

export const MuiDialogContent = styled(DialogContent)({
	padding: '24px 32px 16px'
});

export const MuiDialogActions = styled(DialogActions)({
	padding: '16px 32px 24px'
});
