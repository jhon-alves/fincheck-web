import { PointerEvent, ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { Nfc } from 'lucide-react';
import { cn } from '../../helpers';
import { BrandLogo } from '../Icons/brands';
import type { CardBrand, CardKind } from '../../types/cards-types';
import { cardBackground, getCardTheme } from './cardThemes';
import type { PreviewChar } from './cardNumber';

const MAX_TILT = 8;

interface CardVisualProps {
  name: string;
  holderName: string;
  /** Número já formatado ou caracteres do preview (com estados). */
  number: string | PreviewChar[];
  /** `null` = bandeira ainda não detectada (ícone genérico). */
  brand: CardBrand | null;
  kind: CardKind;
  color: string;
  expiry: string;
  /** Conteúdo do verso (limite, fechamento...). Sem ele o cartão não vira. */
  back?: ReactNode;
  flipped?: boolean;
  /** Inclina acompanhando o mouse (no máximo ±8°). */
  tilt?: boolean;
  /** Brilho diagonal que passa uma vez quando o cartão entra na tela. */
  shine?: boolean;
  dimmed?: boolean;
  className?: string;
}

function Chip() {
  return (
    <svg viewBox="0 0 40 30" className="h-full w-auto" aria-hidden>
      <defs>
        <linearGradient id="chip-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5E3A3" />
          <stop offset="0.5" stopColor="#D4AF5A" />
          <stop offset="1" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="39" height="29" rx="6" fill="url(#chip-gold)" />
      <path
        d="M13 0.5v29M27 0.5v29M0.5 10h12.5M27 10h12.5M0.5 20h12.5M27 20h12.5M13 15h14"
        stroke="#8A6A1F"
        strokeOpacity="0.45"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

function CardNumber({ number }: { number: string | PreviewChar[] }) {
  if (typeof number === 'string') {
    return <span>{number}</span>;
  }

  return (
    <span aria-hidden>
      {number.map((item, index) =>
        item.state === 'gap' ? (
          <span key={index}> </span>
        ) : (
          <span
            key={index}
            className={cn(item.state === 'empty' && 'opacity-35', 'transition-opacity')}
          >
            {item.char}
          </span>
        ),
      )}
    </span>
  );
}

/**
 * Cartão "de verdade" (proporção 1,586:1). Os tamanhos usam unidades do
 * container (cqw), então o mesmo componente serve do preview grande ao
 * carrossel da Home.
 */
export function CardVisual({
  name,
  holderName,
  number,
  brand,
  kind,
  color,
  expiry,
  back,
  flipped = false,
  tilt = false,
  shine = false,
  dimmed = false,
  className,
}: CardVisualProps) {
  const reduceMotion = useReducedMotion();
  const theme = getCardTheme(color);
  const isDarkInk = theme.ink === 'dark';
  const canTilt = tilt && !reduceMotion;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), springConfig);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), springConfig);
  const glareX = useTransform(pointerX, [-0.5, 0.5], ['20%', '80%']);
  const glareY = useTransform(pointerY, [-0.5, 0.5], ['20%', '80%']);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgb(255 255 255 / 0.22), transparent 55%)`,
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!canTilt || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const faceClass = cn(
    'absolute inset-0 overflow-hidden rounded-[5cqw] [backface-visibility:hidden]',
    isDarkInk ? 'text-ink-950' : 'text-white',
  );

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('@container aspect-[1.586/1] w-full [perspective:1200px]', className)}
    >
      <motion.div
        style={canTilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        className="relative size-full [transform-style:preserve-3d]"
      >
        <motion.div
          animate={{ rotateY: flipped && back ? 180 : 0 }}
          transition={
            reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 20 }
          }
          className={cn(
            'relative size-full rounded-[5cqw] shadow-[0_18px_40px_-18px_rgb(11_13_18/0.55)] [transform-style:preserve-3d]',
            dimmed && 'opacity-60 grayscale-[0.4]',
          )}
        >
          {/* Frente */}
          <div className={faceClass}>
            <AnimatePresence initial={false}>
              <motion.div
                key={theme.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
                style={{ background: cardBackground(theme) }}
              />
            </AnimatePresence>
            {/* Profundidade: círculos translúcidos e textura de luz */}
            <span className="absolute -top-[45%] -right-[25%] size-[95%] rounded-full bg-white/10" />
            <span className="absolute -bottom-[60%] -left-[20%] size-[90%] rounded-full bg-black/10" />
            {canTilt && <motion.span className="absolute inset-0" style={{ background: glare }} />}
            {shine && !reduceMotion && (
              <motion.span
                aria-hidden
                initial={{ x: '-130%' }}
                whileInView={{ x: '130%' }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.3, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-y-0 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent"
              />
            )}

            <div className="relative flex size-full flex-col justify-between p-[6cqw]">
              <div className="flex items-start justify-between gap-[3cqw]">
                <span className="truncate text-[4.6cqw] leading-tight font-semibold">
                  {name || 'Meu cartão'}
                </span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-[2.6cqw] py-[0.8cqw] text-[2.9cqw] font-semibold backdrop-blur-sm',
                    isDarkInk ? 'bg-ink-950/10' : 'bg-white/18',
                  )}
                >
                  {kind === 'CREDIT' ? 'Crédito' : 'Débito'}
                </span>
              </div>

              <div className="flex items-center gap-[3cqw]">
                <span className="h-[10cqw]">
                  <Chip />
                </span>
                <Nfc className="size-[6cqw] rotate-90 opacity-70" aria-hidden />
              </div>

              <div
                className="money truncate text-[6.2cqw] font-medium tracking-[0.12em] whitespace-nowrap"
                aria-label="Número do cartão"
              >
                <CardNumber number={number} />
              </div>

              <div className="flex items-end justify-between gap-[4cqw]">
                <div className="min-w-0 flex-1">
                  <span className="block text-[2.4cqw] tracking-wider uppercase opacity-70">
                    Titular
                  </span>
                  <span className="block truncate text-[3.6cqw] font-medium tracking-wide uppercase">
                    {holderName || 'Nome impresso'}
                  </span>
                </div>
                <div className="shrink-0">
                  <span className="block text-[2.4cqw] tracking-wider uppercase opacity-70">
                    Validade
                  </span>
                  <span className="money block text-[3.6cqw] font-medium">{expiry || 'MM/AA'}</span>
                </div>
                <div className="relative grid h-[8cqw] w-[18cqw] shrink-0 place-items-end">
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={brand ?? 'none'}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      className="absolute inset-0 flex items-end justify-end"
                    >
                      <BrandLogo brand={brand ?? 'OTHER'} tone="mono" className="h-full max-w-full justify-end" />
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Verso */}
          {back && (
            <div className={cn(faceClass, '[transform:rotateY(180deg)]')}>
              <div className="absolute inset-0" style={{ background: cardBackground(theme) }} />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-x-0 top-[9%] h-[15%] bg-black/70" />
              <div className="relative flex size-full flex-col justify-end p-[6cqw] text-white">
                {back}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
