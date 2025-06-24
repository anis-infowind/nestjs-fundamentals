import { Injectable, Scope } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { UpdateSongDto } from './dto/update-song-dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable({
  scope: Scope.TRANSIENT
})
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}
  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;
    return await this.songsRepository.save(song);
  }
  async findAll(): Promise<Song[]> {
    return await this.songsRepository.find();
  }

  async findOne(id: number): Promise<Song | null> {
    return await this.songsRepository.findOneBy({ id });
  }
  async update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
    return await this.songsRepository.update(id, recordToUpdate);
  }
  async remove(id: number): Promise<DeleteResult> {
    return await this.songsRepository.delete(id);
  }

  async paginate(options: IPaginationOptions, orderBy?: string, order: 'ASC' | 'DESC' = 'DESC'): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('c');
    if (orderBy) {
      queryBuilder.orderBy(`c.${orderBy}`, order);
    } else {
      queryBuilder.orderBy('c.releasedDate', 'DESC');
    }
    return paginate<Song>(queryBuilder, options);
    //return paginate<Song>(this.songsRepository, options);
  }
  
}
