import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserReward } from './user-reward.model';

@ObjectType()
export class User {
  @Field(() => ID)
  uuid: string;

  rewards: UserReward[];
}
