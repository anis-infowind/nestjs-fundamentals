import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Song } from 'src/songs/entities/song.entity';
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreatePlayListDto } from './dto/create-playlist.dto';

@Injectable()
export class PlayListsService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepository: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(playListDTO: CreatePlayListDto): Promise<Playlist> {
    const playList = new Playlist();
    playList.name = playListDTO.name;

    // songs will be the array of ids that we are getting from the DTO object
    const songs = await this.songsRepository.find({
      where: { id: In(playListDTO.songs) },
    });
    // set the relation for the songs with playlist entity
    playList.songs = songs;

    // A user will be the id of the user we are getting from the request
    // when we implemented the user authentication this id will become the loggedIn user id
    const user = await this.userRepository.findOneBy({ id: playListDTO.user });
    if (!user) {
      throw new Error('User not found');
    }
    playList.user = user;

    return this.playListRepository.save(playList);
  }
}