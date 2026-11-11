import { CreditCard } from 'lucide-react';
import { cn } from '../../../helpers';
import type { CardBrand } from '../../../types/cards-types';
import { brandLabels } from './brandLabels';

/*
 * Marcas das bandeiras desenhadas em SVG (versões simplificadas). As cores
 * oficiais de cada bandeira fazem parte do desenho; o resto herda
 * `currentColor`, para funcionar sobre o gradiente do cartão e no tema escuro.
 */

interface BrandLogoProps {
  brand: CardBrand;
  className?: string;
  /** `mono` usa currentColor nos textos (sobre o cartão colorido). */
  tone?: 'mono' | 'color';
}


function Visa({ tone }: { tone: 'mono' | 'color' }) {
  return (
    <svg viewBox="0 0 64 24" className="h-full w-auto max-w-full">
      <text
        x="32"
        y="19"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontStyle="italic"
        fontWeight="900"
        fontSize="21"
        letterSpacing="-0.5"
        fill={tone === 'mono' ? 'currentColor' : '#1A1F71'}
      >
        VISA
      </text>
    </svg>
  );
}

function Mastercard() {
  return (
    <svg viewBox="0 0 40 24" className="h-full w-auto max-w-full">
      <circle cx="14" cy="12" r="10" fill="#EB001B" />
      <circle cx="26" cy="12" r="10" fill="#F79E1B" />
      <path d="M20 4a10 10 0 0 1 0 16 10 10 0 0 1 0-16Z" fill="#FF5F00" />
    </svg>
  );
}

function Elo({ tone }: { tone: 'mono' | 'color' }) {
  return (
    <svg viewBox="0 0 48 24" className="h-full w-auto max-w-full">
      <circle cx="9" cy="6" r="3.2" fill="#FFCB05" />
      <circle cx="5" cy="13" r="3.2" fill="#00A4E0" />
      <circle cx="9" cy="20" r="3.2" fill="#EF4123" />
      <text
        x="30"
        y="18"
        textAnchor="middle"
        fontFamily="Arial Rounded MT Bold, Arial, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill={tone === 'mono' ? 'currentColor' : '#0B0D12'}
      >
        elo
      </text>
    </svg>
  );
}

function Amex() {
  return (
    <svg viewBox="0 0 48 24" className="h-full w-auto max-w-full">
      <rect width="48" height="24" rx="4" fill="#2E77BC" />
      <text
        x="24"
        y="16.5"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="11"
        letterSpacing="0.5"
        fill="#FFFFFF"
      >
        AMEX
      </text>
    </svg>
  );
}

function Hipercard() {
  return (
    <svg viewBox="0 0 72 24" className="h-full w-auto max-w-full">
      <rect width="72" height="24" rx="5" fill="#B3131B" />
      <text
        x="36"
        y="16.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="12"
        fill="#FFFFFF"
      >
        Hipercard
      </text>
    </svg>
  );
}

function Diners({ tone }: { tone: 'mono' | 'color' }) {
  const color = tone === 'mono' ? 'currentColor' : '#0079BE';
  return (
    <svg viewBox="0 0 32 24" className="h-full w-auto max-w-full">
      <circle cx="16" cy="12" r="10.5" fill="none" stroke={color} strokeWidth="2" />
      <path d="M13 6.5a6 6 0 0 0 0 11Z" fill={color} />
      <path d="M19 6.5a6 6 0 0 1 0 11Z" fill={color} />
    </svg>
  );
}

function Discover({ tone }: { tone: 'mono' | 'color' }) {
  return (
    <svg viewBox="0 0 80 24" className="h-full w-auto max-w-full">
      <text
        x="2"
        y="17"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="14"
        fill={tone === 'mono' ? 'currentColor' : '#231F20'}
      >
        DISC
      </text>
      <circle cx="47" cy="12" r="6.5" fill="#F48120" />
      <text
        x="54.5"
        y="17"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="14"
        fill={tone === 'mono' ? 'currentColor' : '#231F20'}
      >
        VER
      </text>
    </svg>
  );
}

function Jcb() {
  return (
    <svg viewBox="0 0 42 24" className="h-full w-auto max-w-full">
      <rect x="1" y="1" width="12" height="22" rx="4" fill="#0E4C96" />
      <rect x="15" y="1" width="12" height="22" rx="4" fill="#E21836" />
      <rect x="29" y="1" width="12" height="22" rx="4" fill="#007940" />
      <text x="7" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="9" fill="#fff">J</text>
      <text x="21" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="9" fill="#fff">C</text>
      <text x="35" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="9" fill="#fff">B</text>
    </svg>
  );
}

export function BrandLogo({ brand, className, tone = 'color' }: BrandLogoProps) {
  return (
    <span
      role="img"
      aria-label={brandLabels[brand]}
      className={cn('inline-flex h-6 shrink-0 items-center', className)}
    >
      {brand === 'VISA' && <Visa tone={tone} />}
      {brand === 'MASTERCARD' && <Mastercard />}
      {brand === 'ELO' && <Elo tone={tone} />}
      {brand === 'AMEX' && <Amex />}
      {brand === 'HIPERCARD' && <Hipercard />}
      {brand === 'DINERS' && <Diners tone={tone} />}
      {brand === 'DISCOVER' && <Discover tone={tone} />}
      {brand === 'JCB' && <Jcb />}
      {brand === 'OTHER' && <CreditCard className="h-full w-auto max-w-full" strokeWidth={1.6} />}
    </span>
  );
}
