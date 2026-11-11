import { useMemo, useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  currencyStringToNumber,
  fromApiDate,
  previewRecurrence,
  toApiDate,
} from '../../../helpers';
import {
  useBankAccounts,
  useCards,
  useCategories,
  useInvalidateFinance,
} from '../../../hooks';
import { transactionsServices } from '../../../services/transactions-services';
import { transfersServices } from '../../../services/transfers-services';
import type {
  InstallmentScope,
  PaymentMethod,
  Transaction,
  TransactionType,
} from '../../../types/transactions-types';
import type { TransactionFormState } from '../../Dashboard/DashboardContext/DashboardContext';
import { previewInstallments } from '../installmentPreview';

const MAX_INSTALLMENTS = 48;

const schema = z
  .object({
    type: z.enum(['EXPENSE', 'INCOME', 'TRANSFER']),
    value: z.union([z.string(), z.number()]),
    name: z.string().max(120, 'Use até 120 caracteres'),
    date: z.date({ required_error: 'Informe a data' }),
    categoryId: z.string(),
    notes: z.string().max(500, 'Use até 500 caracteres'),
    paymentMethod: z.enum(['ACCOUNT', 'PIX', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD']),
    bankAccountId: z.string(),
    cardId: z.string(),
    paid: z.boolean(),
    isInstallment: z.boolean(),
    installments: z.number().int().min(2).max(MAX_INSTALLMENTS),
    fromBankAccountId: z.string(),
    toBankAccountId: z.string(),
    // Recorrência
    isRecurring: z.boolean(),
    frequency: z.enum(['MONTHLY', 'WEEKLY', 'YEARLY']),
    dayRule: z.enum(['FIXED_DAY', 'BUSINESS_DAY']),
    businessDayN: z.number().int().min(1).max(23),
    endMode: z.enum(['never', 'date', 'count']),
    endDate: z.date().nullable(),
    maxOccurrences: z.number().int().min(1).max(600),
    autoConfirm: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const amount = currencyStringToNumber(data.value);

    if (!(amount > 0)) {
      ctx.addIssue({ code: 'custom', path: ['value'], message: 'Informe um valor maior que zero' });
    }

    if (data.type === 'TRANSFER') {
      if (!data.fromBankAccountId) {
        ctx.addIssue({ code: 'custom', path: ['fromBankAccountId'], message: 'Escolha a conta de origem' });
      }
      if (!data.toBankAccountId) {
        ctx.addIssue({ code: 'custom', path: ['toBankAccountId'], message: 'Escolha a conta de destino' });
      } else if (data.toBankAccountId === data.fromBankAccountId) {
        ctx.addIssue({ code: 'custom', path: ['toBankAccountId'], message: 'Escolha uma conta diferente da origem' });
      }
      return;
    }

    if (!data.name.trim()) {
      ctx.addIssue({ code: 'custom', path: ['name'], message: 'Dê um nome ao lançamento' });
    }
    if (!data.categoryId) {
      ctx.addIssue({ code: 'custom', path: ['categoryId'], message: 'Escolha a categoria' });
    }

    const isCard = data.paymentMethod === 'CREDIT_CARD' || data.paymentMethod === 'DEBIT_CARD';
    if (isCard && !data.cardId) {
      ctx.addIssue({ code: 'custom', path: ['cardId'], message: 'Escolha o cartão' });
    }
    if (!isCard && !data.bankAccountId) {
      ctx.addIssue({ code: 'custom', path: ['bankAccountId'], message: 'Escolha a conta' });
    }

    if (data.isRecurring && data.endMode === 'date') {
      if (!data.endDate) {
        ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'Escolha até quando repete' });
      } else if (toApiDate(data.endDate) < toApiDate(data.date)) {
        ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'O fim precisa ser depois do início' });
      }
    }

    if (data.isInstallment && Math.round(amount * 100) < data.installments) {
      ctx.addIssue({
        code: 'custom',
        path: ['installments'],
        message: 'Cada parcela precisa valer pelo menos R$ 0,01',
      });
    }
  });

export type TransactionFormData = z.infer<typeof schema>;

const RECURRENCE_DEFAULTS = {
  isRecurring: false,
  frequency: 'MONTHLY' as const,
  dayRule: 'FIXED_DAY' as const,
  businessDayN: 5,
  endMode: 'never' as const,
  endDate: null,
  maxOccurrences: 12,
  autoConfirm: false,
};

