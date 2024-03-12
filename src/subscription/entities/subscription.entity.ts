import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ nullable: false })
  name: string;

  @Column()
  price: number;
  @Column()
  files_amount: number;
  @Column()
  users_amount: number;
  @Column('decimal', { precision: 5, scale: 2 })
  exceeded_amount_price: number;
}
export interface ISubscriptionDB {
  id: string;
  name: string;
  price: number;
  files_amount: number;
  users_amount: number;
  exceeded_amount_price: number;
}
