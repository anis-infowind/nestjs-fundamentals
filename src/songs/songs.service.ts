import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Song } from './entities/song.entity';
import { UpdateSongDto } from './dto/update-song-dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable({
  scope: Scope.TRANSIENT
})
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,

    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>
  ) {}
  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;

    console.log(songDTO.artists);

    // find all the artits on the based on ids
    const artists = await this.artistsRepository.find({
      where: { id: In(songDTO.artists) },
      //relations: ['user', 'songs'], // to show full object
    });
    console.log(artists);
    //set the relation with artist and songs
    song.artists = artists;

    return await this.songsRepository.save(song);
  }
  async findAll(): Promise<Song[]> {
    return await this.songsRepository.find();
  }

  async findOne(id: number): Promise<Song | null> {
    return await this.songsRepository.findOneBy({ id });
  }
  async update(id: number, recordToUpdate: UpdateSongDto): Promise<Song> {
    const song = await this.songsRepository.findOne({
      where: { id },
      relations: ['artists'], // ensure artists relation is loaded
    });
  
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
  
    // Update direct fields (e.g., title, duration, etc.)
    Object.assign(song, recordToUpdate);
  
    // If artists are being updated
    if (recordToUpdate.artists) {
      const artists = await this.artistsRepository.find({
        where: { id: In(recordToUpdate.artists) },
      });
      song.artists = artists;
    }
  
    return await this.songsRepository.save(song); // ✅ updates join table too
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
