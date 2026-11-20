import { useState } from 'react';
import { Link } from 'react-router';
import { CreditCard } from 'lucide-react';
import {
  CardDetailsDrawer,
  CardFormDrawer,
  CardLimitBar,
  CardVisual,
  formatExpiry,
  savedCardNumber,
} from '../../../components/Cards';
import { Money } from '../../../components/Shared';
import type { Card } from '../../../types/cards-types';

export function CardsCarousel({ cards, isLoading }: { cards: Card[]; isLoading: boolean }) {
  // Mesmo drawer de detalhes da tela de Cartões. `open` fica separado do
  // cartão para o conteúdo continuar na tela durante a animação de saída, e o
  // cartão vem da lista do resumo, que atualiza depois de pagar ou editar.
  const [details, setDetails] = useState<{ open: boolean; cardId: string | null }>({
    open: false,
    cardId: null,
  });
  const [form, setForm] = useState<{ open: boolean; card: Card | null }>({ open: false, card: null });
  const cardInDetails = cards.find((card) => card.id === details.cardId) ?? null;

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="skeleton aspect-[1.586/1] w-60 shrink-0 rounded-[5%]" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <Link
        to="/cartoes"
        className="flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-sm text-muted hover:bg-subtle hover:text-fg"
      >
        <CreditCard size={22} />
        Cadastre seu primeiro cartão
      </Link>
    );
  }

  return (
    <>
      <ul
        aria-label="Meus cartões"
        className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1"
      >
        {cards.map((card) => (
          <li key={card.id} className="w-60 shrink-0 snap-start sm:w-64">
            <button
              type="button"
              onClick={() => setDetails({ open: true, cardId: card.id })}
              aria-label={`Ver detalhes do cartão ${card.name}`}
              className="block w-full space-y-3 rounded-2xl text-left outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              <CardVisual
                tilt
                shine
                name={card.name}
                holderName={card.holderName}
                number={savedCardNumber(card.lastDigits, card.brand)}
                brand={card.brand}
                kind={card.kind}
                color={card.color}
                expiry={formatExpiry(card.expMonth, card.expYear)}
              />
              {card.kind === 'CREDIT' && card.creditLimit ? (
                <CardLimitBar used={card.usedLimit ?? 0} limit={card.creditLimit} />
              ) : (
                <p className="text-xs text-muted">
                  Débito · {card.bankAccount?.name ?? 'sem conta'}
                </p>
              )}
            </button>
          </li>
        ))}
      </ul>

      <CardDetailsDrawer
        open={details.open}
        card={cardInDetails}
        onClose={() => setDetails((prev) => ({ ...prev, open: false }))}
        onEdit={(card) => {
          setDetails((prev) => ({ ...prev, open: false }));
          setForm({ open: true, card });
        }}
      />
      <CardFormDrawer
        open={form.open}
        card={form.card}
        onClose={() => setForm((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}

export function CardsTotal({ cards }: { cards: Card[] }) {
  const used = cards.reduce((total, card) => total + (card.usedLimit ?? 0), 0);
  if (!used) return null;

  return (
    <span className="text-xs text-muted">
      Em aberto <Money value={used} className="font-semibold text-fg" />
    </span>
  );
}
