import { ICompanyDb } from '../../interfaces/company';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity()
export class Company implements ICompanyDb {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  country: string;
  @Column()
  password: string;
  @Column({ default: false })
  active: boolean;
  @Column({ default: null })
  @OneToOne(() => Subscription)
  @JoinColumn()
  subscription: string;
  @Column()
  industry: string;
  @Column({ default: 'ADMIN' })
  role: string;
}
