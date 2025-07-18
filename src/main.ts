import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Force TypeORM to use mysql2 instead of broken mysql fallback
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

PlatformTools.load = (name: string) => {
  if (name === 'mysql') {
    return require('mysql2'); // 🔥 force correct driver
  }
  if (name === 'pg') {
    return require('pg'); // 🔥 force correct driver
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

  ///......
  //Configure the swagger module here
  const config = new DocumentBuilder() //1
  .setTitle("Spotify Clone")
  .setDescription("The Spotify Clone Api documentation")
  .setVersion("1.0")
  .build();
  const document = SwaggerModule.createDocument(app, config); //2
  SwaggerModule.setup("api-documentation", app, document); //3

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port') ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
void bootstrap();
