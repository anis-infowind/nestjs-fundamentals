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
  app.enableCors();
  app.setGlobalPrefix('v1/api');
  /**
   * You can enable the seeding here
   */
  const seedService = app.get(SeedService);
  await seedService.seedMongoDB();

  ///......
  //Configure the swagger module here
  const config = new DocumentBuilder() //1
  .setTitle("Spotify Clone")
  .setDescription("The Spotify Clone Api documentation")
  .setVersion("1.0")
  .addBearerAuth(
    // Enable Bearer Auth here
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Enter JWT token",
      in: "header",
    },
    "JWT-auth" // We will use this Bearer Auth with the JWT-auth name on the controller function
  )
  .build();
  const document = SwaggerModule.createDocument(app, config); //2
  SwaggerModule.setup("api-docs", app, document); //3

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port') ?? 3000);
  console.log(configService.get<string>('NODE_ENV'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
void bootstrap();
