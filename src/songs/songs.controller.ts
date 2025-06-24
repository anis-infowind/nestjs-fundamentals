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
  Inject,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';
import { UpdateSongDto } from './dto/update-song-dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({
  path: 'songs',
  scope: Scope.REQUEST
})
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    @Inject('CONNECTION')
    private connection: Connection,
  ) {
    console.log(
      `THIS IS CONNECTION STRING ${this.connection.CONNECTION_STRING}`,
    );
  }
  @Post()
  async create(
    @Body() createSongDTO: CreateSongDTO,
  ): Promise<Song> {
    return this.songsService.create(createSongDTO);
  }
  @Get()
  findAll(): Promise<Song[]> {
    try {
      return this.songsService.findAll();
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
  async findOne(
    // option 1
    // @Param('id', ParseIntPipe) id: number) {
    //   return `Song details by ID: ${id} ${typeof id}`;
    // }
    @Param(
      'id',
       //ParseIntPipe,
      new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE}),
    ) id: number): Promise<Song | null> {
      const song = await this.songsService.findOne(id);
      if (!song) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: 'Song not found',
        }, HttpStatus.NOT_FOUND);
      }
      return song;
  }
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    return await this.songsService.update(id, updateSongDTO);
  }
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id:number
  ): Promise<DeleteResult> {
    return await this.songsService.remove(id);
  }
}
