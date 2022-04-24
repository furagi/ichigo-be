import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const tableName = 'rewards';

export class RewardsExpiresAtDefault1650795893276
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.changeColumn(
      tableName,
      'expires_at',
      new TableColumn({
        name: 'expires_at',
        type: 'date',
        default: `now() + INTERVAL '1 DAY'`,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.changeColumn(
      tableName,
      'expires_at',
      new TableColumn({
        name: 'expires_at',
        type: 'date',
        default: `now() + INTERVAL '7 DAY'`,
        isUnique: true,
      }),
    );
  }
}
