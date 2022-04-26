import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
import { mockTypeOrm, wipeDb } from '../../test/db.helpers';
import { Reward } from './reward.entity';
import { UserReward } from './user-reward.entity';
import { UserRewardsResolver } from './user-rewards.resolver';
import { UserRewardsService } from './user-rewards.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RewardsService } from './rewards.service';

async function createTodayReward(rewardsRepository: Repository<Reward>) {
  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const availableAt = new Date(now - (now % day));
  const expiresAt = new Date(+availableAt + day);
  const reward = rewardsRepository.create({
    availableAt,
    expiresAt,
  });
  await rewardsRepository.insert(reward);

  return reward;
}

/**
 * If I cover services and resolvers with unit tests
 * the result actually will dictate how exactly everything shoul be implented
 * (because of mocking)
 * So writing kind of e2e tests for the resolver seems more correct as for me
 * And yep, it takes less time
 */
describe('UserRewardsResolver', () => {
  let resolver: UserRewardsResolver;
  let usersRepository: Repository<User>;
  let rewardsRepository: Repository<Reward>;
  let userRewardsRepository: Repository<UserReward>;

  let module: TestingModule;

  beforeEach(async () => {
    const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
    const USER_REWARD_REPOSITORY_TOKEN = getRepositoryToken(UserReward);
    const REWARD_REPOSITORY_TOKEN = getRepositoryToken(Reward);
    module = await Test.createTestingModule({
      imports: [...mockTypeOrm([User, Reward, UserReward])],
      providers: [
        UserRewardsService,
        UserRewardsResolver,
        DateScalar,
        UsersService,
        RewardsService,
      ],
    }).compile();

    resolver = module.get<UserRewardsResolver>(UserRewardsResolver);
    usersRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    userRewardsRepository = module.get<Repository<UserReward>>(
      USER_REWARD_REPOSITORY_TOKEN,
    );
    rewardsRepository = module.get<Repository<Reward>>(REWARD_REPOSITORY_TOKEN);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await wipeDb(module, [UserReward, User, Reward]);
    await module.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('#getUserRewards(userId: int, date: Date)', () => {
    it('should be defined', () => {
      expect(resolver.getUserRewards).toBeDefined();
    });

    it(`should create a user with passed user ID if not exists`, async () => {
      const userId = 2;
      await resolver.getUserRewards(userId, new Date());
      const users = await usersRepository.find();
      expect(users.length).toBe(1);
      expect(users[0].id).toBe(userId);
    });

    it(`shouldn't create a user if exists`, async () => {
      const userId = 3;
      const user = usersRepository.create({
        id: userId,
        name: `Name_${userId}`,
      });
      await usersRepository.save(user);
      await resolver.getUserRewards(userId, new Date());
      const users = await usersRepository.find();
      expect(users.length).toBe(1);
      expect(users[0]).toEqual(user);
    });

    it(`should create rewards for date week but only for missed in DB dates`, async () => {
      const userId = 3;
      /**
       * for this date first availableAt is 2020-03-15
       * and last expiresAt is 2020-03-22
       */
      const date = new Date('2020-03-19T12:00:00');
      await rewardsRepository.insert([
        { availableAt: '2020-03-15', expiresAt: '2020-03-16' },
        { availableAt: '2020-03-16', expiresAt: '2020-03-17' },
        { availableAt: '2020-03-17', expiresAt: '2020-03-18' },
      ]);
      await resolver.getUserRewards(userId, date);
      const rewards = await rewardsRepository.find();
      expect(rewards.length).toBe(7);
      for (const [i, reward] of rewards.entries()) {
        expect(reward.availableAt).toEqual(new Date(`2020-03-${15 + i}`));
        expect(reward.expiresAt).toEqual(new Date(`2020-03-${15 + i + 1}`));
      }
    });

    it('should return user rewards for week of passed date', async () => {
      const userId = 3;
      /**
       * for this date first availableAt is 2020-03-15
       * and last expiresAt is 2020-03-22
       */
      const date = new Date('2020-03-19T12:00:00');
      const user = await usersRepository.create({
        id: userId,
        name: `Name_${userId}`,
      });
      await usersRepository.save(user);
      const rewards = await rewardsRepository.save(
        [
          { availableAt: '2020-03-15', expiresAt: '2020-03-16' },
          { availableAt: '2020-03-17', expiresAt: '2020-03-18' },
        ].map((reward) => rewardsRepository.create(reward)),
      );
      await userRewardsRepository.save(
        rewards.map((reward) =>
          userRewardsRepository.create({
            user,
            reward,
            redeemedAt: new Date(8000 + +new Date(reward.availableAt)),
          }),
        ),
      );

      const expected = [];
      /**
       * dates from 15 to 22 (last availableAt is 03.21, last expiresAt is 03.22)
       * reedemedAt is null for all dates except 03.15T00:00:08 and 03.17 same time
       */
      for (let i = 0; i < 7; i++) {
        expected.push({
          availableAt: new Date(`2020-03-${15 + i}T00:00:00Z`),
          expiresAt: new Date(`2020-03-${16 + i}T00:00:00Z`),
          redeemedAt:
            i === 0 || i === 2 ? new Date(`2020-03-${15 + i}T00:00:08Z`) : null,
        });
      }
      const result = await resolver.getUserRewards(userId, date);
      expect(result).toEqual(expected);
    });
  });

  describe('#redeemReward(date, userId)', () => {
    it('should be defined', () => {
      expect(resolver.redeemReward).toBeDefined();
    });

    it(`should throw NotFound error if passed user doesn't exist`, async () => {
      expect.assertions(1);
      const userId = 5;
      const { availableAt } = await createTodayReward(rewardsRepository);
      try {
        await resolver.redeemReward(availableAt, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it(`should throw NotFound error if the reward with the date doesn't exist`, async () => {
      expect.assertions(1);
      const userId = 5;
      const user = usersRepository.create({
        id: userId,
        name: `Name_${userId}`,
      });
      await usersRepository.save(user);
      try {
        await resolver.redeemReward(new Date(), 3);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it(`should throw BadRequest error if the reward expiresAt already passed`, async () => {
      expect.assertions(1);
      const userId = 5;
      const user = usersRepository.create({
        id: userId,
        name: `Name_${userId}`,
      });
      await usersRepository.save(user);
      const rewardDate = new Date('2020-03-15T00:00:00Z');
      await rewardsRepository.insert(
        rewardsRepository.create({
          availableAt: rewardDate,
          expiresAt: new Date('2020-03-16T00:00:00Z'),
        }),
      );
      try {
        await resolver.redeemReward(rewardDate, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });

    it(`otherwise it should redeem the reward`, async () => {
      const userId = 5;
      const { availableAt, expiresAt } = await createTodayReward(
        rewardsRepository,
      );
      const user = usersRepository.create({
        id: userId,
        name: `Name_${userId}`,
      });
      await usersRepository.save(user);
      const redeemedAt = new Date();
      const result = await resolver.redeemReward(availableAt, userId);
      const reward = await userRewardsRepository.findOneBy({
        user: {
          id: userId,
        },
        reward: {
          expiresAt: MoreThan(redeemedAt),
          availableAt: LessThanOrEqual(redeemedAt),
        },
      });
      expect(reward?.redeemedAt).toEqual(redeemedAt);
      expect(result.redeemedAt).toEqual(redeemedAt);
      expect(result.expiresAt).toEqual(expiresAt);
      expect(result.availableAt).toEqual(availableAt);
    });
  });
});