export const INCOME_METHODS: PaymentMethod[] = ['ACCOUNT', 'PIX', 'CASH'];
export const EXPENSE_METHODS: PaymentMethod[] = ['ACCOUNT', 'PIX', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD'];

function defaultValues(
  state: Exclude<TransactionFormState, { open: false }>,
  hasCreditCards: boolean,
): TransactionFormData {
  if (state.mode === 'edit') {
    const t = state.transaction;

    return {
      type: t.type,
      value: t.value,
      name: t.type === 'TRANSFER' && t.name === 'Transferência' ? '' : t.name,
      date: fromApiDate(t.date),
      categoryId: t.categoryId ?? t.category?.id ?? '',
      notes: t.notes ?? '',
      paymentMethod: t.paymentMethod,
      bankAccountId: t.bankAccountId ?? '',
      cardId: t.cardId ?? '',
      paid: t.paid,
      isInstallment: false,
      installments: 2,
      fromBankAccountId: t.type === 'TRANSFER' ? (t.bankAccountId ?? '') : '',
      toBankAccountId: t.toBankAccountId ?? '',
      ...RECURRENCE_DEFAULTS,
    };
  }

  return {
    type: state.type,
    value: '',
    name: '',
    date: state.date ?? new Date(),
    categoryId: '',
    notes: '',
    // Saída começa no crédito quando há cartão de crédito; senão, na conta.
    paymentMethod:
      state.type === 'EXPENSE' ? (hasCreditCards ? 'CREDIT_CARD' : 'ACCOUNT') : 'PIX',
    bankAccountId: '',
    cardId: '',
    paid: !(state.type === 'EXPENSE' && hasCreditCards),
    isInstallment: false,
    installments: 2,
    fromBankAccountId: '',
    toBankAccountId: '',
    ...RECURRENCE_DEFAULTS,
  };
}

export function useTransactionFormController(
  state: Exclude<TransactionFormState, { open: false }>,
  onClose: () => void,
) {
  const isEditing = state.mode === 'edit';
  const editing: Transaction | null = state.mode === 'edit' ? state.transaction : null;
  // Parcelas e ocorrências recorrentes perguntam o escopo antes de salvar.
  const isInstallmentGroup = !!editing?.installmentGroupId || !!editing?.recurringRuleId;

  const { accounts } = useBankAccounts();
  const { categories } = useCategories();
  const { activeCards, cards } = useCards();
  const invalidateFinance = useInvalidateFinance();
  const [isScopeDialogOpen, setIsScopeDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<TransactionFormData | null>(null);

  const hasCreditCards = activeCards.some((card) => card.kind === 'CREDIT');

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(state, hasCreditCards),
  });

  const { watch, setValue } = form;
  const values = watch();
  const amount = currencyStringToNumber(values.value);
  const isCardMethod = values.paymentMethod === 'CREDIT_CARD' || values.paymentMethod === 'DEBIT_CARD';
  const canRecur = !isEditing && values.type !== 'TRANSFER';
  const canInstall =
    values.type === 'EXPENSE' &&
    values.paymentMethod === 'CREDIT_CARD' &&
    !isEditing &&
    !values.isRecurring;

  const categoryOptions = useMemo(
    () =>
      categories
        .filter((category) => category.type === values.type)
        .map((category) => ({
          value: category.id,
          label: category.name,
          icon: category.icon,
          color: category.color,
        })),
    [categories, values.type],
  );

  const cardOptions = useMemo(() => {
    const kind = values.paymentMethod === 'DEBIT_CARD' ? 'DEBIT' : 'CREDIT';
    // Na edição, mantém o cartão atual na lista mesmo se ele foi arquivado.
    const pool = cards.filter(
      (card) => card.kind === kind && (!card.archived || card.id === editing?.cardId),
    );
    return pool;
  }, [cards, values.paymentMethod, editing?.cardId]);

  const recurrencePreview = useMemo(() => {
    if (!canRecur || !values.isRecurring) return [];
    return previewRecurrence(
      {
        frequency: values.frequency,
        dayRule: values.frequency === 'MONTHLY' ? values.dayRule : 'FIXED_DAY',
        dayOfMonth: values.date.getDate(),
        businessDayN: values.businessDayN,
      },
      values.date,
      4,
    );
  }, [
    canRecur,
    values.isRecurring,
    values.frequency,
    values.dayRule,
    values.businessDayN,
    values.date,
  ]);

  const installmentPlan = useMemo(() => {
    if (!canInstall || !values.isInstallment || !(amount > 0)) return null;
    return previewInstallments(amount, values.installments, values.date);
  }, [canInstall, values.isInstallment, values.installments, amount, values.date]);

  function changeType(type: TransactionType) {
    if (isEditing || type === values.type) return;
    setValue('type', type);
    setValue('categoryId', '');
    setValue('isInstallment', false);
    if (type === 'TRANSFER') setValue('isRecurring', false);
    if (type === 'INCOME') {
      setValue('paymentMethod', 'PIX');
      setValue('paid', true);
    }
    if (type === 'EXPENSE') {
      setValue('paymentMethod', hasCreditCards ? 'CREDIT_CARD' : 'ACCOUNT');
      setValue('paid', !hasCreditCards);
    }
    form.clearErrors();
  }

  function changePaymentMethod(method: PaymentMethod) {
    setValue('paymentMethod', method);
    setValue('cardId', '');
    if (method !== 'CREDIT_CARD') setValue('isInstallment', false);
    // Crédito só é pago com a fatura; o resto nasce pago (pode desmarcar).
    if (!isEditing) setValue('paid', method !== 'CREDIT_CARD');
    form.clearErrors(['cardId', 'bankAccountId']);
  }

  const { mutateAsync: createTransaction, isPending: isCreating } = useMutation({
    mutationFn: transactionsServices.createTransaction,
  });
  const { mutateAsync: updateTransaction, isPending: isUpdating } = useMutation({
    mutationFn: transactionsServices.updateTransaction,
  });
  const { mutateAsync: createTransfer, isPending: isCreatingTransfer } = useMutation({
    mutationFn: transfersServices.createTransfer,
  });
  const { mutateAsync: updateTransfer, isPending: isUpdatingTransfer } = useMutation({
    mutationFn: transfersServices.updateTransfer,
  });

  async function save(data: TransactionFormData, scope: InstallmentScope = 'one') {
    const value = currencyStringToNumber(data.value);
    const date = toApiDate(data.date);
    const notes = data.notes.trim() || null;

    try {
      if (data.type === 'TRANSFER') {
        const body = {
          fromBankAccountId: data.fromBankAccountId,
          toBankAccountId: data.toBankAccountId,
          name: data.name.trim() || undefined,
          value,
          date,
          notes,
        };
        if (editing) await updateTransfer({ id: editing.id, ...body });
        else await createTransfer(body);
      } else {
        const isCard = data.paymentMethod === 'CREDIT_CARD' || data.paymentMethod === 'DEBIT_CARD';
        const body = {
          type: data.type,
          name: data.name.trim(),
          date,
          categoryId: data.categoryId,
          paymentMethod: data.paymentMethod,
          bankAccountId: isCard ? null : data.bankAccountId,
          cardId: isCard ? data.cardId : null,
          paid: data.paid,
          notes,
        };

        if (editing) {
          await updateTransaction({ id: editing.id, ...body, value, scope });
        } else {
          const isMonthlyBusinessDay =
            data.frequency === 'MONTHLY' && data.dayRule === 'BUSINESS_DAY';

          await createTransaction({
            ...body,
            totalValue: value,
            installments: data.isInstallment && !data.isRecurring ? data.installments : 1,
            recurrence: data.isRecurring
              ? {
                  frequency: data.frequency,
                  dayRule: isMonthlyBusinessDay ? 'BUSINESS_DAY' : 'FIXED_DAY',
                  dayOfMonth: isMonthlyBusinessDay ? null : data.date.getDate(),
                  businessDayN: isMonthlyBusinessDay ? data.businessDayN : null,
                  endDate:
                    data.endMode === 'date' && data.endDate ? toApiDate(data.endDate) : null,
                  maxOccurrences: data.endMode === 'count' ? data.maxOccurrences : null,
                  autoConfirm: data.autoConfirm,
                }
              : undefined,
          });
        }
      }

      await invalidateFinance();
      toast.success(
        editing
          ? 'Lançamento atualizado!'
          : data.isRecurring && data.type !== 'TRANSFER'
            ? 'Lançamento recorrente criado!'
            : data.isInstallment && data.type === 'EXPENSE'
            ? `Compra em ${data.installments}x lançada!`
            : data.type === 'TRANSFER'
              ? 'Transferência registrada!'
              : 'Lançamento criado!',
      );
      setIsScopeDialogOpen(false);
      onClose();
    } catch {
      toast.error(editing ? 'Não foi possível salvar o lançamento' : 'Não foi possível criar o lançamento');
    }
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    // Parcela: pergunta o escopo antes de salvar, como no Google Agenda.
    if (isInstallmentGroup) {
      setPendingData(data);
      setIsScopeDialogOpen(true);
      return;
    }

    await save(data);
  });

  return {
    form,
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
    activeCards,
    categoryOptions,
    cardOptions,
    changeType,
    changePaymentMethod,
    handleSubmit,
    isSaving: isCreating || isUpdating || isCreatingTransfer || isUpdatingTransfer,
    scopeDialog: {
      open: isScopeDialogOpen,
      setOpen: setIsScopeDialogOpen,
      confirm: (scope: InstallmentScope) => pendingData && save(pendingData, scope),
    },
  };
}
