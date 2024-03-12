import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscribDb: Repository<Subscription>,
  ) {}
  create(createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action adds a new subscription';
  }

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  async findByName(name: string) {
    const subscr = await this.subscribDb.findOne({
      where: { name: ILike(name) },
    });

    return subscr;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
