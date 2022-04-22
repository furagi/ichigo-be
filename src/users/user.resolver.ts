import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DateScalar } from 'src/common/scalars/date.scalar';
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
    @Args('date', { nullable: true }) date?: DateScalar,
  ) {
    const { uuid } = user;
    console.log(`resolve user ${uuid} rewards for date ${date}`);
    return [];
  }
}
