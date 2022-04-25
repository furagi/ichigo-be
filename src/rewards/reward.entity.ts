import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserReward } from './user-reward.entity';

@Entity({ name: 'rewards' })
export class Reward {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column({ name: 'available_at', unique: true })
  availableAt: Date;

  @Column({ name: 'expires_at', unique: true })
  expiresAt: Date;

  @OneToMany(() => UserReward, (userReward) => userReward.reward)
  userRewards: UserReward[];
}
