import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AlbumsService } from './albums.service';
import { AlbumDocument } from './schemas/album.schema';
import { AlbumType } from './dto/album.type';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GraphQLError } from 'graphql';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Resolver(() => AlbumType)
export class AlbumsResolver {
  constructor(
    private readonly albumsService: AlbumsService 
  ) {}

  @Query(() => [AlbumType])
  async albums(): Promise<AlbumDocument[]> {
    return await this.albumsService.findAll();
  }

  @Query(() => AlbumType)
  async album(@Args('id') id: string): Promise<AlbumDocument | null> {
    return await this.albumsService.findOne(id);
  }

  @Mutation(() => AlbumType)
  createAlbum(@Args('input') input: CreateAlbumDto) {
    return this.albumsService.create(input);
  }

  @Mutation(() => AlbumType)
  updateAlbum(@Args('id') id: string, @Args('input') input: UpdateAlbumDto) {
    return this.albumsService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteAlbum(@Args('id') id: string) {
    return this.albumsService.remove(id);
  }
}
