import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayListDto } from './dto/create-playlist.dto';
import { PlayListsService } from './playlists.service';
import { ApiTags } from '@nestjs/swagger';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';

@Controller('playlists')
@ApiTags('playlists')
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}
  @Post()
  create(
    @Body()
    playlistDTO: CreatePlayListDto,
  ): Promise<PlaylistDocument> {
    return this.playListService.create(playlistDTO);
  }
}