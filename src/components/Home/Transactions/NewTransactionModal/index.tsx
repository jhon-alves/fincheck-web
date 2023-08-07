import { Box, Grid, TextField, Button, MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
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
		control,
		errors,
		accounts,
		categoriesList,
		isLoading,
		newTransactionType,
		isNewTransactionModalOpen,
		closeNewTransactionModal,
		handleNewTransaction
	} = useTransactionModal();
	const isExpense = newTransactionType === 'EXPENSE';

	return (
		<Dialog
			title={isExpense ? 'Nova Despesa' : 'Nova Receita'}
			open={isNewTransactionModalOpen}
			onClose={closeNewTransactionModal}
		>
			<form onSubmit={handleNewTransaction}>
				<DialogContent>
					<Grid item xs={12}>
						<span>Valor da {isExpense ? 'despesa' : 'receita'}</span>
						<Box display="flex" alignItems="center" gap="0.6rem">
							<Typography variant="h3">R$</Typography>
							<Controller
								control={control}
								name="value"
								render={({ field: { value, onChange } }) => (
									<InputCurrency
										error={errors.value?.message}
										onChange={onChange}
										value={value}
									/>
								)}
							/>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Controller
							control={control}
							name="name"
							render={({ field: { value, onChange } }) => (
								<TextField
									fullWidth
									label={isExpense ? 'Nova Despesa' : 'Nova Receita'}
									helperText={errors.name?.message}
									onChange={onChange}
									value={value}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							control={control}
							name="categoryId"
							render={({ field: { value, onChange } }) => (
								<Select
									label="Categoria"
									error={errors.categoryId?.message}
									onChange={onChange}
									value={value}
								>
									{categoriesList.map(category => (
										<MenuItem
											key={category.id}
											value={category.id}
										>
											{category.name}
										</MenuItem>
									))}
								</Select>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							control={control}
							name="bankAccountId"
							render={({ field: { value, onChange } }) => (
								<Select
									label={isExpense ? 'Pagar com' : 'Receber com'}
									error={errors.bankAccountId?.message}
									onChange={onChange}
									value={value}
								>
									{accounts.map(account => (
										<MenuItem
											key={account.id}
											value={account.id}
										>
											{account.name}
										</MenuItem>
									))}
								</Select>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							control={control}
							name="date"
							defaultValue={new Date()}
							render={({ field: { value, onChange } }) => (
								<DatePicker
									sx={{ width: '100%' }}
									label="Data"
									onChange={onChange}
									value={value}
								/>
							)}
						/>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						fullWidth
						type="submit"
						variant="contained"
						disabled={isLoading}
					>
          Criar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
