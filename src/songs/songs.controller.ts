import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  HttpStatus,
  Body,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}
  @Post()
  create(
    @Body() createSongDTO: CreateSongDTO,
  ): string {
    return this.songsService.create(createSongDTO);
  }
  @Get()
  findAll(): string[] {
    try {
      return this.songsService.findAll() as string[];
    } catch (error) {
      /* throw new ForbiddenException() is a built-in exception that can be used to throw a forbidden error */
      // throw new ForbiddenException();
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Forbidden custom error',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }
  @Get(':id')
  findOne(
    @Param(
      'id',
       //ParseIntPipe,
      new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE}),
    ) id: number): string {
    return `Song details by ID: ${id} ${typeof id}`;
  }
  @Put(':id')
  update(): string {
    return 'Update song by ID';
  }
  @Delete(':id')
  remove(): string {
    return 'Delete song by ID';
  }
}
