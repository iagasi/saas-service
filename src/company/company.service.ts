import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { emailservice } from 'src/utils/sendEmail';
import { BASICSUB, FREESUB, HOST, PORT, PREMIUMSUB } from 'src/constants';
import { SucessResponse } from 'src/responses/sucessResponse';
import { LoginDto } from 'src/dto/login.dto';
import { generateHash, generateTokens } from 'src/utils/bcrypt.util';
import { ICompanyDb } from 'src/interfaces/company';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { Subscription } from '../subscription/entities/subscription.entity';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { File } from 'src/employee/entities/file.entyty';
import { Purchasedsubscription } from 'src/subscription/entities/purchased-subscription.entity';

@Injectable()
export class CompanyService {
  constructor(
    private subscriptionService: SubscriptionService,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Subscription)
    private sRepository: Repository<Subscription>,
    @InjectRepository(File)
    private fRepository: Repository<File>,
    @InjectRepository(Purchasedsubscription)
    private purchasedsubscriptionRepository: Repository<File>,
    private employeeService: EmployeeService,
  ) {}
  private async findByEmail(email: string): Promise<Company> | never {
    const company = await this.companyRepository.findOne({
      where: { email: email },
      relations: { subscription: true, curr_subscription: true },
    });

    return company;
  }
  async findCompanyAllFiles(companyId: string) {
    return await this.companyRepository.find({
      relations: { files: true },
      where: { id: companyId },
    });
  }
  private async findCompanySubscription(companyId: string) {
    return await this.companyRepository.find({
      relations: { subscription: true },
      where: { id: companyId },
    });
  }
  async getSubscription(company: ICompanyDb) {
    const yourCompany = await this.companyRepository.findOne({
      where: { id: company.id },
      relations: { subscription: true, curr_subscription: true },
    });
    const allsubscriptions = await this.subscriptionService.findAll();
    return {
      yourCompany: yourCompany,
      availableSunbscriptionToPurchase: allsubscriptions,
    };
  }

  async updateSubscription(company: ICompanyDb, subscriptionName: string) {
    const currCompany = await this.companyRepository.findOne({
      where: { id: company.id },
      relations: { curr_subscription: true, subscription: true },
    });
    if (!currCompany) {
      throw new NotFoundException('Company not fount or not Loggind in');
    }
    const subscriptionPlan = await this.subscriptionService.findByName(
      subscriptionName,
    );
    if (!subscriptionPlan) {
      throw new NotFoundException(
        'Subscription with name  ' +
          subscriptionName +
          '  now found use <free,basic,premium>',
      );
    }

    if (
      currCompany.subscription &&
      currCompany.subscription.name.toLowerCase() ==
        subscriptionName.toLowerCase()
    ) {
      throw new ConflictException(
        'You already have Purchased subscription plan with name << ' +
          subscriptionName +
          '>>',
      );
    }
    try {
      if (currCompany.curr_subscription) {
        this.removeSubscriptionfromCompany(currCompany);
      }

      const purchased = new Purchasedsubscription();
      purchased.company = currCompany;
      await this.purchasedsubscriptionRepository.save(purchased);

      await this.companyRepository.update(
        { id: currCompany.id },
        {
          subscription: subscriptionPlan,
          ballance: currCompany.ballance - subscriptionPlan.price,
          curr_subscription: purchased,
        },
      );

      return await this.findByEmail(company.email);
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException(e.message);
    }
  }
  private async removeSubscriptionfromCompany(currCompany: Company) {
    try {
      const purchasedId = currCompany.curr_subscription.id;
      currCompany.curr_subscription = null;
      await this.companyRepository.save(currCompany);

      const currSubscription =
        await this.purchasedsubscriptionRepository.findOne({
          where: { id: purchasedId },
        });

      if (currSubscription) {
        await this.purchasedsubscriptionRepository.remove(currSubscription);
      }
    } catch (e) {
      throw new BadRequestException(e.messgae);
    }
  }
  async createEmployee(employee: CreateEmployeeDto, company: ICompanyDb) {
    const currentCompany = await this.companyRepository.findOne({
      relations: { employees: true, subscription: true, files: true },
      where: { id: company.id },
    });
    if (!currentCompany.subscription) {
      return new BadRequestException(
        `Chose subscription Plan to add employee  ->Patch request to
        ${HOST}:/company/subscribe/Free,or Basic,or Premium
          `,
      );
    }
    const amountMustBeWithdrawed =
      currentCompany.subscription.exceeded_amount_price;
    if (
      currentCompany.employees.find((e) => e.email == employee.email) ||
      currentCompany.email == employee.email
    ) {
      throw new ConflictException('User with This email already registered');
    }
    const currentSubPlan = currentCompany.subscription;
    if (
      (currentSubPlan.name == FREESUB || currentSubPlan.name == BASICSUB) &&
      currentCompany.employees.length >= currentSubPlan.users_amount
    ) {
      throw new HttpException('Payment Required', HttpStatus.PAYMENT_REQUIRED);
    } else if (
      currentSubPlan.name == PREMIUMSUB &&
      currentCompany.files.length >= currentSubPlan.files_amount
    ) {
      // console.log(currentCompany.employees.length);

      // console.log(currentSubPlan.users_amount);
      // console.log(currentSubPlan);

      // console.log('here');

      await this.companyRepository.update(
        { ballance: currentCompany.ballance - amountMustBeWithdrawed },
        currentCompany,
      );
    }
    await userActivationEmail(employee.email, employee.email, company.email);
    await userActivationEmail(
      employee.email,
      'nameagasi@gmail.com',
      company.email,
    );
    return this.employeeService.create(employee, currentCompany);
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
        createCompanyDto.email,
      );
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

  async login(loginDto: LoginDto) {
    const company = await this.findByEmail(loginDto.email);
    if (!company) throw new NotFoundException('Company is not registered');
    if (!company.active) {
      this.sendActivationEmail(loginDto.email, 'nameagasi@gmail.com');
      throw new ForbiddenException(
        'Account not Activated an Additional email send too---' +
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
    const allCompanies = await this.companyRepository.find({
      relations: { employees: true, subscription: true },
    });
    const newallCompanies = allCompanies.map((c) => {
      const { password, ...newCompany } = c;
      return newCompany;
    });

    return newallCompanies;
  }

  async findOne(id: string) {
    return await this.companyRepository.findOne({
      where: { id },
      relations: { subscription: true, files: true, employees: true },
    });
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    currCompany: ICompanyDb,
  ) {
    const company = await this.findOne(id);
    if (!company) {
      throw new NotFoundException('companny not found');
    }
    if (currCompany.id !== company.id) {
      throw new MethodNotAllowedException('You cannot modify others Data');
    }
    delete updateCompanyDto.email;
    delete updateCompanyDto.active;

    if (updateCompanyDto.password) {
      try {
        const hash = await generateHash(updateCompanyDto.password);
        updateCompanyDto.password = hash;
      } catch (e) {}
    }
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

  private async sendActivationEmail(companyEmail: string, toEmail: string) {
    await emailservice(
      'Company Activation',
      `http://${HOST}:${PORT}/company/activate/` + companyEmail,
      toEmail,
    );
  }
}
export async function userActivationEmail(
  userEmail: string,
  toEmail: string,
  companyEmail: string,
) {
  await emailservice(
    'Complete registracion in company  ' + companyEmail,
    `http://${HOST}:${PORT}/employee/activate/` + userEmail,
    toEmail,
  );
}
