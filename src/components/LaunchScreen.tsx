import { Spinner } from './Spinner';
import { Transition } from '@headlessui/react';
import logo from '../assets/imgs/logo.png';

interface LaunchScreenProps {
  isLoading: boolean;
}

export function LaunchScreen({ isLoading }: LaunchScreenProps) {
	return (
		<Transition
			show={isLoading}
			enter="transition-opacity duration-75"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-150"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="bg-teal-900 fixed top-0 left-0 w-full h-full flex flex-col gap-5 justify-center items-center">
				<img src={logo} alt="logo" />
				<Spinner />
			</div>
		</Transition>
	);
}
