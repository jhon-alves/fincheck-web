import { ReactNode } from 'react';
import * as RdxDropdownMenu from '@radix-ui/react-dropdown-menu';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface DropdownMenuProps {
  children: ReactNode;
}

function DropdownMenuRoot({ children }: DropdownMenuProps) {
	return (
		<RdxDropdownMenu.Root>
			{children}
		</RdxDropdownMenu.Root>
	);
}

function DropdownMenuTrigger({ children }: DropdownMenuProps) {
	return (
		<RdxDropdownMenu.Trigger className="outline-none" asChild>
			{children}
		</RdxDropdownMenu.Trigger>
	);
}

interface DropdownMenuContentProps {
  children: ReactNode;
  className?: string;
}

function DropdownMenuContent({ children, className }: DropdownMenuContentProps) {
	return (
		<RdxDropdownMenu.Portal>
			<RdxDropdownMenu.Content className={twMerge(clsx(
				'rounded-2xl p-2 bg-white space-y-2 shadow-[0px_11px_20px_0px_rgba(0,0,0,0.10)] data-[side=bottom]:animate-slideUpAndFade',
				className
			))}
			>
				{children}
			</RdxDropdownMenu.Content>
		</RdxDropdownMenu.Portal>
	);
}

interface DropdownMenuItemProps {
  children: ReactNode;
  className?: string;
  onSelect?(): void
}

function DropdownMenuItem({ children, className, onSelect }: DropdownMenuItemProps) {
	return (
		<RdxDropdownMenu.Item
			onSelect={onSelect}
			className={twMerge(clsx(
				'min-h-[48px] outline-none flex items-center p-2 text-sm data-[highlighted]:bg-gray-100 rounded-2xl cursor-pointer',
				className
			))}
		>
			{children}
		</RdxDropdownMenu.Item>
	);
}

export const DropdownMenu = {
	Root: DropdownMenuRoot,
	Trigger: DropdownMenuTrigger,
	Content: DropdownMenuContent,
	Item: DropdownMenuItem
};
