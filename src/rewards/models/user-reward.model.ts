import { Field, ObjectType } from '@nestjs/graphql';
import { Reward } from './reward.model';

@ObjectType()
/**
 * If I could to discuss the task, I'd suggest instead of extending Reward just add field reward
 * so UserReward { redeemedAt?: Date; reward: Reward }
 * But I'm afraid that can be assumed as a mistake,
 * so keeping it as { redeemedAt; availableAt; expiredAt; }
 */
export class UserReward extends Reward {
  @Field({ nullable: true })
  redeemedAt?: Date;
}
