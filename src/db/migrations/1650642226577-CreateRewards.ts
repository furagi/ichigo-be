import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'rewards';

export class CreateRewards1650642226577 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            name: 'availableAt',
            type: 'date',
            default: 'now()',
            isUnique: true,
          },
          {
            name: 'expiresAt',
            type: 'date',
            default: `now() + INTERVAL '7 DAY'`,
            isUnique: true,
          },
        ],
        indices: [
          {
            name: 'IDX_START_END_DATE',
            columnNames: ['availableAt', 'expiresAt'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropTable(tableName, true, true, true);
  }
}
