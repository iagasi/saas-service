import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { JwtStrategy } from 'src/utils/jwt/jwt.strategy';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { File } from 'src/employee/entities/file.entyty';
import { Subscription } from 'src/subscription/entities/subscription.entity';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyService,
    JwtStrategy,
    EmployeeService,
    SubscriptionService,
  ],
  imports: [TypeOrmModule.forFeature([Company, Employee, Subscription, File])],
})
export class CompanyModule {}
