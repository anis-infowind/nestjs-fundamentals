import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayListDto } from './dto/create-playlist.dto';
import { PlayListsService } from './playlists.service';
import { Playlist } from './entities/playlist.entity';

@Controller('playlists')
export class PlayListsController {
  constructor(private playListService: PlayListsService) {}
  @Post()
  create(
    @Body()
    playlistDTO: CreatePlayListDto,
  ): Promise<Playlist> {
    return this.playListService.create(playlistDTO);
  }
}