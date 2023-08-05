import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
	Dialog,
	DialogContent,
	DialogActions,
	InputCurrency,
} from '../../../Shared';
import { Select } from '../../../Shared';
import { useTransactionModal } from './useTransactionModal';

export function NewTransactionModal() {
	const {
		newTransactionType,
		isNewTransactionModalOpen,
		closeNewTransactionModal
	} = useTransactionModal();
	const isExpense = newTransactionType === 'EXPENSE';

	return (
		<Dialog
			title={isExpense ? 'Nova Despesa' : 'Nova Receita'}
			open={isNewTransactionModalOpen}
			onClose={closeNewTransactionModal}
		>
			<DialogContent>
				<Grid item xs={12}>
					<span>Valor da {isExpense ? 'despesa' : 'receita'}</span>
					<InputCurrency />
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						label={isExpense ? 'Nova Despesa' : 'Nova Receita'}
						// value={age}
						// onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<Select
						label="Categoria"
						// value={age}
						// onChange={handleChange}
					>
						<MenuItem value={34}>teste2</MenuItem>
						<MenuItem value={543}>te4534</MenuItem>
					</Select>
				</Grid>
				<Grid item xs={12}>
					<Select
						label={isExpense ? 'Pagar com' : 'Receber com'}
						// value={selectedColor}
						// onChange={handleSelectColor}
					>
						<MenuItem value={34}>teste2</MenuItem>
						<MenuItem value={543}>te4534</MenuItem>
					</Select>
				</Grid>
				<Grid item xs={12}>
					<DatePicker
						// value={}
						// onChange={}
						sx={{ width: '100%' }}
						label="Data"
					/>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					fullWidth
					variant="contained"
				>
          Criar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
