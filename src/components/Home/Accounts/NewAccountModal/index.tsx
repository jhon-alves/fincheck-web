import { useState } from 'react';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
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
	const { isNewAccountModalOpen, handleNewAccountModalOpen } = useAccountModal();
	const [selectedColor, setSelectedColor] = useState<string>('');

	function handleSelectColor(e: SelectChangeEvent) {
		console.log(e.target.value);
		setSelectedColor(e.target.value);
	}

	return (
		<Dialog
			title="Nova conta"
			open={isNewAccountModalOpen}
			onClose={handleNewAccountModalOpen}
		>
			<DialogContent>
				<Grid item xs={12}>
					<InputCurrency />
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						label="Nome da conta"
						// value={age}
						// onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<Select
						label="Tipo"
						// value={age}
						// onChange={handleChange}
					>
						<MenuItem value={34}>teste2</MenuItem>
						<MenuItem value={543}>te4534</MenuItem>
					</Select>
				</Grid>
				<Grid item xs={12}>
					<Select
						label="Cor"
						value={selectedColor}
						onChange={handleSelectColor}
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
