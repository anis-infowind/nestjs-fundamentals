import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Force TypeORM to use mysql2 instead of broken mysql fallback
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { SeedService } from './seed/seed.service';

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
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
