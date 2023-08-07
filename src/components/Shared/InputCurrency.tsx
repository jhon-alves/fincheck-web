import { CrossCircledIcon } from '@radix-ui/react-icons';
import { NumericFormat } from 'react-number-format';

interface InputCurrency {
  error?: string;
  onChange(value: string): void;
  value?: string | number;
}

export function InputCurrency({ error, value, onChange }: InputCurrency) {
	return (
		<div>
			<NumericFormat
				className="text-gray-800 text-[32px] font-bold w-full outline-none"
				thousandSeparator="."
				decimalSeparator=","
				onChange={event => onChange(event.target.value)}
				value={value}
			/>
			{error && (
				<div className="flex items-center gap-2 mt-2 text-red-900">
					<CrossCircledIcon />
					<span className="text-xs">{error}</span>
				</div>
			)}
		</div>
	);
}
