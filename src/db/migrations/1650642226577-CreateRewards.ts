import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'rewards';

export class CreateRewards1650642226577 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'available_at',
            type: 'date',
            default: 'now()',
            isUnique: true,
          },
          {
            name: 'expires_at',
            type: 'date',
            default: `now() + INTERVAL '7 DAY'`,
            isUnique: true,
          },
        ],
        indices: [
          {
            name: 'IDX_START_END_DATE',
            columnNames: ['available_at', 'expires_at'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropTable(tableName, true, true, true);
    return queryRunner.query(`DROP EXTENSION "uuid-ossp"`);
  }
}
