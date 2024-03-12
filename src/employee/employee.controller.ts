import { Controller, Get, Body, Patch, Param, Render } from '@nestjs/common';
import { EmployeeService } from './employee.service';

import { SkipJwtAuth } from 'src/decorators/skip.decorator';
import { HOST, PORT } from 'src/constants';
import { ActivateEmployeeDto } from './dto/activate-emplotee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  //   @Post()
  //   create(@Body() createEmployeeDto: CreateEmployeeDto) {
  //     return this.employeeService.create(createEmployeeDto);
  //   }

  //   @Get()
  //   findAll() {
  //     return this.employeeService.findAll();
  //   }
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

  @Patch()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
  //     return this.employeeService.update(+id, updateEmployeeDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.employeeService.remove(+id);
}
