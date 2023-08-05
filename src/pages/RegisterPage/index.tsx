import { Link } from 'react-router-dom';
import { Input, Button } from '../../components';
import { useRegisterController } from './useRegisterController';

export function RegisterPage() {
	const { errors, isLoading, register, handleRegisterSubmit } = useRegisterController();

	return (
		<div>
			<header className="flex flex-col items-center gap-4">
				<h1 className="font-bold text-2xl text-gray-900">
          Crie sua conta
				</h1>
				<p className="space-x-2">
					<span className="text-gray-700 tracking-[-0.5px]">
            Já possui uma conta?
					</span>
					<Link
						to="/login"
						className="text-teal-900 font-medium tracking-[-0.5px]"
					>
            Fazer login
					</Link>
				</p>
			</header>

			<form
				className="mt-6 flex flex-col gap-4"
				onSubmit={handleRegisterSubmit}
			>
				<Input
					placeholder="Nome"
					error={errors.name?.message}
					{...register('name')}
				/>
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
					isLoading={isLoading}
				>
          Criar Conta
				</Button>
			</form>
		</div>
	);
}
