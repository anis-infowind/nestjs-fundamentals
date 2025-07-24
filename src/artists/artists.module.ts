import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';

@Module({
  imports: [
    //TypeOrmModule.forFeature([Artist]),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
    ]),
  ],
  providers: [ArtistsService],
  exports: [ArtistsService],
  controllers: [ArtistsController],
})
export class ArtistsModule {}
