import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

const tableName = 'usersRewards';

export class CreateUserReward1650660864277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'redeemedAt',
            type: 'date',
            default: 'now()',
            isUnique: true,
          },
          {
            name: 'userUuid',
            type: 'uuid',
          },
          {
            name: 'rewardUuid',
            type: 'uuid',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: ['userUuid'],
        referencedColumnNames: ['uuid'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: ['rewardUuid'],
        referencedColumnNames: ['uuid'],
        referencedTableName: 'rewards',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createPrimaryKey(tableName, ['userUuid', 'rewardUuid']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropTable(tableName);
  }
}
