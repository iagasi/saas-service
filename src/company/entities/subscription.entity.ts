import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ unique: true })
  name: string;
  @Column()
  price: number;
  @Column()
  files_amount: number;
  @Column()
  users_amount: number;
  @Column('decimal', { default: 0 })
  exceeded_amount_price: number;
}
