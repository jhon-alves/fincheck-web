import { Outlet } from 'react-router-dom';
import { Logo } from '../../components';
import illustration from '../../assets/illustration.png';

export function LayoutPage() {
  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full flex items-center justify-center flex-col gap-16 lg:w-1/2">
        <div className="flex items-center justify-center gap-2">
          <Logo className="h-6 text-gray-500" />
          <span className="text-gray-500 font-bold">My Wallet</span>
        </div>

        <div className="w-full max-w-[504px] px-8">
          <Outlet />
        </div>
      </div>
      <div className="w-1/2 h-full p-8 justify-center items-center flex-col hidden lg:flex">
        <img
          src={illustration}
          className="object-cover w-full h-full max-w-[656px] max-h-[960px] select-none rounded-[32px]"
        />
      </div>
    </div>
  );
}
