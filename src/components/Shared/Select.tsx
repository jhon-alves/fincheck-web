import { Select as MuiSelect, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { ReactNode } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

interface SelectProps {
  label: string;
  value?: string;
  onChange?(e: SelectChangeEvent): void;
  children: ReactNode;
  error?: string;
}

export function Select({ label, value, onChange, error, children }: SelectProps) {
	return (
		<FormControl fullWidth error={!!error}>
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
			{error && (
				<FormHelperText>{error}</FormHelperText>
			)}
		</FormControl>

	);
}
