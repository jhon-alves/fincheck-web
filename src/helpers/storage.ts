/*
 * localStorage pode lançar exceção (modo privado, cota cheia, bloqueio de
 * cookies). Preferências de interface nunca devem derrubar a tela por isso.
 */

export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Sem persistência: segue só em memória.
  }
}
