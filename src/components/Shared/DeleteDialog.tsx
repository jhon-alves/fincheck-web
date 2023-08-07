import { Box, Grid, Button, Typography } from '@mui/material';
import { Dialog, DialogContent, DialogActions } from './Dialogs';
import deleteIcon from '../../assets/imgs/delete-icon.svg';

interface DeleteDialogProps {
  open: boolean;
  onClose(): void;
  title: string;
  description?: string;
  onConfirm(): void;
}

export function DeleteDialog({ onConfirm, open, onClose, title, description }: DeleteDialogProps) {
	return (
		<Dialog
			title="Excluir"
			open={open}
			onClose={onClose}
		>
			<DialogContent>
				<Grid item xs={12}>
					<Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="30px">
						<img src={deleteIcon} alt="delete" width={52} />
						<Typography variant="h4" align="center">{title}</Typography>
					</Box>
				</Grid>
				{description && (
					<Grid item xs={12}>
						<Box padding="1rem">
							<Typography variant="body1" align="center">{description}</Typography>
						</Box>
					</Grid>
				)}
			</DialogContent>
			<DialogActions>
				<Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="30px">
					<Button
						fullWidth
						variant="outlined"
						onClick={onClose}
					>
              Voltar
					</Button>
					<Button
						fullWidth
						color="error"
						variant="contained"
						onClick={onConfirm}
					>
              Excluir
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}
