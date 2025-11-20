export interface Participant {
  id: string;
  name: string;
  avatar: string; // URL or placeholder
  status: 'paid' | 'unpaid';
  amount: number;
  isCurrentUser?: boolean;
}

export interface TripDetails {
  title: string;
  totalAmount: number;
  perPersonAmount: number;
  currency: string;
}

export enum PaymentStep {
  Created = 0,
  Invited = 1,
  Partial = 2,
  Completed = 3
}