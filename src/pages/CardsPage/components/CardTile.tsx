import { memo, useState } from 'react';
import { Repeat2 } from 'lucide-react';
import { CardBack, CardVisual, formatExpiry, isExpired, savedCardNumber } from '../../../components/Cards';
import { Badge, IconButton, Money, Tooltip } from '../../../components/Shared';
import type { Card } from '../../../types/cards-types';

interface CardTileProps {
  card: Card;
  onOpen: (card: Card) => void;
}

/**
 * Cartão da lista: vira no hover (mouse) ou pelo botão (toque e teclado);
 * clicar abre os detalhes.
 */
export const CardTile = memo(function CardTile({ card, onOpen }: CardTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlippedByButton, setIsFlippedByButton] = useState(false);
  const flipped = isHovered || isFlippedByButton;
  const expired = isExpired(card.expMonth, card.expYear);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onOpen(card)}
        onPointerEnter={(event) => event.pointerType === 'mouse' && setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        aria-label={`Ver detalhes do cartão ${card.name}`}
        className="block w-full rounded-[5%] outline-none focus-visible:ring-4 focus-visible:ring-ring"
      >
        <CardVisual
          tilt
          shine
          flipped={flipped}
          dimmed={card.archived}
          name={card.name}
          holderName={card.holderName}
          number={savedCardNumber(card.lastDigits, card.brand)}
          brand={card.brand}
          kind={card.kind}
          color={card.color}
          expiry={formatExpiry(card.expMonth, card.expYear)}
          back={<CardBack card={card} />}
        />
      </button>

      <div className="flex items-center gap-3 px-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-fg">{card.name}</p>
            {expired && <Badge tone="warning">Vencido</Badge>}
          </div>
          <p className="truncate text-xs text-muted">
            {card.kind === 'CREDIT' ? (
              <>
                Disponível <Money value={card.availableLimit ?? 0} className="font-medium text-fg-soft" />
              </>
            ) : (
              <>Débito · {card.bankAccount?.name ?? 'sem conta vinculada'}</>
            )}
          </p>
        </div>
        <Tooltip label={flipped ? 'Desvirar cartão' : 'Virar cartão'}>
          <IconButton
            size="sm"
            variant="card"
            aria-label={flipped ? 'Desvirar cartão' : 'Virar cartão'}
            aria-pressed={isFlippedByButton}
            onClick={() => setIsFlippedByButton((prev) => !prev)}
          >
            <Repeat2 size={16} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
});
