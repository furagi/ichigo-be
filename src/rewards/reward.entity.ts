import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserReward } from './user-reward.entity';

@Entity({ name: 'rewards' })
export class Reward {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column({ name: 'available_at', unique: true })
  availableAt: string;

  @Column({ name: 'expires_at', unique: true })
  expiresAt: string;

  @OneToMany(() => UserReward, (userReward) => userReward.reward)
  userRewards: UserReward[];
}
