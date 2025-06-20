import { Injectable, Scope } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';

@Injectable({
  scope: Scope.TRANSIENT
})
export class SongsService {
  private readonly songs: CreateSongDTO[] = [];
  create(song: CreateSongDTO): string {
    this.songs.push(song);
    console.log(this.songs, 'this.songs');
    return 'Song created successfully';
  }
  findAll(): any[] {
    //throw new Error('Error in findAll');
    return this.songs;
  }
}
