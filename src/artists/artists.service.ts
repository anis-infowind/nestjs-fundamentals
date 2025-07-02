import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArtistsService {
  constructor(
  @InjectRepository(Artist)
  private artistRepository: Repository<Artist>
  ) {}
  findArtist(userId: number): Promise<Artist | null> {
    return this.artistRepository.findOneBy({ user: { id: userId } });
  }

  async createArtistForUser(user: User): Promise<Artist> {
    const artist = this.artistRepository.create({ user });
    return this.artistRepository.save(artist);
  }
}
