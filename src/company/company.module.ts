import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { JwtStrategy } from 'src/utils/jwt/jwt.strategy';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, JwtStrategy],
  imports: [TypeOrmModule.forFeature([Company])],
})
export class CompanyModule {}
