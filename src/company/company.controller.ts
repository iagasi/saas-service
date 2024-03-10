import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { HOST, PORT } from 'src/constants';
import { LoginDto } from 'src/dto/login.dto';
import { SkipJwtAuth } from 'src/decorators/skip.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ICompanyDb } from 'src/interfaces/company';
import { AdminOnly } from 'src/decorators/admin.dcorator';
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
  @Post('/user')
  createUser(
    @Body() createUserDto: CreateUserDto,

    @AdminOnly() company: ICompanyDb,
  ) {
    return this.companyService.createUser(createUserDto, company);
  }
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Get('activate/:email')
  @Render('index')
  activatePage(@Param('email') email: string) {
    return {
      description: 'Company Activation ',
      email: email,
      url: `http://${HOST}:${PORT}/company/activate/${email}`,
    };
  }
  @Patch('activate/:email')
  activate(@Param('email') email: string) {
    return this.companyService.activate(email);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
