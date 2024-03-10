import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './app.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CompanyModule,
    TypeOrmModule.forRoot({
      ...connectionOptions,
      autoLoadEntities: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
