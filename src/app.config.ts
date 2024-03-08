import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { log } from 'console';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  getValue(name: string) {
    const value = process.env[name];
    if (!value) {
      console.log('error nor found' + name);
    }
    return value;
  }
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('PG_HOST'),
      port: parseInt(this.getValue('PG_PORT')),
      username: this.getValue('PG_USER'),
      password: this.getValue('PG_PASSWORD'),
      database: this.getValue('PG_DATABASE'),

      entities: [__dirname + '/../**/*.entity.js'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],
      synchronize: true,

      //   cli: {
      //     migrationsDir: 'src/migration',
      //   },

      //   ssl: this.isProduction(),
    };
  }
}
const configService = new ConfigService();
export { configService };
