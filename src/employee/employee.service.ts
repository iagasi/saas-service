import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { generateHash, generateTokens } from 'src/utils/bcrypt.util';
import { LoginEmployeeDto } from './dto/login.employee.dto';
import { userActivationEmail } from 'src/company/company.service';
import { IEmployeeDb } from 'src/interfaces/employee';
import { UploadFileDto } from './dto/upload.file.dto';
import { writeFile } from 'fs';
import * as path from 'path';
import * as uuid from 'uuid-random';
import { promisify } from 'util';
import { HOST, PORT, PREMIUMSUB } from 'src/constants';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeDb: Repository<Employee>,

    @InjectRepository(File)
    private fileDb: Repository<File>,
    @InjectRepository(Company)
    private companyDB: Repository<Company>,
  ) {}

  async login(loginDto: LoginEmployeeDto) {
    const user = await this.findByEmail(loginDto.email);
    if (!user) throw new NotFoundException('Company is not registered');
    if (!user.active) {
      userActivationEmail(loginDto.email, loginDto.email, ' company');
      throw new ForbiddenException(
        'Account not Activated an Additional email send too---' +
          loginDto.email,
      );
    }
    const tokens = await generateTokens(loginDto.password, user);
    if (!tokens) {
      throw new UnauthorizedException('email or pasword not correct');
    }
    return new SucessResponse('ok', tokens);
  }
  async create(createEmployeeDto: CreateEmployeeDto, company: Company) {
    try {
      const candidteEmployee = await this.employeeDb.findOne({
        where: { email: createEmployeeDto.email },
        relations: { company: true },
      });
      let employee = null;
      if (!candidteEmployee) {
        employee = new Employee();
        employee.email = createEmployeeDto.email;
        employee.name = createEmployeeDto.name;
        employee.company = [company];
        await this.employeeDb.save(employee);
      } else {
        candidteEmployee.company.push(company);
        await this.employeeDb.save(candidteEmployee);
      }

      return await this.findByEmail(createEmployeeDto.email);
    } catch (e) {
      throw new BadRequestException('Employee Creation Error' + e.message);
    }
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

  async remove(id: string) {
    const employee = await this.employeeDb.findOne({
      where: { id },
      relations: { files: true },
    });
    const files = await this.fileDb.find({
      where: { employee: employee },
      relations: { employee: true },
    });

    files.forEach((f) => (f.employee = null));
    await this.fileDb.save(files);

    await this.employeeDb.remove(employee);
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

  async uploadFile(
    file: Express.Multer.File,
    user: IEmployeeDb,
    createFileDto: UploadFileDto,
  ) {
    const employee = await this.employeeDb.findOne({
      where: { email: user.email },
      relations: { company: true },
    });

    if (!employee.company.length) {
      throw new NotFoundException(
        'You are not registered in this company to upload files > ',
      );
    }
    if (!employee.company.find((c) => c.id == createFileDto.companyId)) {
      throw new BadRequestException(
        'You are not allowed upload in thos company with id ->  ' +
          createFileDto.companyId,
      );
    }
    const company = await this.companyDB.findOne({
      where: { id: createFileDto.companyId },
      relations: { subscription: true, files: true, employees: true },
    });

    if (!company) {
      throw new NotFoundException(' Wrong companyId ');
    }

    await this.checkSubscription(company);

    const fileName = await this.wriefileOnDisc(file);
    const url = HOST + ':' + PORT + '/uploads/' + fileName;
    const newFileEntity = await this.fileDb.create({
      name: fileName,
      url,
      employee: employee,
      company: company,
      access: createFileDto.access,
    });
    await this.fileDb.save(newFileEntity);
    return this.fileDb.findOne({ where: { id: newFileEntity.id } });
  }
  async findAll(employee: Employee) {
    return await this.employeeDb.findOne({
      where: { id: employee.id },
      relations: { files: true },
    });
  }
  async checkSubscription(company: Company) {
    const employees = company.employees.length;
    const files = company.files.length;
    const subscription = company.subscription;
    if (!company.subscription) {
      throw new HttpException(
        'Plesae purchase subscription',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    if (subscription.name !== PREMIUMSUB) {
      if (
        employees > subscription.users_amount ||
        files > subscription.files_amount
      ) {
        throw new HttpException(
          `Your Company Plan<<${subscription.name}>> Does not allows upload FIles`,
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
    } else if (subscription.name == PREMIUMSUB) {
      if (files < subscription.files_amount) {
      }
      if (files < subscription.files_amount) {
        await this.premiunToManyFiles(
          company.id,
          company.subscription.exceeded_amount_price,
        );
      }
    }
  }

  async premiunToManyFiles(companyId: string, mustToBEPayd: number) {
    const company = await this.companyDB.findOne({ where: { id: companyId } });

    try {
      await this.companyDB.update(
        {
          billing: company.billing + mustToBEPayd,
        },
        company,
      );
    } catch (e) {
      throw new ConflictException(
        'Premium subscription  Exeeded files withdrawing money Error',
      );
    }
  }
  private async wriefileOnDisc(file: Express.Multer.File) {
    const randomName = uuid() + file.originalname;
    const pathToSave = path.resolve(process.cwd(), 'uploads', randomName);
    try {
      await promisify(writeFile)(pathToSave, file.buffer);
      console.log('Successfully uploaded:', pathToSave);
      return randomName;
    } catch (err) {
      throw new BadRequestException('File saving error: ' + err.message);
    }
  }
}
//
