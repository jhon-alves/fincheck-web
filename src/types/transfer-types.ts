export type CreateTransferParams = {
  fromBankAccountId: string;
  toBankAccountId: string;
  name?: string;
  value: number;
  date: string;
};
