import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from './reward.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardsRepository: Repository<Reward>,
  ) {}

  async getRewardByDate(date: Date) {
    return this.rewardsRepository.findOneBy({ availableAt: date });
  }
}
