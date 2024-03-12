import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { File } from 'src/employee/entities/file.entyty';
import { Employee } from 'src/employee/entities/employee.entity';

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
  @Column('decimal', { default: 10000 })
  ballance: number;

  @OneToMany(() => File, (file) => file.company)
  files: File[];

  @ManyToMany(() => Employee, (e) => e.company)
  @JoinTable()
  employees: Employee[];

  @OneToOne(() => Subscription)
  @JoinColumn()
  subscription: Subscription;
}
