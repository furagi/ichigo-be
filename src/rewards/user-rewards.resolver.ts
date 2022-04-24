import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserReward } from './models/user-reward.model';
import { UserRewardsService } from './user-rewards.service';

@Resolver(() => UserReward)
export class UserRewardsResolver {
  constructor(private userRewardsService: UserRewardsService) {}

  /**
   * the task doesn't describe whether I should to implement query or mutation for
   * GraqhQL analogue of GET /users/:userId/rewards
   * And at a first glance it seems I should use Mutation here, because we actually mutate data (if missed)
   * However, I think that the mutation logic is required only for make
   * testing easier (and that's why request mehtod is GET instead of POST)
   */
  @Query(() => [UserReward], { name: 'userRewards' })
  async getUserRewards(
    @Args('userId', { type: () => ID }) userId: number,
    @Args('date', { nullable: true }) date?: Date,
  ) {
    console.log(`resolve user rewards for user ${userId} and date ${date}`);
    const userRewards = await this.userRewardsService.getUserRewards(userId);
    console.log(userRewards);
    return userRewards.map((reward) => ({
      ...reward,
      redeemedAt: reward.userRewards[0]?.redeemedAt || null,
    }));
  }

  @Mutation(() => UserReward)
  async redeemReward(
    @Args('date') date: Date,
    @Args('userId', { type: () => ID }) userId: number,
  ) {
    console.log(`User ${userId} redeemed reward ${date}`);
    return {
      availableAt: date,
      redeemedAt: new Date(),
      expiresAt: new Date(),
    };
  }
}
