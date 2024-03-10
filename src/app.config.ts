// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { log } from 'console';
// import { join } from 'path';

import { DataSource, DataSourceOptions, createConnection } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from './constants';
import { Subscription } from './company/entities/subscription.entity';
import { subscribe } from 'diagnostics_channel';

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// require('dotenv').config();

// class ConfigService {
//   getValue(name: string) {
//     const value = process.env[name];
//     if (!value) {
//       console.log('error nor found' + name);
//     }
//     return value;
//   }
//   public getTypeOrmConfig(): TypeOrmModuleOptions {
//     return {
//       type: 'postgres',

//       host: this.getValue('PG_HOST'),
//       port: parseInt(this.getValue('PG_PORT')),
//       username: this.getValue('PG_USER'),
//       password: this.getValue('PG_PASSWORD'),
//       database: this.getValue('PG_DATABASE'),

//       entities: [__dirname + '/../**/*.entity.js'],

//       migrationsTableName: 'migration',

//       migrations: ['src/migration/*.ts'],
//       synchronize: true,

//       //   cli: {
//       //     migrationsDir: 'src/migration',
//       //   },

//       //   ssl: this.isProduction(),
//     };
//   }
// }
// const configService = new ConfigService();
// export { configService };
// import { DataSource, DataSourceOptions } from 'typeorm';
// export const dbdatasource: DataSourceOptions = {
//   // TypeORM PostgreSQL DB Drivers
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: '12362847',
//   // Database name
//   database: 'task',
//   // Synchronize database schema with entities
//   synchronize: false,
//   // TypeORM Entity
//   entities: ['build/task/task.entity.js'],
//   // Your Migration path
//   migrations: ['build/task/migrations/*.js'],
//   migrationsTableName: 'task_migrations',
// };

// const dataSource = new DataSource(dbdatasource);
// export default dataSource;
export const connectionOptions: DataSourceOptions = {
  // Add your TypeORM connection options here
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: 'postgres',
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../**/*.entity.js'],
};
export async function runApplication() {
  try {
    const connection = await createConnection(connectionOptions);
    const subcribeRepository = connection.getRepository(Subscription);

    // Create and save users
    const subscribtions = await subcribeRepository.find();
    if (subscribtions.length) return;
    const usersToInsert = [
      { name: 'Free', price: 0, files_amount: 10, users_amount: 1 },
      { name: 'Basic', price: 5, files_amount: 100, users_amount: 10 },
      {
        name: 'Premium',
        price: 300,
        files_amount: 100,
        users_amount: 1000,
        exceeded_amount_price: 0.5,
      },
    ];

    await subcribeRepository.save(usersToInsert);
    await connection.close();
  } catch (error) {
    console.error('Error during application startup:', error);
  }
}
runApplication();
