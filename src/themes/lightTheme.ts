import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();

export const lightTheme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					fontSize: 16,
					fontWeight: 600,
					textTransform: 'capitalize',
					borderRadius: 12,
					padding: '9px 18px',
				}
			}
		},
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundColor: '#fff',
					border: '1px solid #E7EAED'
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				root: {
					fontWeight: 600,
					textTransform: 'capitalize'
				}
			}
		},
	},
	typography: {
		fontFamily: 'Poppins',

		h1: {
			fontWeight: 700,
			fontSize: 32,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 24,
			}
		},
		h2: {
			fontWeight: 700,
			fontSize: 28,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 20,
			}
		},
		h3: {
			fontWeight: 600,
			fontSize: 24,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 20,
			}
		},
		h4: {
			fontWeight: 600,
			fontSize: 20,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 16,
			}
		},
		h5: {
			fontWeight: 600,
			fontSize: 18,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 14,
			}
		},
		subtitle1: {
			fontWeight: 600,
			fontSize: 16,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 14,
			}
		},
		subtitle2: {
			fontWeight: 600,
			fontSize: 14,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 12,
			}
		},
		body1: {
			fontWeight: 400,
			fontSize: 16,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 14,
			}
		},
		body2: {
			fontWeight: 400,
			fontSize: 14,
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 12,
			}
		},
		overline: {
			fontWeight: 600,
			fontSize: 14,
			letterSpacing: 5,
			textTransform: 'uppercase',
			[defaultTheme.breakpoints.down('sm')]: {
				fontSize: 12,
			}
		},
		caption: {
			fontWeight: 400,
			fontSize: 12,
			textTransform: 'lowercase',
		},
	},
	palette: {
		primary: {
			main: '#134e4a',
			light: '#BFACE2',
		},
		secondary: {
			main: '#656565',
			dark: '#333',
			light: '#E7EAED'
		},
		background: {
			default: '#fff',
		},
	},
	transitions: {
		duration: {
			shortest: 150,
			shorter: 200,
			short: 250,
			standard: 300,
			complex: 375,
			enteringScreen: 225,
			leavingScreen: 195,
		},
	},
});
