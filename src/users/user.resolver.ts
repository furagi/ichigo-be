import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserReward } from './models/user-reward.model';
import { User } from './models/user.model';

@Resolver(() => User)
export class UsersResolver {
  @Query(() => User, { name: 'user' })
  async getUser(@Args('uuid', { type: () => ID }) uuid: string) {
    return { uuid: `test_uuid_${uuid}` };
  }

  @ResolveField('rewards', () => [UserReward])
  async getUserRewards(
    @Parent() user: User,
    @Args('date', { nullable: true }) date?: Date,
  ) {
    const { uuid } = user;
    console.log(`resolve user ${uuid} rewards for date ${date}`);
    return [];
  }

  @Mutation(() => UserReward)
  async redeemReward(
    @Args('date') date: Date,
    @Args('userUuid', { type: () => ID }) uuid: string,
  ) {
    console.log(`User ${uuid} redeemed reward ${date}`);
    return {
      availableAt: date,
      redeemedAt: new Date(),
      expiresAt: new Date(),
    };
  }
}
