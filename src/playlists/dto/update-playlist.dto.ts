import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayListDto } from './create-playlist.dto';

export class UpdatePlaylistDto extends PartialType(CreatePlayListDto) {}
