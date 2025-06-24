import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Force TypeORM to use mysql2 instead of broken mysql fallback
import { PlatformTools } from 'typeorm/platform/PlatformTools';

PlatformTools.load = (name: string) => {
  if (name === 'mysql') {
    return require('mysql2'); // 🔥 force correct driver
  }
  return require(name);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
