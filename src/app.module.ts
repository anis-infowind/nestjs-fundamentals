import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/dev-config-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/entities/song.entity';
import { User } from './users/entities/user.entity';
import { Artist } from './artists/entities/artist.entity';
import { PlayListsModule } from './playlists/playlists.module';
import { Playlist } from './playlists/entities/playlist.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions, typeOrmAsyncConfig } from './db/data-source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { validate } from './config/validation';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoDBConfig } from './db/mongodb-config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AllExceptionsFilter } from './common/exception/all-exceptions.filter';
import { EventsModule } from './events/events.module';

const devConfig = { port: 3000 };
const proConfig = { port: 4000 };

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
    // Mongodb Connection
    MongooseModule.forRootAsync(mongoDBConfig),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    // Postgres Connection
    //TypeOrmModule.forRootAsync(typeOrmAsyncConfig), // Database Migration
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   database: 'spotify-clone',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'root',
    //   password: 'Iamlama/6/',
    //   entities: [Song, User, Artist, Playlist],
    //   synchronize: true,
    // }),
    // Mysql Connection
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'Iamlama/6/',
    //   database: 'spotify-clone',
    //   entities: [Song, User, Artist, Playlist],
    //   synchronize: true, // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
    // }),
    SongsModule,
    PlayListsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
    MyLoggerModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: DevConfigService,
      useClass: DevConfigService,
    },
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig : proConfig;
      },
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(LoggerMiddleware).forRoutes('songs'); // option no 1
    // consumer
    // .apply(LoggerMiddleware)
    // .forRoutes({ path: 'songs', method: RequestMethod.POST }); //option no 2

    consumer.apply(LoggerMiddleware).forRoutes(SongsController); //option no 3
  }
}
