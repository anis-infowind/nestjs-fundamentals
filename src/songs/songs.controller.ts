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

@Controller({
  path: 'songs',
  scope: Scope.DEFAULT
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
  ): Promise<string> {
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
    // option 1
    // @Param('id', ParseIntPipe) id: number) {
    //   return `Song details by ID: ${id} ${typeof id}`;
    // }
    @Param(
      'id',
       //ParseIntPipe,
      new ParseIntPipe({errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE}),
    ) id: number): string {
    return `Song details by ID: ${id} ${typeof id}`;
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number
  ): string {
    return `Update song by ID: ${id} ${typeof id}`;
  }
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id:number
  ): Promise<string> {
    return `Delete song by ID: ${id} ${typeof id}`;
  }
}
