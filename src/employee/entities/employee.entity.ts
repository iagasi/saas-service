import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { File } from './file.entyty';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ nullable: false })
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  password: string;
  @Column({ default: 'USER' })
  role: string;
  @Column({ default: false })
  active: boolean;
  @ManyToMany(() => Company, (c) => c.employees)
  company: Company[];
  @OneToMany(() => File, (file) => file.employee)
  files: File[];
}
