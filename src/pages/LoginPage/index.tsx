import { Link } from 'react-router';
import { Input, Button } from '../../components';
import { useLoginController } from './useLoginController';

export function LoginPage() {
  const { handleSubmit, register, errors, isLoading } = useLoginController();

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">
          Entre em sua conta
        </h1>

        <p className="space-x-1.5 text-sm">
          <span className="text-muted">
            Novo por aqui?
          </span>
          <Link
            to="/register"
            className="font-semibold text-primary-strong underline-offset-4 hover:underline dark:text-primary"
          >
            Crie uma conta
          </Link>
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          type="email"
          placeholder="E-mail"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          type="password"
          placeholder="Senha"
          {...register('password')}
          error={errors.password?.message}
        />

        <Button type="submit" size="lg" className="mt-2" isLoading={isLoading}>
          Entrar
        </Button>
      </form>
    </>
  );
}
