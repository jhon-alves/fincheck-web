// import { forwardRef, ForwardedRef, ComponentProps } from 'react';
// import { styled, Box, TextField } from '@mui/material';
// import { DistributiveOmit } from '@mui/types';

// interface InputCustomProps  extends ComponentProps<'label', 'type'> {
//   label: string;
//   type: string;
//   error?: string;
// }

// const MuiTextField = styled(TextField)({
// 	'& .MuiInputBase-root': {
// 		borderRadius: 10
// 	}
// });

// export const InputCustom = forwardRef<ForwardedRef<HTMLDivElement>, InputCustomProps>(
// 	({ label, type, error, ...rest }, ref) => {

// 		return (
// 			<Box>
// 				<MuiTextField
// 					{...rest}
// 					fullWidth
// 					variant="outlined"
// 					inputRef={ref}
// 					label={label}
// 					type={type}
// 				/>
// 				{error && (
// 					<span>{error}</span>
// 				)}
// 			</Box>
// 		);
// 	});
