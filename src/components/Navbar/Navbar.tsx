import logo from '../../assets/imgs/logo-green.png';
import { MenuSettings } from './MenuSettings';

export function Navbar() {
	return (
		<header className="h-12 flex items-center justify-between">
			<img src={logo} alt="logo" />
			<MenuSettings />
		</header>
	);
}
