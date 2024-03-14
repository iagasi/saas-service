import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Render,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';

import { SkipJwtAuth } from 'src/decorators/skip.decorator';
import { HOST, PORT } from 'src/constants';
import { ActivateEmployeeDto } from './dto/activate-emplotee.dto';
import { LoginEmployeeDto } from './dto/login.employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decorators/user.decorator';
import { IEmployeeDb } from 'src/interfaces/employee';
import { FileTypeValidationPipe } from 'src/utils/file.validator';
import { UploadFileDto } from './dto/upload.file.dto';
import { Employee } from './entities/employee.entity';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/login')
  @SkipJwtAuth()
  create(@Body() loginEmployeeDto: LoginEmployeeDto) {
    return this.employeeService.login(loginEmployeeDto);
  }

  @Get('activate/:email')
  @SkipJwtAuth()
  @Render('user')
  activateUser(@Param('email') email: string) {
    return {
      description: 'Employee Activation ',
      email: email,
      url: `http://${HOST}:${PORT}/employee/activate/${email}`,
    };
  }
  @Patch('activate/:email')
  @SkipJwtAuth()
  activate(
    @Param('email') email: string,
    @Body() activateDto: ActivateEmployeeDto,
  ) {
    console.log(activateDto);

    return this.employeeService.activate(email, activateDto);
  }
  @Get()
  find(@CurrentUser() employee: Employee) {
    return this.employeeService.findAll(employee);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }
  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(new FileTypeValidationPipe())
    file: Express.Multer.File,
    @CurrentUser() employee: IEmployeeDb,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    return this.employeeService.uploadFile(file, employee, uploadFileDto);
  }
}
