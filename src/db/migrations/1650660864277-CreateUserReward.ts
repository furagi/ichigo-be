import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

const tableName = 'users_rewards';

export class CreateUserReward1650660864277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'redeemed_at',
            type: 'date',
            default: 'now()',
            isUnique: true,
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'reward_uuid',
            type: 'uuid',
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: ['reward_uuid'],
        referencedColumnNames: ['uuid'],
        referencedTableName: 'rewards',
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createPrimaryKey(tableName, ['user_id', 'reward_uuid']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropTable(tableName);
  }
}
