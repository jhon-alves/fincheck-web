import { useCallback, useState } from 'react';
import { readStorage, writeStorage } from '../../helpers/storage';

const STORAGE_KEY = 'fincheck:sidebar-collapsed';

export function useSidebarCollapsed() {
  const [isCollapsed, setIsCollapsed] = useState(
    () => readStorage(STORAGE_KEY) === 'true',
  );

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      writeStorage(STORAGE_KEY, String(!prev));
      return !prev;
    });
  }, []);

  return { isCollapsed, toggle };
}
