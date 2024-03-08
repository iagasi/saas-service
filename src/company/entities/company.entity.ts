import { ICompanyDb } from '../../interfaces/company';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

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
  subscription: string;
  @Column()
  industry: string;
}
