import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Artist } from 'src/artists/entities/artist.entity';

const mockSongsService = {
  findAll() {
    return [{ id: 1, title: 'Lasting lover', artists: ['Siagla'] }];
  },
};
@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],
  providers: [
    SongsService, // option 1
    // {
    //   provide: SongsService, // option 2
    //   useClass: SongsService
    // },
    // {
    //   provide: SongsService, // option 3
    //   useValue: mockSongsService
    // },
    {
      provide: 'CONNECTION',
      useValue: connection
    }
  ],
})
export class SongsModule {}
