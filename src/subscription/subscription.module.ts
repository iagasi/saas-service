import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';

@Module({
  controllers: [],
  providers: [SubscriptionService],
  imports: [TypeOrmModule.forFeature([Subscription])],
})
export class SubscriptionModule {}
