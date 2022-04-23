import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserReward } from './user-reward.entity';

/**
 * In real world scenario I wouldn't create User entity (so users should be stored in another service)
 * But I think create two services for a so small task is way too much, so.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column()
  name: string;

  @OneToMany(() => UserReward, (userReward) => userReward.user)
  userRewards: UserReward[];
}
