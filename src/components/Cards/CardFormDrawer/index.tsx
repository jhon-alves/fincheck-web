import { Controller } from 'react-hook-form';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Lock, ShieldCheck } from 'lucide-react';
import { cn } from '../../../helpers';
import {
  Button,
  CurrencyField,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Input,
  MaskedField,
  SegmentedControl,
  Select,
} from '../../Shared';
import { FieldError } from '../../Shared/FieldError';
import { BrandLogo, brandLabels } from '../../Icons/brands';
import type { Card, CardBrand, CardKind } from '../../../types/cards-types';
import { CardVisual } from '../CardVisual';
import { CARD_THEMES, cardBackground, getCardTheme } from '../cardThemes';
import { savedCardNumber } from '../cardNumber';
import { useCardFormController } from './useCardFormController';

const BRAND_OPTIONS: CardBrand[] = [
  'VISA',
  'MASTERCARD',
  'ELO',
  'AMEX',
  'HIPERCARD',
  'DINERS',
  'DISCOVER',
  'JCB',
  'OTHER',
];

const DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => ({
  value: String(index + 1),
  label: `Dia ${index + 1}`,
}));

interface CardFormDrawerProps {
  open: boolean;
  card: Card | null;
  onClose: () => void;
}

export function CardFormDrawer({ open, card, onClose }: CardFormDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent size="lg">
        {/* O conteúdo do drawer desmonta ao fechar (depois da animação), então
            o formulário — e o número digitado — somem da memória. */}
        <CardForm key={card?.id ?? 'new'} card={card} onClose={onClose} />
      </DrawerContent>
    </Drawer>
  );
}

