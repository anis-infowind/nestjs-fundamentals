import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Force TypeORM to use mysql2 instead of broken mysql fallback
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';

PlatformTools.load = (name: string) => {
  if (name === 'mysql') {
    return require('mysql2'); // 🔥 force correct driver
  }
  return require(name);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * You can enable the seeding here
   */
  // const seedService = app.get(SeedService);
  // await seedService.seed();
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port') ?? 3000);
}
void bootstrap();
