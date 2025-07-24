import { Module } from '@nestjs/common';
import { PlayListsController } from './playlists.controller';
import { PlayListsService } from './playlists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from 'src/songs/schemas/song.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Playlist, PlaylistSchema } from './schemas/playlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Song.name, schema: SongSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PlayListsController],
  providers: [PlayListsService],
})
export class PlayListsModule {}