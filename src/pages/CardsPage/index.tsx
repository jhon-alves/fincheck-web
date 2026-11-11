import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Plus } from 'lucide-react';
import { PageContainer } from '../../components/Layout';
import { Button, Card, Money } from '../../components/Shared';
import { CardFormDrawer, CardLimitBar, CardVisual } from '../../components/Cards';
import { cn } from '../../helpers';
import { CardTile } from './components/CardTile';
import { CardDetailsDrawer } from './components/CardDetailsDrawer';
import { useCardsController } from './useCardsController';

function EmptyCards({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="flex flex-col items-center gap-6 px-6 py-12 text-center">
      {/* Ilustração: dois cartões de exemplo levemente inclinados */}
      <div className="relative h-36 w-64" aria-hidden>
        <div className="absolute top-2 left-0 w-44 -rotate-12 opacity-70">
          <CardVisual
            name="Viagens"
            holderName="SEU NOME"
            number="•••• 0000"
            brand="VISA"
            kind="CREDIT"
            color="navy"
            expiry="12/30"
          />
        </div>
        <div className="absolute top-6 right-0 w-48 rotate-6">
          <CardVisual
            shine
            name="Meu cartão"
            holderName="SEU NOME"
            number="•••• 1234"
            brand="MASTERCARD"
            kind="CREDIT"
            color="lime"
            expiry="08/31"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-lg font-semibold tracking-tight text-fg">Nenhum cartão por aqui</p>
        <p className="mx-auto max-w-sm text-sm text-muted">
          Cadastre seus cartões para acompanhar o limite, lançar compras parceladas e ver as
          faturas chegando.
        </p>
      </div>
      <Button size="lg" onClick={onCreate}>
        <Plus size={18} strokeWidth={2.4} /> Cadastrar primeiro cartão
      </Button>
    </Card>
  );
}

export function CardsPage() {
  const {
    isLoading,
    activeCards,
    archivedCards,
    creditSummary,
    form,
    openNewCard,
    openEditCard,
    closeForm,
    details,
    openDetails,
    closeDetails,
  } = useCardsController();
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);

  const hasCards = activeCards.length + archivedCards.length > 0;

  return (
    <PageContainer className="space-y-8">
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton aspect-[1.586/1] rounded-[5%]" />
          ))}
        </div>
      )}

      {!isLoading && !hasCards && <EmptyCards onCreate={openNewCard} />}

      {!isLoading && hasCards && (
        <>
          <Card className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:p-6">
            <div className="grid flex-1 grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted">Limite total</p>
                <Money
                  value={creditSummary.limit}
                  className="text-lg font-semibold tracking-tight text-fg md:text-2xl"
                />
              </div>
              <div>
                <p className="text-xs text-muted">Usado</p>
                <Money
                  value={creditSummary.used}
                  className="text-lg font-semibold tracking-tight text-fg md:text-2xl"
                />
              </div>
              <div>
                <p className="text-xs text-muted">Disponível</p>
                <Money
                  value={creditSummary.available}
                  className="text-lg font-semibold tracking-tight text-income-strong md:text-2xl"
                />
              </div>
              {creditSummary.limit > 0 && (
                <CardLimitBar
                  className="col-span-3"
                  showLabels={false}
                  used={creditSummary.used}
                  limit={creditSummary.limit}
                />
              )}
            </div>
            <Button onClick={openNewCard} className="md:self-start">
              <Plus size={18} strokeWidth={2.4} /> Novo cartão
            </Button>
          </Card>

          <section aria-labelledby="active-cards" className="space-y-4">
            <h2 id="active-cards" className="text-sm font-semibold text-fg-soft">
              Meus cartões <span className="text-muted">· {activeCards.length}</span>
            </h2>
            <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {activeCards.map((card, index) => (
                <motion.li
                  key={card.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                >
                  <CardTile card={card} onOpen={openDetails} />
                </motion.li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openNewCard}
                  className="flex aspect-[1.586/1] w-full flex-col items-center justify-center gap-3 rounded-[5%] border-2 border-dashed border-border text-muted transition-colors hover:border-primary-strong/40 hover:bg-card hover:text-fg focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-subtle">
                    <Plus size={20} />
                  </span>
                  <span className="text-sm font-medium">Novo cartão</span>
                </button>
              </li>
            </ul>
          </section>

          {archivedCards.length > 0 && (
            <section className="space-y-4">
              <button
                type="button"
                onClick={() => setIsArchivedOpen((open) => !open)}
                aria-expanded={isArchivedOpen}
                className="flex items-center gap-1.5 rounded-lg text-sm font-semibold text-fg-soft hover:text-fg"
              >
                Arquivados <span className="text-muted">· {archivedCards.length}</span>
                <ChevronDown
                  size={16}
                  className={cn('transition-transform', isArchivedOpen && 'rotate-180')}
                />
              </button>
              {isArchivedOpen && (
                <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                  {archivedCards.map((card) => (
                    <li key={card.id}>
                      <CardTile card={card} onOpen={openDetails} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </>
      )}

      <CardDetailsDrawer
        open={details.open}
        card={details.card}
        onClose={closeDetails}
        onEdit={openEditCard}
      />
      <CardFormDrawer open={form.open} card={form.card} onClose={closeForm} />
    </PageContainer>
  );
}
