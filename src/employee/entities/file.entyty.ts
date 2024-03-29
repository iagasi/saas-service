import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Employee } from './employee.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Company, (company) => company.files)
  company: Company;
  @Column({ nullable: false })
  name: string;
  @Column({ nullable: false })
  url: string;

  @ManyToOne(() => Employee, (employe) => employe.files)
  employee: Employee;
  @Column('varchar', { array: true })
  access: string[];
}
