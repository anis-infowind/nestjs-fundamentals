import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}`,
  ),
});
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";

// Force TypeORM to use mysql2 instead of broken mysql fallback
// import { PlatformTools } from 'typeorm/platform/PlatformTools';

// PlatformTools.load = (name: string) => {
//   if (name === 'mysql') {
//     return require('mysql2'); // 🔥 force correct driver
//   }
//   return require(name);
// };

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
  configService: ConfigService
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: configService.get<'mysql' | 'postgres' | 'sqlite' | 'mongodb'>("database.connection") || 'postgres',
      host: configService.get<string>("database.host"),
      port: configService.get<number>("database.port"),
      username: configService.get<string>("database.username"),
      password: configService.get<string>("database.password"),
      database: configService.get<string>("database.dbName"),
      entities: ["dist/**/*.entity.js"],
      synchronize: false,
      autoLoadEntities: true,
      migrations: ["dist/db/migrations/*.js"],
    };
  },
};

export const dataSourceOptions: DataSourceOptions = {
  type: (process.env.DB_CONNECTION as DataSourceOptions['type']) || 'postgres', // mysql
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'], //1
  synchronize: false, // 2
  autoLoadEntities: true,
  migrations: ['db/migrations/*.ts'], // 3
} as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;