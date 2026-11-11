import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { readStorage, writeStorage } from '../helpers/storage';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'fincheck:theme';
const listeners = new Set<() => void>();
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function getPreference(): ThemePreference {
  const stored = readStorage(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function resolve(preference: ThemePreference) {
  if (preference === 'system') return darkQuery().matches ? 'dark' : 'light';
  return preference;
}

function apply(preference: ThemePreference) {
  const theme = resolve(preference);
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0B0D12' : '#F5F6F8');
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Preferência de tema (claro, escuro ou do sistema), salva no navegador. */
export function useTheme() {
  const preference = useSyncExternalStore(subscribe, getPreference);

  useEffect(() => {
    apply(preference);

    if (preference !== 'system') return;

    const query = darkQuery();
    const onChange = () => apply('system');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    writeStorage(STORAGE_KEY, next);
    apply(next);
    listeners.forEach((listener) => listener());
  }, []);

  return { preference, theme: resolve(preference), setPreference };
}
