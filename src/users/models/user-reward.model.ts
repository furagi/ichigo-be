import { ObjectType } from '@nestjs/graphql';
import { Reward } from './reward.model';

@ObjectType()
export class UserReward extends Reward {
  redeemedAt?: Date;
}
