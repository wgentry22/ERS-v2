export enum ReimbursementType {
  LODGING = "Lodging",
  FLIGHT = "Flight",
  GAS = "Gas",
  FOOD = "Food",
  CERTIFICATE = "Certificate"
}

export enum ReimbursementStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2
}

export function getReimbursementTypeDisplayStrings(): string[] {
  return Object.keys(ReimbursementType);
}

export function getReimbursementTypeIndex(type: ReimbursementType): number {
  let index: number = 0;
  for (const key in Object.keys(ReimbursementType)) {
    if (ReimbursementType[key] === type) {
      break;
    }
    index++;
  }
  return index;
}

export interface Reimbursement {
  id: number;
  amount?: number;
  description?: string;
  type?: number;
  expenseDate?: Date;
  resolutionDate?: Date;
  status?: number
  createdBy?: string;
  resolvedBy?: string;
}

export interface ReimbursementForm {
  amount: number;
  description: string;
  type: number;
  expenseDate: number;
}
