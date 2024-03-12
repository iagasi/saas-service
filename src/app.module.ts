import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './app.config';
import { EmployeeModule } from './employee/employee.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    CompanyModule,
    TypeOrmModule.forRoot({
      ...connectionOptions,
      autoLoadEntities: true,
    }),
    EmployeeModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
