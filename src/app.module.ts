import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './app.config';
@Module({
  imports: [
    CompanyModule,
    TypeOrmModule.forRoot({
      ...configService.getTypeOrmConfig(),
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
