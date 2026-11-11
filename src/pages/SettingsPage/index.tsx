import { Monitor, Moon, Sun } from 'lucide-react';
import { PageContainer } from '../../components/Layout';
import { Card, SegmentedControl, Switch } from '../../components/Shared';
import { useDashboard } from '../../components/Dashboard';
import { useAuth, useTheme, type ThemePreference } from '../../hooks';

export function SettingsPage() {
  const { user } = useAuth();
  const { preference, setPreference } = useTheme();
  const { areValuesVisible, toggleValueVisibility } = useDashboard();

  return (
    <PageContainer className="max-w-3xl space-y-6">
      <Card className="p-5 md:p-6">
        <h2 className="text-base font-semibold text-fg">Conta</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Nome</dt>
            <dd className="mt-0.5 font-medium text-fg">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">E-mail</dt>
            <dd className="mt-0.5 font-medium break-all text-fg">{user?.email}</dd>
          </div>
        </dl>
      </Card>

      <Card className="divide-y divide-border">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div>
            <h2 className="text-base font-semibold text-fg">Aparência</h2>
            <p className="mt-0.5 text-sm text-muted">
              Escolha o tema ou siga o do seu sistema.
            </p>
          </div>
          <SegmentedControl<ThemePreference>
            aria-label="Tema"
            value={preference}
            onChange={setPreference}
            className="sm:w-80"
            options={[
              { value: 'light', label: 'Claro', icon: <Sun size={16} /> },
              { value: 'dark', label: 'Escuro', icon: <Moon size={16} /> },
              { value: 'system', label: 'Sistema', icon: <Monitor size={16} /> },
            ]}
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-5 md:p-6">
          <div>
            <label htmlFor="privacy" className="text-base font-semibold text-fg">
              Mostrar valores
            </label>
            <p className="mt-0.5 text-sm text-muted">
              Desligado, os valores ficam borrados (modo privacidade). Também dá para
              alternar pelo botão de olho no topo.
            </p>
          </div>
          <Switch
            id="privacy"
            checked={areValuesVisible}
            onChange={toggleValueVisibility}
            aria-label="Mostrar valores"
          />
        </div>
      </Card>
    </PageContainer>
  );
}
