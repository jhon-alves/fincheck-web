import { Toaster } from 'react-hot-toast';
import { MotionConfig } from 'motion/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Router } from './router';
import { queryClient } from './helpers';
import { AuthProvider } from './contexts/AuthProvider';
import { TooltipProvider } from './components/Shared/Tooltip';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* "user": respeita o prefers-reduced-motion do sistema */}
      <MotionConfig reducedMotion="user">
        <TooltipProvider delayDuration={200}>
          <AuthProvider>
            <Router />
            <Toaster
              position="top-center"
              toastOptions={{
                className:
                  '!rounded-2xl !border !border-border !bg-card-elevated !text-fg !shadow-float !text-sm !font-medium',
                success: { iconTheme: { primary: 'var(--income)', secondary: 'var(--card)' } },
                error: { iconTheme: { primary: 'var(--expense)', secondary: 'var(--card)' } },
              }}
            />
          </AuthProvider>
        </TooltipProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
