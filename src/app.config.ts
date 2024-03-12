import { DataSourceOptions, createConnection } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from './constants';
import {
  ISubscriptionDB,
  Subscription,
} from './subscription/entities/subscription.entity';
import { File } from './employee/entities/file.entyty';

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: 'postgres',
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../**/*.entity.js', File, Subscription],
};
export async function runApplication() {
  try {
    const connection = await createConnection(connectionOptions);
    const subcribeRepository = connection.getRepository(Subscription);

    // Create and save users
    const subscribtions = await subcribeRepository.find();
    if (subscribtions.length) return;
    const usersToInsert: Array<Omit<ISubscriptionDB, 'id'>> = [
      {
        name: 'Free',
        price: 0,
        files_amount: 10,
        users_amount: 1,
        exceeded_amount_price: 0,
      },
      {
        name: 'Basic',
        price: 5,
        files_amount: 100,
        users_amount: 10,
        exceeded_amount_price: 0,
      },
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
