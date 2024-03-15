import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { File } from 'src/employee/entities/file.entyty';
import { Employee } from 'src/employee/entities/employee.entity';
import { Purchasedsubscription } from 'src/subscription/entities/purchased-subscription.entity';

@Entity()
export class Company {
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

  @Column()
  industry: string;
  @Column({ default: 'ADMIN' })
  role: string;
  @Column('decimal', { default: 0 })
  billing: number;

  @OneToMany(() => File, (file) => file.company)
  files: File[];

  @ManyToMany(() => Employee, (e) => e.company)
  @JoinTable()
  employees: Employee[];

  @ManyToOne(() => Subscription)
  @JoinColumn()
  subscription: Subscription;
  @OneToOne(() => Purchasedsubscription)
  @JoinColumn()
  curr_subscription: Purchasedsubscription;
}
