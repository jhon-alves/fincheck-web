import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { authServices } from '../../services';
import { SignupParams } from '../../services/auth/types';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext/useAuth';

const schema = z.object({
	name: z.string().nonempty('Nome é obrigatório!'),
	email: z.string().nonempty('E-mail é obrigatório!').email('Infome um e-mail válido!'),
	password: z.string().nonempty('Senha é obrigatória!').min(8, 'A senha deve conter pelo menos 8 dígitos!'),
});

type FormData = z.infer<typeof schema>;

export function useRegisterController() {
	const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
		resolver: zodResolver(schema)
	});

	const { mutateAsync, isLoading } = useMutation({
		mutationFn: async (data: SignupParams) => await authServices.signup(data),
		onSuccess: () => toast.success('Conta criada!'),
		onError: () => toast.error('Ocorreu um erro ao criar a sua conta!')
	});

	const { signin } = useAuth();

	const handleRegisterSubmit = handleSubmit(async (data) => {
		const { accessToken } = await mutateAsync(data);
		signin(accessToken);
	});

	return {
		errors,
		isLoading,
		register,
		handleRegisterSubmit
	};
}
