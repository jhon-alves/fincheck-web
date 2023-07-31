import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { authServices } from '../../services';
import { SigninParams } from '../../services/auth/types';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().nonempty('E-mail é obrigatório!').email('Infome um e-mail válido!'),
  password: z.string().nonempty('Senha é obrigatória!').min(8, 'A senha deve conter pelo menos 8 dígitos!'),
});

type FormData = z.infer<typeof schema>;

export function useLoginController() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (data: SigninParams) => await authServices.signin(data),
    onError: () => toast.error('Credenciais inválidas!')
  });

  const handleLoginSubmit = handleSubmit(async(data) => await mutateAsync(data));

  return {
    errors,
    isLoading,
    register,
    handleLoginSubmit
  }
}
