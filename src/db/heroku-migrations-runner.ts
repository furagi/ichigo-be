import { AppDataSource } from './datasource';

export default (async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
})();
