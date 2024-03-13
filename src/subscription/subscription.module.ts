import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Purchasedsubscription } from './entities/purchased-subscription.entity';

@Module({
  controllers: [],
  providers: [SubscriptionService],
  imports: [TypeOrmModule.forFeature([Subscription, Purchasedsubscription])],
})
export class SubscriptionModule {}