function CardForm({ card, onClose }: { card: Card | null; onClose: () => void }) {
  const {
    form: {
      control,
      register,
      formState: { errors },
    },
    values,
    isEditing,
    isPending,
    analysis,
    detectedBrand,
    previewNumber,
    accountOptions,
    handleSubmit,
    handleNumberChange,
    handleColorChange,
    handleBrandChange,
    setNumberMode,
  } = useCardFormController(card, onClose);

  const isCredit = values.kind === 'CREDIT';
  const selectedTheme = getCardTheme(values.color);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <DrawerHeader>
        <DrawerTitle>{isEditing ? 'Editar cartão' : 'Novo cartão'}</DrawerTitle>
        <DrawerDescription className="flex items-start gap-1.5">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-income-strong" aria-hidden />
          O número completo fica só no seu navegador: salvamos apenas o final e a bandeira.
        </DrawerDescription>
      </DrawerHeader>

      <DrawerBody className="space-y-6">
        <div className="mx-auto w-full max-w-[340px]">
          <CardVisual
            tilt
            shine
            name={values.name}
            holderName={values.holderName.toUpperCase()}
            number={previewNumber}
            brand={detectedBrand}
            kind={values.kind}
            color={values.color}
            expiry={values.expiry}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold text-fg">Número do cartão</legend>

          {values.numberMode === 'saved' && card && (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-subtle px-3.5 py-3">
              <BrandLogo brand={card.brand} className="h-5" />
              <span className="money flex-1 font-medium text-fg">
                {savedCardNumber(card.lastDigits, card.brand)}
              </span>
              <Lock size={16} className="text-muted" aria-label="Número travado" />
              <Button size="sm" variant="secondary" onClick={() => setNumberMode('full')}>
                Trocar número
              </Button>
            </div>
          )}

          {values.numberMode === 'full' && (
            <div>
              <div className="relative">
                <Input
                  name="card-number"
                  placeholder="Número completo"
                  inputMode="numeric"
                  autoComplete="off"
                  value={values.number}
                  onChange={(event) => handleNumberChange(event.target.value)}
                  error={errors.number?.message}
                  className="money pr-20 tracking-wider"
                  autoFocus={!isEditing}
                />
                <div className="pointer-events-none absolute top-[14px] right-3.5 grid h-6 w-14 place-items-end">
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={detectedBrand ?? 'none'}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="absolute inset-0 flex items-center justify-end text-muted"
                    >
                      <BrandLogo brand={detectedBrand ?? 'OTHER'} className="h-5" />
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-muted" aria-live="polite">
                {detectedBrand && detectedBrand !== 'OTHER'
                  ? `${brandLabels[detectedBrand]} detectado${analysis.isValid ? ' · número válido' : ''}`
                  : 'A bandeira aparece enquanto você digita.'}
              </p>
            </div>
          )}

          {values.numberMode === 'last4' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                {...register('lastDigits')}
                placeholder="4 últimos dígitos"
                inputMode="numeric"
                maxLength={4}
                autoComplete="off"
                className="money tracking-widest"
                error={errors.lastDigits?.message}
              />
              <Select
                placeholder="Bandeira"
                value={values.brand ?? undefined}
                onChange={(value) => handleBrandChange(value as CardBrand)}
                error={errors.brand?.message}
                options={BRAND_OPTIONS.map((brand) => ({
                  value: brand,
                  label: brandLabels[brand],
                  icon: <BrandLogo brand={brand} className="h-4 w-9 justify-center" />,
                }))}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {values.numberMode === 'full' && (
              <button
                type="button"
                onClick={() => setNumberMode('last4')}
                className="text-xs font-semibold text-primary-strong underline-offset-4 hover:underline dark:text-primary"
              >
                Prefiro informar só o final
              </button>
            )}
            {values.numberMode === 'last4' && (
              <button
                type="button"
                onClick={() => setNumberMode('full')}
                className="text-xs font-semibold text-primary-strong underline-offset-4 hover:underline dark:text-primary"
              >
                Digitar o número para detectar a bandeira
              </button>
            )}
            {isEditing && values.numberMode !== 'saved' && (
              <button
                type="button"
                onClick={() => setNumberMode('saved')}
                className="text-xs font-semibold text-muted underline-offset-4 hover:text-fg hover:underline"
              >
                Manter o número atual
              </button>
            )}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            {...register('name')}
            placeholder="Apelido (ex.: Roxinho)"
            autoComplete="off"
            error={errors.name?.message}
          />
          <Controller
            control={control}
            name="expiry"
            render={({ field }) => (
              <MaskedField
                label="Validade (MM/AA)"
                format="##/##"
                autoComplete="off"
                value={field.value}
                onChange={field.onChange}
                error={errors.expiry?.message}
              />
            )}
          />
          <div className="sm:col-span-2">
            <Input
              {...register('holderName')}
              placeholder="Nome impresso no cartão"
              autoComplete="off"
              className="uppercase"
              error={errors.holderName?.message}
            />
          </div>
        </div>

        <div className="space-y-2">
          <span id="card-kind-label" className="text-sm font-semibold text-fg">
            Tipo
          </span>
          <Controller
            control={control}
            name="kind"
            render={({ field }) => (
              <SegmentedControl<CardKind>
                aria-label="Tipo do cartão"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: 'CREDIT', label: 'Crédito' },
                  { value: 'DEBIT', label: 'Débito' },
                ]}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="bankAccountId"
          render={({ field }) => (
            <Select
              placeholder={isCredit ? 'Conta que paga a fatura (opcional)' : 'Conta de onde o débito sai'}
              value={field.value || undefined}
              onChange={field.onChange}
              options={accountOptions}
              error={errors.bankAccountId?.message}
            />
          )}
        />

        <AnimatePresence initial={false}>
          {isCredit && (
            <motion.div
              key="credit-fields"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="-m-1 overflow-hidden p-1"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <Controller
                    control={control}
                    name="creditLimit"
                    render={({ field }) => (
                      <CurrencyField
                        label="Limite"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.creditLimit?.message}
                      />
                    )}
                  />
                </div>
                <div className="sm:col-span-3 grid grid-cols-2 gap-3">
                  <Controller
                    control={control}
                    name="closingDay"
                    render={({ field }) => (
                      <Select
                        placeholder="Fechamento"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        options={DAY_OPTIONS}
                        error={errors.closingDay?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="dueDay"
                    render={({ field }) => (
                      <Select
                        placeholder="Vencimento"
                        value={field.value || undefined}
                        onChange={field.onChange}
                        options={DAY_OPTIONS}
                        error={errors.dueDay?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-fg">
            Cor <span className="font-normal text-muted">· {selectedTheme.label}</span>
          </legend>
          <div role="radiogroup" aria-label="Cor do cartão" className="flex flex-wrap gap-2.5">
            {CARD_THEMES.map((theme) => {
              const isSelected = theme.id === values.color;

              return (
                <button
                  key={theme.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={theme.label}
                  onClick={() => handleColorChange(theme.id)}
                  className={cn(
                    'grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-card transition-transform outline-none hover:scale-110',
                    'focus-visible:ring-4 focus-visible:ring-ring',
                    isSelected && 'ring-2 ring-fg',
                  )}
                  style={{ background: cardBackground(theme) }}
                >
                  {isSelected && (
                    <Check
                      size={16}
                      strokeWidth={3}
                      className={theme.ink === 'dark' ? 'text-ink-950' : 'text-white'}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.color?.message} />
        </fieldset>
      </DrawerBody>

      <DrawerFooter>
        <Button variant="secondary" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isPending} className="min-w-36">
          {isEditing ? 'Salvar alterações' : 'Cadastrar cartão'}
        </Button>
      </DrawerFooter>
    </form>
  );
}
