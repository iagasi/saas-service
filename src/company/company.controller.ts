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
  //
  @Post('/employee')
  createUser(
    @Body() createUserDto: CreateEmployeeDto,
    @AdminOnly() company: ICompanyDb,
  ) {
    return this.companyService.createEmployee(createUserDto, company);
  }

  @Patch('/subscribe/:id')
  updateSubscriptions(
    @Param('id') id: ICompanyDb['subscription'],
    @AdminOnly() company: ICompanyDb,
  ) {
    return this.companyService.updateSubscription(company, id);
  }
  @Get('/subscribe')
  getSubscription(@AdminOnly() company: ICompanyDb) {
    return this.companyService.getSubscription(company);
  }
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companyService.findOne(id);
    console.log(company);

    if (!company) {
      throw new NotFoundException('Company with id  ' + id + '  NOT found');
    }
    return company;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @AdminOnly() company: ICompanyDb,
  ) {
    return this.companyService.update(id, updateCompanyDto, company);
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
