import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './schemas/song.schema';
import { Artist, ArtistSchema } from 'src/artists/schemas/artist.schema';

const mockSongsService = {
  findAll() {
    return [{ id: 1, title: 'Lasting lover', artists: ['Siagla'] }];
  },
};
@Module({
  imports: [
    //TypeOrmModule.forFeature([Song, Artist]),
    MongooseModule.forFeature([
      { name: Song.name, schema: SongSchema },
      { name: Artist.name, schema: ArtistSchema },
    ]),
  ],
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
