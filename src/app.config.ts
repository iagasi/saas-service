import { DataSourceOptions, Repository } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from './constants';
import {
  ISubscriptionDB,
  Subscription,
} from './subscription/entities/subscription.entity';
import { File } from './employee/entities/file.entyty';
import { Purchasedsubscription } from './subscription/entities/purchased-subscription.entity';
import { Company } from './company/entities/company.entity';
import { Employee } from './employee/entities/employee.entity';

export const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: 'postgres',
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  entities: [
    __dirname + '/../**/*.entity.js',
    File,
    Subscription,
    Purchasedsubscription,
    Company,
    Employee,
  ],
};

export async function fillSubscriptions(
  subcribeRepository: Repository<Subscription>,
) {
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
      files_amount: 1000,
      users_amount: null,
      exceeded_amount_price: 0.5,
    },
  ];

  await subcribeRepository.save(usersToInsert);
}
