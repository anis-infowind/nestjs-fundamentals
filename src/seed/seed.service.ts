import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedMongoData } from '../db/seeds/seed-mongo';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Artist, ArtistDocument } from 'src/artists/schemas/artist.schema';
import { Model } from 'mongoose';
import { Playlist, PlaylistDocument } from 'src/playlists/schemas/playlist.schema';
import { Song, SongDocument } from 'src/songs/schemas/song.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>,

    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<PlaylistDocument>,

    @InjectModel(Song.name)
    private readonly songModel: Model<SongDocument>
  ) {}

  async seedMongoDB(): Promise<void> {
    try {
      await seedMongoData(this.userModel, this.artistModel, this.playlistModel, this.songModel);
      console.log('🌱 Seeding completed.');
    } catch (err) {
      console.error('❌ Error during database seeding:', err);
    }
  }
}