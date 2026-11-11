import { useState } from 'react';
import { QuickCategoryForm } from '../../Categories/QuickCategoryForm';
import { Controller } from 'react-hook-form';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Info, Minus, Plus, Repeat } from 'lucide-react';
import { cn, describeRecurrence, formatShortMonthYear } from '../../../helpers';
import { formatDate } from '../../../helpers/formaDate';
import {
  Button,
  DatePickerInput,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Input,
  InputCurrency,
  Money,
  SegmentedControl,
  Select,
  Switch,
} from '../../Shared';
import { FieldError } from '../../Shared/FieldError';
import { CategoryIcon } from '../../Icons/CategoryIcon';
import { MiniCard } from '../../Cards/MiniCard';
import { useDashboard } from '../../Dashboard/DashboardContext/useDashboard';
import type { TransactionFormState } from '../../Dashboard/DashboardContext/DashboardContext';
import type { TransactionType } from '../../../types/transactions-types';
import type { SegmentedOption } from '../../Shared/SegmentedControl';
import { InstallmentScopeDialog } from '../InstallmentScopeDialog';
import { paymentMethodIcons } from '../paymentMethods';
import {
  EXPENSE_METHODS,
  INCOME_METHODS,
  useTransactionFormController,
} from './useTransactionFormController';

const ACCENTS: Record<TransactionType, string> = {
  EXPENSE: 'var(--expense)',
  INCOME: 'var(--income)',
  TRANSFER: 'var(--transfer)',
};

const CREATE_CATEGORY = '__create__';

const SHORT_METHOD_LABELS = {
  ACCOUNT: 'Conta',
  PIX: 'Pix',
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Crédito',
  DEBIT_CARD: 'Débito',
} as const;

type OpenState = Exclude<TransactionFormState, { open: false }>;

/**
 * Drawer de criar/editar lançamentos (o mesmo componente nos dois casos).
 * Guarda o último estado aberto para o conteúdo continuar na tela durante a
 * animação de saída.
 */
