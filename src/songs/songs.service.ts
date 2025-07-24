import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Song, SongDocument } from './schemas/song.schema';
import { Artist, ArtistDocument } from 'src/artists/schemas/artist.schema';
import { PaginatedResult } from 'src/common/interface/paginated-result/paginated-result.interface';

@Injectable({
  scope: Scope.TRANSIENT
})
export class SongsService {
  constructor(
    @InjectModel(Song.name)
    private readonly songModel: Model<SongDocument>,

    @InjectModel(Artist.name)
    private readonly artistModel: Model<ArtistDocument>
  ) {}
  async create(songDTO: CreateSongDTO): Promise<SongDocument> {
    console.log(songDTO, 'songDTO')
    const artists = await this.artistModel.find({
      _id: { $in: songDTO.artists }
    });

    const song = new this.songModel({
      title: songDTO.title,
      duration: songDTO.duration,
      lyrics: songDTO.lyrics,
      releasedDate: songDTO.releasedDate,
      artists: artists.map(artist => artist._id)
    });

    const savedSong = await song.save();

    // Update each artist with the new song
    await Promise.all(
      artists.map(artist =>
        this.artistModel.updateOne(
          { _id: artist._id },
          { $push: { songs: savedSong._id } }
        )
      )
    );

    return savedSong;
  }
  async findAll(): Promise<Song[]> {
    return this.songModel.find().populate('artists');
  }

  async findOne(id: string): Promise<SongDocument | null> {
    return this.songModel.findById(id).populate('artists');
  }
  async update(id: string, recordToUpdate: UpdateSongDto): Promise<SongDocument> {
    const song = await this.songModel.findById(id);
  
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
  
    // Update direct fields (e.g., title, duration, etc.)
    Object.assign(song, recordToUpdate);
  
    // If artists are being updated
    if (recordToUpdate.artists) {
      const artists = await this.artistModel.find({
        _id: { $in: recordToUpdate.artists }
      });
      song.artists = artists.map(artist => artist._id);
    }
  
    return await song.save(); // ✅ updates join table too
  }
  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.songModel.deleteOne({ _id: id });
    return { deleted: result.deletedCount > 0 };
  }

  async paginate(options: any, orderBy?: string, order: 'ASC' | 'DESC' = 'DESC'): Promise<PaginatedResult<SongDocument>> {
    const sortField = orderBy ?? 'releasedDate';
    const sortOrder = order === 'ASC' ? 1 : -1;
    const result = await (this.songModel as PaginateModel<SongDocument>).paginate(
      {},
      {
        page: options.page,
        limit: options.limit,
        sort: { [sortField]: sortOrder },
        populate: ['artists'], // optional if you want to include artist info
      },
    );
  
    return {
      docs: result.docs,
      totalDocs: result.totalDocs ?? 0,
      limit: result.limit ?? 0,
      page: result.page ?? 1,
      totalPages: result.totalPages ?? 1,
      hasNextPage: result.hasNextPage ?? false,
      hasPrevPage: result.hasPrevPage ?? false,
    };
  }
}
