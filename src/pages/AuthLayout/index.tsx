import { Outlet } from 'react-router-dom';
import illustration from '../../assets/imgs/login.png';
import logo from '../../assets/imgs/logo.png';

export function AuthLayout() {
  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full flex flex-col justify-center items-center gap-10 lg:w-1/2">
        <img src={logo} alt="logo" />
        <div className="w-full max-w-[504px] px-8">
          <Outlet />
        </div>
      </div>
      <div className="w-1/2 h-full flex-col gap-7 justify-center items-center p-8 hidden lg:flex">
        <img
          src={illustration}
          alt="illustration"
          className="object-contain w-full h-full max-w-[656px] max-h-[960px] select-none"
        />
        <div className="bg-white max-w-[656px] p-10 rounded-3xl">
          <img src={logo} alt="logo" className="mb-5" />
          <p className="text-gray-700 font-medium text-x">
            Gerencie suas finanças pessoais de uma forma simples com o fincheck,
            e o melhor, totalmente de graça!
          </p>
        </div>
      </div>
    </div>
  );
}
