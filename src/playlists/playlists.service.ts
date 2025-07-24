import { Injectable } from '@nestjs/common';
import { CreatePlayListDto } from './dto/create-playlist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SongDocument, Song } from 'src/songs/schemas/song.schema';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class PlayListsService {
  constructor(
    @InjectModel(Playlist.name)
    private playListModel: Model<PlaylistDocument>,

    @InjectModel(Song.name)
    private songModel: Model<SongDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(playListDTO: CreatePlayListDto): Promise<PlaylistDocument> {
    const { name, songs: songIds, user: userId } = playListDTO;

    const songs = await this.songModel.find({
      _id: { $in: songIds }
    });

    // A user will be the id of the user we are getting from the request
    // when we implemented the user authentication this id will become the loggedIn user id
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create and save playlist
    const playlist = new this.playListModel({
      name,
      songs: songs.map(song => song._id),
      user: user._id,
    });

    return await playlist.save();
  }
}