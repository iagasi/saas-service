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
import { BASICSUB, FREESUB, HOST, PORT } from 'src/constants';
import { SucessResponse } from 'src/responses/sucessResponse';
import { LoginDto } from 'src/dto/login.dto';
import { generateHash, generateTokens } from 'src/utils/bcrypt.util';
import { ICompanyDb } from 'src/interfaces/company';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { File } from 'src/employee/entities/file.entyty';
import { Purchasedsubscription } from 'src/subscription/entities/purchased-subscription.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Injectable()
export class CompanyService {
  constructor(
    private subscriptionService: SubscriptionService,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Employee)
    private employeeDb: Repository<Employee>,

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
    return await this.companyRepository.findOne({
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
          billing: currCompany.billing + subscriptionPlan.price,
          curr_subscription: purchased,
        },
      );

      return await this.findByEmail(company.email);
    } catch (e) {
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
    const currUser = await this.employeeService.findByEmail(employee.email);
    const plainCompany = await this.companyRepository.findOne({
      where: { id: company.id },
    });
    if (!currentCompany.subscription) {
      throw new ConflictException(
        `Chose subscription Plan to add employee  ->Patch request to
        ${HOST}:/company/subscribe/Free,or Basic,or Premium
          `,
      );
    }
    if (currUser) {
      throw new ConflictException(
        'this User Alredy registered in  Company with  email->' +
          currentCompany.email,
      );
    }

    const subscriptionName = currentCompany.subscription.name;
    const usersCanHAndle = currentCompany.subscription.users_amount;
    const exceededPrice = currentCompany.subscription.exceeded_amount_price;
    const price = currentCompany.subscription.price;
    if (subscriptionName === BASICSUB) {
      if (currentCompany.employees.length >= usersCanHAndle) {
        throw new HttpException(
          'Basic subscription You can have only 10 Employee',
          HttpStatus.PAYMENT_REQUIRED,
        );
      } else {
        await this.companyRepository.update(
          { billing: currentCompany.billing + 5 },
          plainCompany,
        );
        console.log(currentCompany.billing + 0.1);
      }
    }
    if (subscriptionName === FREESUB) {
      if (currentCompany.employees.length >= usersCanHAndle) {
        throw new HttpException(
          'Yo can have no more than 1 Employee change sub plan',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
    }
    if (
      currentCompany.employees.find((e) => e.email == employee.email) ||
      currentCompany.email == employee.email
    ) {
      throw new ConflictException(
        'User with This email already registered in This Company',
      );
    }
    const created = await this.employeeService.create(employee, plainCompany);

    await userActivationEmail(employee.email, employee.email, company.email);
    await userActivationEmail(
      employee.email,
      'nameagasi@gmail.com',
      company.email,
    );
    return new SucessResponse('Creted Check email', created);
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
      relations: {
        subscription: true,
        files: true,
        employees: true,
        curr_subscription: true,
      },
    });
  }

  async update(updateCompanyDto: UpdateCompanyDto, currCompany: ICompanyDb) {
    const company = await this.findOne(currCompany.id);
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
    return await this.findOne(currCompany.id);
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
  async remove(employeeId: string, company: Company) {
    const currCompany = await this.companyRepository.findOne({
      where: { email: company.email },
      relations: { employees: true },
    });

    if (currCompany && currCompany.employees) {
      const isMyEmployee = currCompany.employees.find(
        (e) => e.id == employeeId,
      );

      try {
        if (isMyEmployee) {
          await this.employeeService.remove(employeeId);
        } else {
          throw new NotFoundException('User not from your company');
        }
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    }
  }
  async employeeFiles(employee: Employee) {
    const user = await this.employeeDb.findOne({
      where: { id: employee.id },
      relations: { company: true },
    });
    if (!user || !user.company) {
      throw new NotFoundException('User not found');
    }

    const companyAllFiles = await this.findCompanyAllFiles(user.company[0].id);
    const files = companyAllFiles.files;
    if (!files || !files.length) {
      throw new NotFoundException('No files found');
      return [];
    }
    // console.log(companyAllFiles);

    const mustBeReturn = files.filter((file) => {
      const idies = file.access[0].split(',');

      if (file.access[0] == 'all') {
        return file;
      }
      if (idies.includes(user.id.toString())) {
        return file;
      }
      if (file.employee && file.employee.id == user.id.toString()) {
        return file;
      }
    });

    return new SucessResponse('Company files for Employee', mustBeReturn);
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
