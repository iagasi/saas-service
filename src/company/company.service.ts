import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { emailservice } from 'src/utils/sendEmail';
import { HOST, PORT } from 'src/constants';
import { SucessResponse } from 'src/responses/sucessResponse';
import { LoginDto } from 'src/dto/login.dto';
import { generateHash, generateTokens } from 'src/utils/bcrypt.util';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ICompanyDb } from 'src/interfaces/company';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}
  private async findByEmail(email: string): Promise<Company> | never {
    const company = await this.companyRepository.findOne({
      where: { email: email },
    });

    return company;
  }
  async createUser(user: CreateUserDto, company: ICompanyDb) {
    return null;
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

    try {
      const hashedPassword = await generateHash(createCompanyDto.password);

      createCompanyDto.password = hashedPassword;
      await this.sendActivationEmail(
        createCompanyDto.email,
        'nameagasi@gmail.com',
      );
      const created = await this.companyRepository.save(createCompanyDto);
      return new SucessResponse(
        'Registered check email to ACTIVATE!!',
        created,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  private async sendActivationEmail(companyEmail: string, toEmail: string) {
    await emailservice(
      'Company Activation',
      `http://${HOST}:${PORT}/company/activate/` + companyEmail,
      toEmail,
    );
  }
  async login(loginDto: LoginDto) {
    const company = await this.findByEmail(loginDto.email);
    if (!company) throw new NotFoundException('Company is not registered');
    if (!company.active) {
      this.sendActivationEmail(loginDto.email, 'nameagasi@gmail.com');
      throw new ForbiddenException(
        'Accaunt not Activated an Additional email send too---' +
          loginDto.email,
      );
    }
    const tokens = await generateTokens(loginDto.password, company);
    if (!tokens) {
      throw new UnauthorizedException('email or pasword not correct');
    }
    return new SucessResponse('ok', tokens);
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
