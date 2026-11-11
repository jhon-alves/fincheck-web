import { AnimatePresence, motion } from 'motion/react';
import { LogoMark } from './Logo';
import { Spinner } from './Spinner';

interface LaunchScreenProps {
  isLoading: boolean;
}

export function LaunchScreen({ isLoading }: LaunchScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="launch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="app-backdrop fixed inset-0 z-[100] grid place-items-center"
          role="status"
          aria-label="Carregando"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              <LogoMark className="size-12" />
              <span className="text-xl font-semibold tracking-tight text-fg">Fincheck</span>
            </div>
            <Spinner className="size-6 text-primary-strong" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
