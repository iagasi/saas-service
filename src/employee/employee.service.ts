import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entyty';
import { Company } from 'src/company/entities/company.entity';
import { SucessResponse } from 'src/responses/sucessResponse';
import { ActivateEmployeeDto } from './dto/activate-emplotee.dto';
import { generateHash } from 'src/utils/bcrypt.util';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeDb: Repository<Employee>,

    @InjectRepository(File)
    private fileDb: Repository<File>,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto, company: Company) {
    try {
      const employee = this.employeeDb.create({
        email: createEmployeeDto.email,
        name: createEmployeeDto.name,
      });
      employee.company = [company];
      await this.employeeDb.save(employee);
      return await this.findByEmail(createEmployeeDto.email);
    } catch (e) {
      throw new BadRequestException('Employee Creation Error' + e.message);
    }
  }

  async findAll() {
    return await this.employeeDb.find();
  }
  async findAllEmployeesByCompanyId(id: string) {
    return await this.employeeDb.find({
      where: { id: id },
      relations: { company: true },
    });
  }
  async findAllFilesUploadedByOneEmployee(fileId: string) {
    return this.fileDb.find({ where: { id: fileId } });
  }
  async findByEmail(email: string) {
    return await this.employeeDb.findOne({ where: { email } });
  }
  async findOne(id: string) {
    return await this.employeeDb.findOne({ where: { id } });
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  async remove(email: string) {
    const employee = await this.findByEmail(email);
    return await this.employeeDb.delete(employee);
  }

  async activate(email: string, activateEmployeeDto: ActivateEmployeeDto) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('companny not found');
    }
    if (user.active) {
      return new SucessResponse('Already Activated!!');
    }
    try {
      const hash = await generateHash(activateEmployeeDto.password);
      await this.employeeDb.update(
        { id: user.id },
        { active: true, password: hash },
      );
      return new SucessResponse('Activated');
    } catch (e) {
      throw new BadRequestException('Activation Error  ' + e.message);
    }
  }
}
