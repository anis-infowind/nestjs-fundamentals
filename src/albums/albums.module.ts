import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './schemas/album.schema';
import { AlbumsResolver } from './albums.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Album.name, schema: AlbumSchema }
    ]),
  ],
  providers: [AlbumsService, AlbumsResolver],
})
export class AlbumsModule {}
