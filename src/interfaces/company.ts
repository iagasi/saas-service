import { ISubscriptionDB } from 'src/subscription/entities/subscription.entity';

export interface ICompanyDb {
  id: string;
  name: string;
  email: string;
  country: string;
  password: string;
  active: boolean;
  subscription: 'Free' | 'Basic' | 'Premium';
  industry: string;
  role: string;
  ballance: number;
}
