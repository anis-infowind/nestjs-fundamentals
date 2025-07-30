import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, AlbumDocument } from './schemas/album.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    
  ) {}
  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumDocument> {
    return await this.albumModel.create(createAlbumDto);
  }

  async findAll(): Promise<AlbumDocument[]> {
    return await this.albumModel.find().exec();
  }

  async findOne(id: string): Promise<AlbumDocument | null> {
    const album = await this.albumModel.findById(id).exec();
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<AlbumDocument> {
    const album = await this.albumModel.findById(id);
  
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    Object.assign(album, updateAlbumDto);
  
    return await album.save();
  }

  async remove(id: string) {
    const result = await this.albumModel.deleteOne({ _id: id });
    return { deleted: result.deletedCount > 0 };
  }
}
