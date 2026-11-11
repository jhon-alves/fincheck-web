import { useMemo, useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsServices } from '../../../services/cards-services';
import { currencyStringToNumber } from '../../../helpers';
import { queryKeys, useBankAccounts } from '../../../hooks';
import type { Card, CardBrand, CardParams } from '../../../types/cards-types';
import {
  analyzeCardNumber,
  formatCardNumber,
  formatExpiry,
  previewCardNumber,
  savedCardNumber,
} from '../cardNumber';
import { BRAND_THEME, DEFAULT_CARD_THEME } from '../cardThemes';

/**
 * Como o número entra no formulário:
 * - `full`: digitado inteiro, só para detectar a bandeira e validar (Luhn);
 * - `last4`: o usuário prefere informar só o final e escolher a bandeira;
 * - `saved`: edição — o número completo já não existe, só o final salvo.
 */
export type NumberMode = 'full' | 'last4' | 'saved';

const BRANDS = ['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'DINERS', 'DISCOVER', 'JCB', 'OTHER'] as const;

const schema = z
  .object({
    name: z.string().trim().min(1, 'Dê um apelido ao cartão').max(40, 'Use até 40 caracteres'),
    holderName: z
      .string()
      .trim()
      .min(2, 'Informe o nome impresso no cartão')
      .max(60, 'Use até 60 caracteres'),
    numberMode: z.enum(['full', 'last4', 'saved']),
    number: z.string(),
    lastDigits: z.string(),
    brand: z.enum(BRANDS).nullable(),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Informe a validade no formato MM/AA'),
    kind: z.enum(['CREDIT', 'DEBIT']),
    color: z.string().min(1, 'Escolha uma cor'),
    bankAccountId: z.string(),
    creditLimit: z.union([z.string(), z.number()]),
    closingDay: z.string(),
    dueDay: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.numberMode === 'full') {
      const analysis = analyzeCardNumber(data.number);

      if (analysis.digits.length < 12) {
        ctx.addIssue({ code: 'custom', path: ['number'], message: 'Digite o número completo do cartão' });
      } else if (!analysis.isValid) {
        ctx.addIssue({ code: 'custom', path: ['number'], message: 'Número de cartão inválido — confira os dígitos' });
      }
    }

    if (data.numberMode === 'last4') {
      if (!/^\d{4}$/.test(data.lastDigits)) {
        ctx.addIssue({ code: 'custom', path: ['lastDigits'], message: 'Informe os 4 últimos dígitos' });
      }
      if (!data.brand) {
        ctx.addIssue({ code: 'custom', path: ['brand'], message: 'Escolha a bandeira' });
      }
    }

    if (data.kind === 'CREDIT') {
      if (!(currencyStringToNumber(data.creditLimit) > 0)) {
        ctx.addIssue({ code: 'custom', path: ['creditLimit'], message: 'Informe o limite do cartão' });
      }
      if (!data.closingDay) {
        ctx.addIssue({ code: 'custom', path: ['closingDay'], message: 'Escolha o dia de fechamento' });
      }
      if (!data.dueDay) {
        ctx.addIssue({ code: 'custom', path: ['dueDay'], message: 'Escolha o dia de vencimento' });
      }
    }

    if (data.kind === 'DEBIT' && !data.bankAccountId) {
      ctx.addIssue({
        code: 'custom',
        path: ['bankAccountId'],
        message: 'Escolha a conta de onde o débito sai',
      });
    }
  });

export type CardFormData = z.infer<typeof schema>;

function defaultValues(card: Card | null): CardFormData {
  return {
    name: card?.name ?? '',
    holderName: card?.holderName ?? '',
    numberMode: card ? 'saved' : 'full',
    number: '',
    lastDigits: card?.lastDigits ?? '',
    brand: card?.brand ?? null,
    expiry: card ? formatExpiry(card.expMonth, card.expYear) : '',
    kind: card?.kind ?? 'CREDIT',
    color: card?.color ?? DEFAULT_CARD_THEME,
    bankAccountId: card?.bankAccountId ?? '',
    creditLimit: card?.creditLimit ?? '',
    closingDay: card?.closingDay ? String(card.closingDay) : '',
    dueDay: card?.dueDay ? String(card.dueDay) : '',
  };
}

