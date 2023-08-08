import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Input } from '../../components';
import { useLoginController } from './useLoginController';

export function LoginPage() {
	const { errors, isLoading, register, handleLoginSubmit } = useLoginController();

	return (
		<>
			<header className="flex flex-col items-center gap-4">
				<h1 className="font-bold text-2xl text-gray-900">
          Entre em sua conta
				</h1>
				<p className="space-x-2">
					<span className="text-gray-700 tracking-[-0.5px]">
            Novo por aqui?
					</span>
					<Link
						to="/register"
						className="text-teal-900 font-medium tracking-[-0.5px]"
					>
            Crie uma conta
					</Link>
				</p>
			</header>

			<form
				onSubmit={handleLoginSubmit}
				className="mt-6 flex flex-col gap-4"
			>
				<Input
					type="email"
					placeholder="E-mail"
					error={errors.email?.message}
					{...register('email')}
				/>
				<Input
					type="password"
					placeholder="Senha"
					error={errors.password?.message}
					{...register('password')}
				/>
				<Button
					type="submit"
					variant="contained"
					disabled={isLoading}
				>
          Entrar
				</Button>
			</form>
		</>
	);
}
