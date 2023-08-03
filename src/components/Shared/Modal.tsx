import { ReactNode } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as Dialog from '@radix-ui/react-dialog';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface ModalProps {
  open: boolean;
  onClose?(): void;
  children: ReactNode;
  title: string;
  rightAction?: ReactNode;
}

export function Modal({ open, onClose, title, rightAction, children }: ModalProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className={twMerge(clsx(
					'data-[state=open]:animate-overlayShow',
					'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm'
				))} />
				<Dialog.Content className={twMerge(clsx(
					'data-[state=open]:animate-contentShow p-6 space-y-10 bg-white z-[51]',
					'fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-xl',
					'w-full max-w-[500px] shadow-[0px_11px_20px_0px_rgba(0,0,0,0.10)] outline-none'
				))}>
					<header className="flex items-center justify-between h-12 text-gray-800">
						<button
							onClick={onClose}
							className="w-12 h-12 flex items-center justify-center outline-none"
						>
							<Cross2Icon className="w-5 h-5" />
						</button>
						<span className="text-lg font-medium">{title}</span>
						<button className="w-12 h-12 flex items-center justify-center">
							{rightAction}
						</button>
					</header>
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
