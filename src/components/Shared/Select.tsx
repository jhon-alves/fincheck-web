import { Select as MuiSelect, FormControl, InputLabel } from '@mui/material';
import { ReactNode } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

interface SelectProps {
  label: string;
  value?: string;
  onChange?(e: SelectChangeEvent): void;
  children: ReactNode;
}

export function Select({ label, value, onChange, children }: SelectProps) {
	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			<MuiSelect
				fullWidth
				variant="outlined"
				label={label}
				value={value}
				onChange={onChange}
			>
				{children}
			</MuiSelect>
		</FormControl>

	);
}
