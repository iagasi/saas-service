import { Company } from 'src/company/entities/company.entity';
import { PrimaryGeneratedColumn, Column, OneToOne, Entity } from 'typeorm';
@Entity()
export class Purchasedsubscription {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  purchased_at: Date;
  @Column({
    nullable: false,
    default: () => `DATE( CURRENT_DATE) + INTERVAL '1 month'`,
    type: 'timestamp',
  })
  avaible_before: Date;

  @OneToOne(() => Company, (company) => company.curr_subscription, {})
  company: Company;
}
