import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from './schemas/artist.schema';
import { Model } from 'mongoose';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name)
    private readonly artistModel:Model<ArtistDocument>
  ) {}

  async findArtist(userId: string): Promise<ArtistDocument | null> {
    return this.artistModel.findOne({ 'user': userId }).populate('user').exec();
  }

  async createArtistForUser(user: User): Promise<ArtistDocument> {
    const createdArtist = new this.artistModel({ user });
    return createdArtist.save();
  }
}
