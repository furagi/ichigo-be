import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

export const mockTypeOrm = (entities: EntityClassOrSchema[]) => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    entities: entities,
    logging: true,
  }),
  TypeOrmModule.forFeature(entities),
];

export async function wipeDb(
  module: TestingModule,
  entities: EntityClassOrSchema[],
) {
  for (const entity of entities) {
    const repository = await module.get<Repository<EntityClassOrSchema>>(
      getRepositoryToken(entity),
    );
    await repository.clear();
  }
}
