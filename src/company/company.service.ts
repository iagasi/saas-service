import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { emailservice } from 'src/utils/sendEmail';
import { HOST, PORT } from 'src/constants';
import { SucessResponse } from 'src/responses/sucessResponse';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    public companyRepository: Repository<Company>,
  ) {}
  private async findByEmail(email: string): Promise<Company> | never {
    const company = await this.companyRepository.findOne({
      where: { email: email },
    });

    return company;
  }
  async create(createCompanyDto: CreateCompanyDto) {
    const company = await this.findByEmail(createCompanyDto.email);
    if (company) {
      throw new ConflictException(
        'The company with email---' +
          createCompanyDto.email +
          '--already exists',
      );
    }
    await emailservice(
      'Company Activation',
      `http://${HOST}:${PORT}/company/activate/` + createCompanyDto.email,
      'nameagasi@gmail.com',
    );
    const created = await this.companyRepository.save(createCompanyDto);
    return new SucessResponse('Registered check email to ACTIVATE!!', created);
  }

  async findAll() {
    return await this.companyRepository.find();
  }

  async findOne(id: string) {
    return await this.companyRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);
    if (!company) {
      throw new NotFoundException('companny not found');
    }
    delete updateCompanyDto.email;
    delete updateCompanyDto.active;
    await this.companyRepository.update({ id: company.id }, updateCompanyDto);
    return await this.findOne(id);
  }

  async activate(email: string) {
    const company = await this.findByEmail(email);
    if (!company) {
      throw new NotFoundException('companny not found');
    }
    if (company.active) {
      return new SucessResponse('Already Activated!!');
    }
    await this.companyRepository.update({ id: company.id }, { active: true });
    return new SucessResponse('Activated');
  }
  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
