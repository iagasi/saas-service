import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { File } from './entities/file.entyty';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, SubscriptionService],
  imports: [TypeOrmModule.forFeature([Employee, Subscription, File])],
  // exports: [EmployeeService],
})
export class EmployeeModule {}
