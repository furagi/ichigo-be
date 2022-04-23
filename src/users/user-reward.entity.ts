import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Reward } from './reward.entity';
import { User } from './user.entity';

@Entity()
export class UserReward {
  @PrimaryColumn('uuid', { name: 'userUuid' })
  private userRef: string;

  @PrimaryColumn('uuid', { name: 'rewardUuid' })
  private rewardRef: string;

  @ManyToOne(() => Reward, (reward) => reward.userRewards)
  @JoinColumn({ name: 'rewardUuid', referencedColumnName: 'uuid' })
  reward: Reward;

  @ManyToOne(() => User, (user) => user.userRewards)
  @JoinColumn({ name: 'userUuid', referencedColumnName: 'uuid' })
  user: User;

  @Column()
  redeemedAt: string;
}
