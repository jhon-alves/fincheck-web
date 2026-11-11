export type CreateTransferParams = {
  fromBankAccountId: string;
  toBankAccountId: string;
  name?: string;
  value: number;
  /** `YYYY-MM-DD` */
  date: string;
  notes?: string | null;
};

export type UpdateTransferParams = CreateTransferParams & { id: string };
