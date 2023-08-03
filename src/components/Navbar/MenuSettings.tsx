import { ExitIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { DropdownMenu } from '../Shared';
import { useAuth } from '../../contexts/AuthContext/useAuth';

export function MenuSettings() {
	const { signout } = useAuth();

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<div className="bg-teal-50 rounded-full w-10 h-10 flex items-center justify-center">
					<span className="text-xl tracking-[-0.5px] text-teal-700 font-medium">
            JA
					</span>
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="min-w-[180px]">
				<DropdownMenu.Item className="flex items-center gap-4">
					<Pencil1Icon className="w-4 h-4" />
          Editar perfil
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onSelect={signout}
					className="flex items-center gap-4"
				>
					<ExitIcon className="w-4 h-4" />
          Sair
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
