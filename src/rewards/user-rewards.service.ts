import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './reward.entity';
import { UserReward } from './user-reward.entity';
import { User } from './user.entity';

@Injectable()
export class UserRewardsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserReward)
    private readonly userRewardsRepository: Repository<UserReward>,
    @InjectRepository(Reward)
    private readonly rewardsRepository: Repository<Reward>,
  ) {}

  async getUserRewards(userId: number) {
    let user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      user = this.usersRepository.create({
        id: userId,
        name: `Name_${userId}`,
      });
    }

    return this.rewardsRepository
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.userRewards', 'userRewards')
      .where('userRewards.userId = :userId', { userId: user.id })
      .printSql()
      .getMany();
  }
}
