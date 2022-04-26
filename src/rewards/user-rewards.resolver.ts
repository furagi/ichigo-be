import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { pick } from '../common/pick.helpers';
import { UserReward } from './models/user-reward.model';
import { RewardsService } from './rewards.service';
import { UserRewardsService } from './user-rewards.service';
import { UsersService } from './users.service';

@Resolver(() => UserReward)
export class UserRewardsResolver {
  constructor(
    private userRewardsService: UserRewardsService,
    private usersService: UsersService,
    private rewardsService: RewardsService,
  ) {}

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
    @Args('date', { nullable: true }) date: Date,
  ) {
    console.log(`resolve user rewards for user ${userId} and date ${date}`);
    const userRewards = await this.userRewardsService.getUserRewards(
      userId,
      date,
    );
    return userRewards.map((reward) => ({
      ...pick(reward, ['expiresAt', 'availableAt']),
      redeemedAt: reward.userRewards[0]?.redeemedAt || null,
    }));
  }

  @Mutation(() => UserReward)
  async redeemReward(
    @Args('date') date: Date,
    @Args('userId', { type: () => ID }) userId: number,
  ) {
    const redeemedAt = new Date();
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const reward = await this.rewardsService.getRewardByDate(date);
    if (!reward) {
      throw new NotFoundException(`Reward for date ${date} not found`);
    }
    if (reward.expiresAt <= redeemedAt) {
      throw new BadRequestException(
        `Reward for date ${date} has already expired`,
      );
    }
    const userReward = await this.userRewardsService.redeemReward(
      user,
      reward,
      redeemedAt,
    );
    return {
      redeemedAt: userReward.redeemedAt,
      ...pick(reward, ['expiresAt', 'availableAt']),
    } as UserReward;
  }
}
