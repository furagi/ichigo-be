import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from 'src/common/scalars/date.scalar';
import { Reward } from './reward.entity';
import { UserReward } from './user-reward.entity';
import { User } from './user.entity';
import { UserRewardsResolver } from './user-rewards.resolver';
import { UserRewardsService } from './user-rewards.service';
import { UsersService } from './users.service';
import { RewardsService } from './rewards.service';

@Module({
  providers: [
    UserRewardsResolver,
    DateScalar,
    UserRewardsService,
    UsersService,
    RewardsService,
  ],
  imports: [TypeOrmModule.forFeature([User, Reward, UserReward])],
})
export class RewardsModule {}
