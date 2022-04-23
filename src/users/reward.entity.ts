import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserReward } from './user-reward.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column({ unique: true })
  availableAt: string;

  @Column({ unique: true })
  expiresAt: string;

  @OneToMany(() => UserReward, (userReward) => userReward.reward)
  userRewards: UserReward[];
}
