import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Reward } from './reward.entity';
import { User } from './user.entity';

@Entity({ name: 'users_rewards' })
export class UserReward {
  @PrimaryColumn('int', { name: 'user_id' })
  private userRef: number;

  @PrimaryColumn('uuid', { name: 'reward_uuid' })
  private rewardRef: string;

  @ManyToOne(() => Reward, (reward) => reward.userRewards)
  @JoinColumn({ name: 'reward_uuid', referencedColumnName: 'uuid' })
  reward: Reward;

  @ManyToOne(() => User, (user) => user.userRewards)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'redeemed_at' })
  redeemedAt: string;
}
