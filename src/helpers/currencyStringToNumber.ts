export function currencyStringToNumber(value: string | number) {
	if (typeof value === 'number') {
		return value;
	}

	const currency = value.replace(/\./g, '').replace(',', '.');

	return Number(currency);
}
