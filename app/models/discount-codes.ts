export type AmountUnit = "percentage" | "currency";

export interface Amount {
  value: number;
  unit: AmountUnit;
}

export interface Uses {
  totalUse: number;
  maxUse: number;
}

export interface Code {
  _id?: string;
  isActive: boolean;
  code: string;
  amount: Amount;
  uses: Uses;
}
