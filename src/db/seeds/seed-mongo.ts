import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ArtistDocument } from 'src/artists/schemas/artist.schema';
import { PlaylistDocument } from 'src/playlists/schemas/playlist.schema';
import { SongDocument } from 'src/songs/schemas/song.schema';

export const seedMongoData = async (
  userModel: Model<UserDocument>,
  artistModel: Model<ArtistDocument>,
  playlistModel: Model<PlaylistDocument>,
  songModel: Model<SongDocument>
): Promise<void> => {

  console.log('🌱 Starting MongoDB seed...');

  // Clean up existing data
  await Promise.all([
    userModel.deleteMany({}),
    artistModel.deleteMany({}),
    playlistModel.deleteMany({}),
    songModel.deleteMany({}),
  ]);

  for (let i = 0; i < 5; i++) {
    // Create user
    await seedUser();
  }

  console.log('✅ MongoDB seeding complete with Songs.');

  async function seedUser() {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('123456', salt);

    const user = await userModel.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password,
      apiKey: uuid4(),
    });
    console.log(`👤 Seeded user: ${user.email}`);

    // Create artist for this user
    await seedArtist(user);
  }

  async function seedArtist(user: UserDocument) {

    const artist = await artistModel.create({
      user: user._id,
      songs: []
    });
    console.log(`🎤 Seeded artist for user: ${user.email}`);

    // Create songs and link to artist
    const songIds: string[] = [];

    for (let j = 0; j < 3; j++) {
      const song = await songModel.create({
        title: faker.music.songName(),
        releasedDate: faker.date.past(),
        duration: faker.helpers.arrayElement(['03:15', '04:05', '02:45']),
        lyrics: faker.lorem.lines(2),
        artists: [artist._id],
      });

      console.log(`🎵 Seeded Song: ${song.title}`);

      songIds.push(song._id.toString());
      artist.songs.push(song._id); // Add song to artist's songs
    }

    await artist.save();
    
    // Create playlist with songs
    await seedPlaylists(user, songIds);
  }

  async function seedPlaylists(user: UserDocument, songIds: string[]) {

    const playlist = await playlistModel.create({
      name: faker.music.genre(),
      user: user._id,
      songs: songIds,
    });
    console.log(`🎵 Seeded playlist: ${playlist.name}`);
  }

};