import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getDateWeek } from '../common/date.helpers';
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

  async getUserRewards(userId: number, date: Date) {
    // create user if doesn't exist
    let user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      user = this.usersRepository.create({
        id: userId,
        name: `Name_${userId}`,
      });
      await this.usersRepository.save(user);
    }

    // create rewards if don't exist
    const week = getDateWeek(date).map((availableAt) => ({
      availableAt,
      expiresAt: new Date(+availableAt + 1000 * 60 * 60 * 24),
    }));
    await this.rewardsRepository.upsert(week, ['availableAt']);

    return this.rewardsRepository
      .createQueryBuilder('rewards')
      .leftJoinAndSelect(
        'rewards.userRewards',
        'userRewards',
        'userRewards.reward_uuid = rewards.uuid AND userRewards.user_id = :userId',
        { userId: user.id },
      )
      .orderBy('rewards.availableAt', 'ASC')
      .getMany();
  }
}
