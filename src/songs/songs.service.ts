import { Injectable } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';

@Injectable()
export class SongsService {
  private readonly songs: CreateSongDTO[] = [];
  create(song: CreateSongDTO): string {
    this.songs.push(song);
    return 'Song created successfully';
  }
  findAll(): any[] {
    //throw new Error('Error in findAll');
    return this.songs;
  }
}
