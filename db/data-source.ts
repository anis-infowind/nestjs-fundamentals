import { DataSource, DataSourceOptions } from 'typeorm';

// Force TypeORM to use mysql2 instead of broken mysql fallback
// import { PlatformTools } from 'typeorm/platform/PlatformTools';

// PlatformTools.load = (name: string) => {
//   if (name === 'mysql') {
//     return require('mysql2'); // 🔥 force correct driver
//   }
//   return require(name);
// };

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres', // mysql
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'Iamlama/6/',
  database: 'spotify-clone',
  entities: ['dist/**/*.entity.js'], //1
  synchronize: false, // 2
  migrations: ['dist/db/migrations/*.js'], // 3
};

const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;