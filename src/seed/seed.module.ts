import { Module } from "@nestjs/common";
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Artist, ArtistSchema } from 'src/artists/schemas/artist.schema';
import { Playlist, PlaylistSchema } from 'src/playlists/schemas/playlist.schema';
import { Song, SongSchema } from "src/songs/schemas/song.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Artist.name, schema: ArtistSchema },
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Song.name, schema: SongSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}