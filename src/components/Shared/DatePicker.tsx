import { useState } from 'react';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers';

interface DatePickerProps {
  label: string;
  onChange(value: string): void;
  value: string;
}

export function DatePicker({ label, onChange, value }: DatePickerProps) {
	const [value, setValue] = useState<Dayjs | null>(null);

	return (
		<MuiDatePicker
			sx={{ width: '100%' }}
			label={label}
			onChange={(newValue) => onChange(newValue)}
			value={value}
		/>
	);
}