export function TransactionFormDrawer() {
  const { transactionForm, closeTransactionForm } = useDashboard();
  const [lastOpen, setLastOpen] = useState<{ state: OpenState; key: number } | null>(null);
  const [accent, setAccent] = useState<TransactionType>('EXPENSE');

  if (transactionForm.open && transactionForm !== lastOpen?.state) {
    setLastOpen({ state: transactionForm, key: (lastOpen?.key ?? 0) + 1 });
    setAccent(transactionForm.mode === 'edit' ? transactionForm.transaction.type : transactionForm.type);
  }

  return (
    <Drawer open={transactionForm.open} onOpenChange={(open) => !open && closeTransactionForm()}>
      <DrawerContent accent={ACCENTS[accent]}>
        {lastOpen && (
          <TransactionForm
            key={lastOpen.key}
            state={lastOpen.state}
            onClose={closeTransactionForm}
            onTypeChange={setAccent}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}

function TransactionForm({
  state,
  onClose,
  onTypeChange,
}: {
  state: OpenState;
  onClose: () => void;
  onTypeChange: (type: TransactionType) => void;
}) {
  const {
    form: {
      control,
      register,
      setValue,
      formState: { errors, isSubmitted },
    },
    values,
    amount,
    isEditing,
    editing,
    isCardMethod,
    canInstall,
    canRecur,
    recurrencePreview,
    installmentPlan,
    accounts,
    categoryOptions,
    cardOptions,
    changeType,
    changePaymentMethod,
    handleSubmit,
    isSaving,
    scopeDialog,
  } = useTransactionFormController(state, onClose);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const isTransfer = values.type === 'TRANSFER';
  const isExpense = values.type === 'EXPENSE';
  const methods = isExpense ? EXPENSE_METHODS : INCOME_METHODS;
  const accountOptions = accounts.map((account) => ({ value: account.id, label: account.name }));

  const amountLabel = editing?.installmentGroupId
    ? 'Valor da parcela'
    : values.isInstallment && canInstall
      ? 'Valor total da compra'
      : 'Valor';

  const paidLabel = values.isRecurring && canRecur
    ? isExpense
      ? 'A primeira já foi paga'
      : 'A primeira já foi recebida'
    : isExpense
    ? values.paymentMethod === 'CREDIT_CARD'
      ? values.isInstallment
        ? '1ª parcela já paga na fatura'
        : 'Fatura já paga'
      : 'Já foi pago'
    : 'Já recebi';

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
        <DrawerHeader>
          <DrawerTitle>{isEditing ? 'Editar lançamento' : 'Novo lançamento'}</DrawerTitle>
          <DrawerDescription>
            {isEditing
              ? 'Altere os dados e salve.'
              : 'Registre uma saída, uma entrada ou uma transferência entre contas.'}
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-5">
          <SegmentedControl<TransactionType>
            aria-label="Tipo de lançamento"
            value={values.type}
            onChange={(type) => {
              changeType(type);
              onTypeChange(type);
              setIsCreatingCategory(false);
            }}
            options={(
              [
              {
                value: 'EXPENSE',
                label: 'Saída',
                icon: <ArrowUpRight size={16} className="text-expense-strong" />,
                activeClassName: 'bg-expense-soft ring-1 ring-expense/30',
              },
              {
                value: 'INCOME',
                label: 'Entrada',
                icon: <ArrowDownLeft size={16} className="text-income-strong" />,
                activeClassName: 'bg-income-soft ring-1 ring-income/30',
              },
              {
                value: 'TRANSFER',
                label: (
                  <>
                    <span className="sm:hidden">Transf.</span>
                    <span className="hidden sm:inline">Transferência</span>
                  </>
                ),
                icon: <ArrowLeftRight size={16} className="text-transfer-strong" />,
                activeClassName: 'bg-transfer-soft ring-1 ring-transfer/30',
              },
              ] satisfies SegmentedOption<TransactionType>[]
            ).filter((option) => !isEditing || option.value === values.type)}
          />

          {editing?.recurringRule && (
            <p className="flex items-start gap-2 rounded-2xl bg-transfer-soft px-3.5 py-3 text-sm text-fg-soft">
              <Repeat size={16} className="mt-0.5 shrink-0 text-transfer-strong" />
              <span>
                Lançamento recorrente ·{' '}
                <strong className="font-semibold text-fg">
                  {describeRecurrence(editing.recurringRule, editing.occurrenceDate)}
                </strong>
                . Ao salvar, você escolhe se a alteração vale só para esta ocorrência, para as
                próximas ou para todas as não confirmadas.
              </span>
            </p>
          )}

          {editing?.installmentGroupId && (
            <p className="flex items-start gap-2 rounded-2xl bg-subtle px-3.5 py-3 text-sm text-fg-soft">
              <Info size={16} className="mt-0.5 shrink-0 text-muted" />
              Parcela {editing.installmentNumber} de {editing.installmentsTotal}. Ao salvar, você
              escolhe se a alteração vale só para ela ou também para as próximas.
            </p>
          )}

          <div className="rounded-2xl border border-border px-4 pt-3 pb-2">
            <span className="text-xs font-medium text-muted">{amountLabel}</span>
            <div className="flex items-center gap-2">
              <span className="text-lg text-muted">R$</span>
              <Controller
                control={control}
                name="value"
                render={({ field }) => (
                  <InputCurrency
                    aria-label={amountLabel}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.value?.message}
                    autoFocus={!isEditing}
                  />
                )}
              />
            </div>
          </div>

          <Input
            {...register('name')}
            placeholder={isTransfer ? 'Descrição (opcional)' : 'Descrição'}
            autoComplete="off"
            error={errors.name?.message}
          />

          {isTransfer ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                control={control}
                name="fromBankAccountId"
                render={({ field }) => (
                  <Select
                    placeholder="De (origem)"
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={accountOptions}
                    error={errors.fromBankAccountId?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="toBankAccountId"
                render={({ field }) => (
                  <Select
                    placeholder="Para (destino)"
                    value={field.value || undefined}
                    onChange={field.onChange}
                    options={accountOptions}
                    error={errors.toBankAccountId?.message}
                  />
                )}
              />
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePickerInput
                  label={canInstall && values.isInstallment ? 'Data da compra' : 'Data'}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.date?.message}
                />
              )}
            />
            {!isTransfer && (
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    placeholder="Categoria"
                    value={field.value || undefined}
                    // A última opção não é uma categoria: abre a criação rápida.
                    onChange={(value) =>
                      value === CREATE_CATEGORY ? setIsCreatingCategory(true) : field.onChange(value)
                    }
                    error={isCreatingCategory ? undefined : errors.categoryId?.message}
                    options={[
                      ...categoryOptions.map((category) => ({
                        value: category.value,
                        label: category.label,
                        icon: (
                          <CategoryIcon
                            type={values.type}
                            icon={category.icon}
                            color={category.color}
                            size="sm"
                            className="size-6 rounded-lg [&_svg]:size-3.5"
                          />
                        ),
                      })),
                      {
                        value: CREATE_CATEGORY,
                        label: '+ Criar categoria',
                        icon: (
                          <span className="grid size-6 place-items-center rounded-lg border border-dashed border-border text-muted">
                            <Plus size={14} />
                          </span>
                        ),
                      },
                    ]}
                  />
                )}
              />
            )}
          </div>

          {!isTransfer && isCreatingCategory && (
            <QuickCategoryForm
              type={values.type === 'INCOME' ? 'INCOME' : 'EXPENSE'}
              onCancel={() => setIsCreatingCategory(false)}
              onCreated={(category) => {
                setValue('categoryId', category.id, { shouldValidate: isSubmitted });
                setIsCreatingCategory(false);
              }}
            />
          )}

          {!isTransfer && (
            <fieldset className="space-y-3">
              <legend className="mb-2 text-sm font-semibold text-fg">Forma de pagamento</legend>
              <div
                role="radiogroup"
                aria-label="Forma de pagamento"
                className={cn('grid gap-2', isExpense ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-3')}
              >
                {methods.map((method) => {
                  const Icon = paymentMethodIcons[method];
                  const isActive = values.paymentMethod === method;

                  return (
                    <button
                      key={method}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => changePaymentMethod(method)}
                      className={cn(
                        'flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border text-xs font-medium transition-colors outline-none',
                        'focus-visible:ring-4 focus-visible:ring-ring',
                        isActive
                          ? 'border-fg/25 bg-primary-soft text-fg'
                          : 'border-border text-fg-soft hover:bg-subtle',
                      )}
                    >
                      <Icon size={18} aria-hidden className={cn(isActive && 'text-primary-strong dark:text-primary')} />
                      {SHORT_METHOD_LABELS[method]}
                    </button>
                  );
                })}
              </div>

              {isCardMethod ? (
                <Controller
                  control={control}
                  name="cardId"
                  render={({ field }) => (
                    <div>
                      <Select
                        placeholder={
                          values.paymentMethod === 'CREDIT_CARD' ? 'Cartão de crédito' : 'Cartão de débito'
                        }
                        value={field.value || undefined}
                        onChange={field.onChange}
                        error={errors.cardId?.message}
                        options={cardOptions.map((card) => ({
                          value: card.id,
                          label: `${card.name} •••• ${card.lastDigits}`,
                          description:
                            card.kind === 'CREDIT'
                              ? `Fecha dia ${card.closingDay} · vence dia ${card.dueDay}`
                              : (card.bankAccount?.name ?? undefined),
                          icon: <MiniCard color={card.color} brand={card.brand} />,
                        }))}
                      />
                      {cardOptions.length === 0 && (
                        <p className="mt-1.5 text-xs text-muted">
                          Nenhum cartão de {values.paymentMethod === 'CREDIT_CARD' ? 'crédito' : 'débito'}{' '}
                          cadastrado. Cadastre em Cartões.
                        </p>
                      )}
                    </div>
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  name="bankAccountId"
                  render={({ field }) => (
                    <Select
                      placeholder={isExpense ? 'Sai da conta' : 'Entra na conta'}
                      value={field.value || undefined}
                      onChange={field.onChange}
                      options={accountOptions}
                      error={errors.bankAccountId?.message}
                    />
                  )}
                />
              )}
            </fieldset>
          )}

          {canRecur && !values.isInstallment && (
            <div className="space-y-3 rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="is-recurring" className="flex items-center gap-2 text-sm font-semibold text-fg">
                  <Repeat size={16} className="text-transfer-strong" aria-hidden />
                  Repetir (recorrente)
                </label>
                <Controller
                  control={control}
                  name="isRecurring"
                  render={({ field }) => (
                    <Switch
                      id="is-recurring"
                      checked={field.value}
                      onChange={field.onChange}
                      aria-label="Repetir este lançamento"
                    />
                  )}
                />
              </div>

              <AnimatePresence initial={false}>
                {values.isRecurring && (
                  <motion.div
                    key="recurrence"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="-m-1 space-y-3 overflow-hidden p-1"
                  >
                    <Controller
                      control={control}
                      name="frequency"
                      render={({ field }) => (
                        <SegmentedControl<'MONTHLY' | 'WEEKLY' | 'YEARLY'>
                          aria-label="Frequência"
                          size="sm"
                          value={field.value}
                          onChange={field.onChange}
                          options={[
                            { value: 'MONTHLY', label: 'Mensal' },
                            { value: 'WEEKLY', label: 'Semanal' },
                            { value: 'YEARLY', label: 'Anual' },
                          ]}
                        />
                      )}
                    />

                    {values.frequency === 'MONTHLY' && (
                      <Controller
                        control={control}
                        name="dayRule"
                        render={({ field }) => (
                          <SegmentedControl<'FIXED_DAY' | 'BUSINESS_DAY'>
                            aria-label="Dia da repetição"
                            size="sm"
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                              { value: 'FIXED_DAY', label: `Todo dia ${values.date.getDate()}` },
                              { value: 'BUSINESS_DAY', label: 'Dia útil' },
                            ]}
                          />
                        )}
                      />
                    )}

                    {values.frequency === 'MONTHLY' && values.dayRule === 'BUSINESS_DAY' && (
                      <Controller
                        control={control}
                        name="businessDayN"
                        render={({ field }) => (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              aria-label="Dia útil anterior"
                              disabled={field.value <= 1}
                              onClick={() => field.onChange(field.value - 1)}
                              className="grid size-9 place-items-center rounded-full border border-border text-fg-soft hover:bg-subtle disabled:opacity-40"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="money min-w-24 text-center text-sm font-semibold text-fg">
                              {field.value}º dia útil
                            </span>
                            <button
                              type="button"
                              aria-label="Próximo dia útil"
                              disabled={field.value >= 23}
                              onClick={() => field.onChange(field.value + 1)}
                              className="grid size-9 place-items-center rounded-full border border-border text-fg-soft hover:bg-subtle disabled:opacity-40"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        )}
                      />
                    )}

                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted">Termina</span>
                      <Controller
                        control={control}
                        name="endMode"
                        render={({ field }) => (
                          <SegmentedControl<'never' | 'date' | 'count'>
                            aria-label="Quando termina"
                            size="sm"
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                              { value: 'never', label: 'Sem fim' },
                              { value: 'date', label: 'Numa data' },
                              { value: 'count', label: 'Após N vezes' },
                            ]}
                          />
                        )}
                      />
                      {values.endMode === 'date' && (
                        <Controller
                          control={control}
                          name="endDate"
                          render={({ field }) => (
                            <DatePickerInput
                              label="Repete até"
                              value={field.value ?? undefined}
                              onChange={field.onChange}
                              error={errors.endDate?.message}
                            />
                          )}
                        />
                      )}
                      {values.endMode === 'count' && (
                        <Controller
                          control={control}
                          name="maxOccurrences"
                          render={({ field }) => (
                            <label className="flex items-center gap-3 text-sm text-fg-soft">
                              <input
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={600}
                                aria-label="Quantas vezes"
                                value={field.value}
                                onChange={(event) => {
                                  const next = Math.round(Number(event.target.value));
                                  if (Number.isFinite(next)) field.onChange(Math.min(600, Math.max(1, next)));
                                }}
                                className="money h-10 w-20 rounded-xl border border-border bg-card text-center font-semibold text-fg outline-none focus-visible:ring-4 focus-visible:ring-ring"
                              />
                              vezes no total
                            </label>
                          )}
                        />
                      )}
                    </div>

                    <Controller
                      control={control}
                      name="autoConfirm"
                      render={({ field }) => (
                        <div className="flex items-center justify-between gap-3">
                          <label htmlFor="auto-confirm" className="text-sm text-fg-soft">
                            Confirmar sozinho quando a data chegar
                          </label>
                          <Switch
                            id="auto-confirm"
                            checked={field.value}
                            onChange={field.onChange}
                            aria-label="Confirmar sozinho quando a data chegar"
                          />
                        </div>
                      )}
                    />

                    {recurrencePreview.length > 0 && (
                      <div className="rounded-xl bg-subtle p-3 text-sm" aria-live="polite">
                        <p className="font-semibold text-fg">
                          {describeRecurrence(
                            {
                              frequency: values.frequency,
                              dayRule: values.frequency === 'MONTHLY' ? values.dayRule : 'FIXED_DAY',
                              dayOfMonth: values.date.getDate(),
                              businessDayN: values.businessDayN,
                            },
                            values.date,
                          )}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Próximas: {recurrencePreview.map((date) => formatDate(date)).join(' · ')}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          As futuras ficam como previstas e não mexem no saldo até você confirmar.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <AnimatePresence initial={false}>
            {canInstall && (
              <motion.div
                key="installments"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-3 rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="is-installment" className="text-sm font-semibold text-fg">
                      Parcelar?
                    </label>
                    <Controller
                      control={control}
                      name="isInstallment"
                      render={({ field }) => (
                        <Switch id="is-installment" checked={field.value} onChange={field.onChange} aria-label="Parcelar" />
                      )}
                    />
                  </div>

                  {values.isInstallment && (
                    <>
                      <Controller
                        control={control}
                        name="installments"
                        render={({ field }) => (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              aria-label="Menos uma parcela"
                              disabled={field.value <= 2}
                              onClick={() => field.onChange(field.value - 1)}
                              className="grid size-10 place-items-center rounded-full border border-border text-fg-soft hover:bg-subtle disabled:opacity-40"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              inputMode="numeric"
                              min={2}
                              max={48}
                              aria-label="Quantidade de parcelas"
                              value={field.value}
                              onChange={(event) => {
                                const next = Math.round(Number(event.target.value));
                                if (Number.isFinite(next)) field.onChange(Math.min(48, Math.max(2, next)));
                              }}
                              className="money h-10 w-16 rounded-xl border border-border bg-card text-center text-lg font-semibold text-fg outline-none focus-visible:ring-4 focus-visible:ring-ring"
                            />
                            <span className="text-sm text-muted">x</span>
                            <button
                              type="button"
                              aria-label="Mais uma parcela"
                              disabled={field.value >= 48}
                              onClick={() => field.onChange(field.value + 1)}
                              className="grid size-10 place-items-center rounded-full border border-border text-fg-soft hover:bg-subtle disabled:opacity-40"
                            >
                              <Plus size={16} />
                            </button>
                            <div className="ml-auto flex gap-1">
                              {[3, 6, 10, 12].map((count) => (
                                <button
                                  key={count}
                                  type="button"
                                  onClick={() => field.onChange(count)}
                                  className={cn(
                                    'h-8 rounded-lg px-2 text-xs font-semibold transition-colors',
                                    field.value === count ? 'bg-fg text-card' : 'text-fg-soft hover:bg-subtle',
                                  )}
                                >
                                  {count}x
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      />
                      <FieldError message={errors.installments?.message} />

                      {installmentPlan ? (
                        <div className="rounded-xl bg-subtle p-3 text-sm" aria-live="polite">
                          <p className="font-semibold text-fg">
                            {installmentPlan.length}x de{' '}
                            <Money value={installmentPlan[0].value} alwaysVisible />
                            {installmentPlan[installmentPlan.length - 1].value !== installmentPlan[0].value && (
                              <span className="font-normal text-muted">
                                {' '}
                                (última <Money value={installmentPlan[installmentPlan.length - 1].value} alwaysVisible />)
                              </span>
                            )}
                            <span className="font-normal text-muted">
                              {' '}
                              · última parcela em {formatShortMonthYear(installmentPlan[installmentPlan.length - 1].date)}
                            </span>
                          </p>
                          <ol className="mt-2 space-y-1 text-xs text-muted">
                            {installmentPlan.slice(0, 4).map((installment) => (
                              <li key={installment.number} className="flex justify-between gap-2">
                                <span>
                                  {installment.number}ª parcela · {formatDate(installment.date)}
                                </span>
                                <Money value={installment.value} alwaysVisible className="text-fg-soft" />
                              </li>
                            ))}
                            {installmentPlan.length > 4 && (
                              <li>+ {installmentPlan.length - 4} parcelas nos meses seguintes</li>
                            )}
                          </ol>
                        </div>
                      ) : (
                        <p className="text-xs text-muted">Informe o valor para ver as parcelas.</p>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isTransfer && (
            <Controller
              control={control}
              name="paid"
              render={({ field }) => (
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="paid" className="text-sm text-fg-soft">
                    {paidLabel}
                  </label>
                  <Switch id="paid" checked={field.value} onChange={field.onChange} aria-label={paidLabel} />
                </div>
              )}
            />
          )}

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold text-fg">
              Observação <span className="font-normal text-muted">(opcional)</span>
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={3}
              placeholder="Algum detalhe para lembrar depois"
              className="w-full resize-none rounded-2xl border border-border bg-card px-3.5 py-3 text-sm text-fg outline-none placeholder:text-muted focus:border-fg/30 focus-visible:ring-4 focus-visible:ring-ring"
            />
            <FieldError message={errors.notes?.message} />
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving} className="min-w-32">
            {isEditing
              ? 'Salvar'
              : values.isInstallment && canInstall && amount > 0
                ? `Lançar em ${values.installments}x`
                : 'Lançar'}
          </Button>
        </DrawerFooter>
      </form>

      {/* Parcelas e ocorrências recorrentes perguntam o escopo antes de salvar
          (a mesma condição do controller, senão o "Salvar" abre um diálogo que
          não está montado). */}
      {editing && (editing.installmentGroupId || editing.recurringRuleId) && (
        <InstallmentScopeDialog
          open={scopeDialog.open}
          onOpenChange={scopeDialog.setOpen}
          transaction={editing}
          action="edit"
          isLoading={isSaving}
          onConfirm={(scope) => scopeDialog.confirm(scope)}
        />
      )}
    </>
  );
}