export function useCardFormController(card: Card | null, onClose: () => void) {
  const isEditing = !!card;
  const queryClient = useQueryClient();
  const { accounts } = useBankAccounts();
  // Enquanto o usuário não escolher uma cor, ela acompanha a bandeira detectada.
  const [isColorTouched, setIsColorTouched] = useState(isEditing);

  const form = useForm<CardFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(card),
  });

  const { watch, setValue } = form;
  const values = watch();
  const analysis = useMemo(() => analyzeCardNumber(values.number), [values.number]);

  const detectedBrand: CardBrand | null =
    values.numberMode === 'full'
      ? analysis.brand
      : values.numberMode === 'last4'
        ? values.brand
        : (card?.brand ?? null);

  const previewNumber =
    values.numberMode === 'full'
      ? previewCardNumber(analysis.digits, analysis.gaps, analysis.displayLength)
      : savedCardNumber(
          values.numberMode === 'last4' ? values.lastDigits.padEnd(4, '•') : (card?.lastDigits ?? '••••'),
          detectedBrand,
        );

  function handleNumberChange(raw: string) {
    const next = analyzeCardNumber(raw);
    const digits = next.digits.slice(0, next.maxLength);
    setValue('number', formatCardNumber(digits, next.gaps), { shouldValidate: form.formState.isSubmitted });

    if (next.brand && !isColorTouched) {
      setValue('color', BRAND_THEME[next.brand]);
    }
  }

  function handleColorChange(color: string) {
    setIsColorTouched(true);
    setValue('color', color);
  }

  function handleBrandChange(brand: CardBrand) {
    setValue('brand', brand, { shouldValidate: form.formState.isSubmitted });
    if (!isColorTouched) setValue('color', BRAND_THEME[brand]);
  }

  function setNumberMode(mode: NumberMode) {
    setValue('numberMode', mode);
    setValue('number', '');
    if (mode !== 'saved') {
      setValue('lastDigits', '');
      setValue('brand', null);
    } else {
      setValue('lastDigits', card?.lastDigits ?? '');
      setValue('brand', card?.brand ?? null);
    }
    form.clearErrors(['number', 'lastDigits', 'brand']);
  }

  const { mutateAsync: saveCard, isPending } = useMutation({
    mutationFn: (params: CardParams) =>
      card ? cardsServices.updateCard({ id: card.id, ...params }) : cardsServices.createCard(params),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const [month, year] = data.expiry.split('/').map(Number);

    // Monta o corpo campo a campo: o número completo nunca entra aqui.
    const params: CardParams = {
      name: data.name.trim(),
      holderName: data.holderName.trim(),
      lastDigits:
        data.numberMode === 'full'
          ? analyzeCardNumber(data.number).digits.slice(-4)
          : data.lastDigits,
      brand:
        data.numberMode === 'full'
          ? (analyzeCardNumber(data.number).brand ?? 'OTHER')
          : (data.brand ?? 'OTHER'),
      kind: data.kind,
      color: data.color,
      expMonth: month,
      expYear: 2000 + year,
      bankAccountId: data.bankAccountId || null,
      creditLimit:
        data.kind === 'CREDIT'
          ? currencyStringToNumber(data.creditLimit)
          : null,
      closingDay: data.kind === 'CREDIT' ? Number(data.closingDay) : null,
      dueDay: data.kind === 'CREDIT' ? Number(data.dueDay) : null,
      archived: card?.archived,
    };

    try {
      await saveCard(params);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.cards }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions() }),
      ]);
      toast.success(isEditing ? 'Cartão atualizado!' : 'Cartão cadastrado!');
      onClose();
    } catch {
      toast.error(isEditing ? 'Não foi possível salvar o cartão' : 'Não foi possível cadastrar o cartão');
    }
  });

  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  return {
    form,
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
  };
}
