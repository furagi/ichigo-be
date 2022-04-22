import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'users';

export class CreateUsersTable1650640604713 implements MigrationInterface {
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
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true, true, true);
    return queryRunner.query(`DROP EXTENSION "uuid-ossp"`);
  }
}
