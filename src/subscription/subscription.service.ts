import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { ILike, Repository } from 'typeorm';
import { fillSubscriptions } from 'src/app.config';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscribDb: Repository<Subscription>,
  ) {}

  async findAll() {
    await fillSubscriptions(this.subscribDb);

    return await this.subscribDb.find();
  }

  async findByName(name: string) {
    await fillSubscriptions(this.subscribDb);
    const subscr = await this.subscribDb.findOne({
      where: { name: ILike(name) },
    });

    return subscr;
  }
}
