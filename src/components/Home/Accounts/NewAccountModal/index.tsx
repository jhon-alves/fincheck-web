import { Controller } from 'react-hook-form';
import { Box, Grid, TextField, Button, MenuItem, Typography } from '@mui/material';
import {
	Dialog,
	DialogContent,
	DialogActions,
	InputCurrency,
} from '../../../Shared';
import { Select } from '../../../Shared';
import { useAccountModal } from './useAccountModal';
import { ColorIcon } from '../../../Icons';

type Color = {
  color: string;
  bg: string;
  name: string;
}

const colors: Color[] = [
	{ color: '#ef4444', bg: '#fecaca', name: 'Vermelho' },
	{ color: '#f97316', bg: '#fed7aa', name: 'Laranja' },
	{ color: '#22c55e', bg: '#bbf7d0', name: 'Verde' },
	{ color: '#3b82f6', bg: '#bfdbfe', name: 'Azul' },
	{ color: '#6366f1', bg: '#c7d2fe', name: 'Indigo' },
	{ color: '#8b5cf6', bg: '#ddd6fe', name: 'Violeta' },
	{ color: '#a855f7', bg: '#e9d5ff', name: 'Roxo' },
	{ color: '#ec4899', bg: '#fbcfe8', name: 'Rosa' },
];

export function NewAccountModal() {
	const {
		isNewAccountModalOpen,
		handleNewAccountModalOpen,
		errors,
		control,
		isLoading,
		handleCreateAccountSubmit
	} = useAccountModal();

	return (
		<Dialog
			title="Nova conta"
			open={isNewAccountModalOpen}
			onClose={handleNewAccountModalOpen}
		>
			<form onSubmit={handleCreateAccountSubmit}>
				<DialogContent>
					<Grid item xs={12}>
						<Box display="flex" alignItems="center" gap="0.6rem">
							<Typography variant="h3">R$</Typography>
							<Controller
								control={control}
								name="initialBalance"
								render={({ field: { value, onChange } }) => (
									<InputCurrency
										error={errors.initialBalance?.message}
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
									label="Nome da conta"
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
							name="type"
							render={({ field: { value, onChange } }) => (
								<Select
									label="Tipo"
									error={errors.type?.message}
									onChange={onChange}
									value={value}
								>
									<MenuItem value="CHECKING">Conta Corrente</MenuItem>
									<MenuItem value="INVESTMENT">Investimentos</MenuItem>
									<MenuItem value="CASH">Dinheiro Físico</MenuItem>
								</Select>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Controller
							control={control}
							name="color"
							render={({ field: { value, onChange } }) => (
								<Select
									label="Cor"
									error={errors.color?.message}
									onChange={onChange}
									value={value}
								>
									{colors.map(({ color, bg, name }) => (
										<MenuItem
											key={name}
											value={color}
										>
											<ColorIcon color={color} bg={bg} />
											{name}
										</MenuItem>
									))}
								</Select>
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
