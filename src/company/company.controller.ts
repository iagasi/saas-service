import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  NotFoundException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { HOST, PORT } from 'src/constants';
import { LoginDto } from 'src/dto/login.dto';
import { SkipJwtAuth } from 'src/decorators/skip.decorator';
import { ICompanyDb } from 'src/interfaces/company';
import { AdminOnly } from 'src/decorators/admin.dcorator';
import { CreateEmployeeDto } from 'src/employee/dto/create-employee.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { Employee } from 'src/employee/entities/employee.entity';
import { Company } from './entities/company.entity';
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @SkipJwtAuth()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Post('/login')
  @SkipJwtAuth()
  login(@Body() createCompanyDto: LoginDto) {
    return this.companyService.login(createCompanyDto);
  }

  @Post('/employee')
  createUser(
    @Body() createUserDto: CreateEmployeeDto,
    @AdminOnly() company: ICompanyDb,
  ) {
    return this.companyService.createEmployee(createUserDto, company);
  }
  @Get('/for-employee-files/')
  employeeFiles(@CurrentUser() employee: Employee) {
    return this.companyService.employeeFiles(employee);
  }
  @Patch()
  update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @AdminOnly() company: ICompanyDb,
  ) {
    return this.companyService.update(updateCompanyDto, company);
  }
  @Patch('/subscribe/:id')
  updateSubscriptions(
    @Param('id') id: ICompanyDb['subscription'],
    @AdminOnly() company: ICompanyDb,
  ) {
    return this.companyService.updateSubscription(company, id);
  }

  @Get('/files')
  getAllFiles(@AdminOnly() company: ICompanyDb) {
    return this.companyService.findCompanyAllFiles(company.id);
  }
  @Get('/subscribe')
  getSubscription(@AdminOnly() company: ICompanyDb) {
    return this.companyService.getSubscription(company);
  }
  @Get('/all')
  findAll() {
    return this.companyService.findAll();
  }

  @Get()
  async findOne(@Param('id') id: string) {
    const company = await this.companyService.findOne(id);

    if (!company) {
      throw new NotFoundException('Company with id  ' + id + '  NOT found');
    }
    return company;
  }

  @Get('activate/:email')
  @SkipJwtAuth()
  @Render('index')
  activatePage(@Param('email') email: string) {
    return {
      description: 'Company Activation ',
      email: email,
      url: `http://${HOST}:${PORT}/company/activate/${email}`,
    };
  }
  @Patch('activate/:email')
  @SkipJwtAuth()
  activate(@Param('email') email: string) {
    return this.companyService.activate(email);
  }
  @Delete('employee/:id')
  remove(@Param('id') id: string, @AdminOnly() company: Company) {
    return this.companyService.remove(id, company);
  }
}
