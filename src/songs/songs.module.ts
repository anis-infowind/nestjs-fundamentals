import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';

const mockSongsService = {
  findAll() {
    return [{ id: 1, title: 'Lasting lover', artists: ['Siagla'] }];
  },
};
@Module({
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
