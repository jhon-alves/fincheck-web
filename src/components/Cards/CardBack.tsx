import type { Card } from '../../types/cards-types';
import { CardLimitBar } from './CardLimitBar';

/** Verso do cartão: limite e datas (crédito) ou conta vinculada (débito). */
export function CardBack({ card }: { card: Card }) {
  if (card.kind === 'DEBIT') {
    return (
      <div className="space-y-[2cqw]">
        <span className="block text-[2.4cqw] tracking-wider uppercase opacity-70">
          Conta vinculada
        </span>
        <span className="block truncate text-[5cqw] font-semibold">
          {card.bankAccount?.name ?? 'Nenhuma conta'}
        </span>
        <span className="block text-[3cqw] opacity-75">
          Compras no débito saem direto desta conta.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-[3cqw]">
      <CardLimitBar
        tone="inverse"
        used={card.usedLimit ?? 0}
        limit={card.creditLimit ?? 0}
        className="[&_*]:text-[3.2cqw]"
      />
      {/* Rótulos no mesmo estilo de "Titular" e "Validade" da frente */}
      <div className="flex gap-[6cqw]">
        <div>
          <span className="block text-[2.4cqw] tracking-wider uppercase opacity-70">Fecha dia</span>
          <span className="money block text-[4.6cqw] font-semibold">{card.closingDay}</span>
        </div>
        <div>
          <span className="block text-[2.4cqw] tracking-wider uppercase opacity-70">Vence dia</span>
          <span className="money block text-[4.6cqw] font-semibold">{card.dueDay}</span>
        </div>
      </div>
    </div>
  );
}
