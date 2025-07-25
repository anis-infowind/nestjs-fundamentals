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
  DefaultValuePipe,
  Query,
  UseGuards,
  Req,
  Ip,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Connection } from 'src/common/constants/connection';
import { Song, SongDocument } from './schemas/song.schema';
import { UpdateSongDto } from './dto/update-song-dto';
import { JwtArtistGuard } from '../auth/guards/jwt-artist.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResult } from 'src/common/interface/paginated-result/paginated-result.interface';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@SkipThrottle()
@Controller({
  path: 'songs',
  scope: Scope.REQUEST
})
@ApiTags('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    @Inject('CONNECTION')
    private connection: Connection,
    private readonly myLoggerService: MyLoggerService
  ) {
    console.log(
      `THIS IS CONNECTION STRING ${this.connection.CONNECTION_STRING}`,
    );
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtArtistGuard)
  @ApiBody({ type: CreateSongDTO })
  @ApiOperation({ summary: 'Create new song' })
  @ApiResponse({
    status: 201,
    description: 'It will return the song in the response',
  })
  async create(
    @Body() createSongDTO: CreateSongDTO,
    @Req() req: ExpressRequest
  ): Promise<SongDocument> {
    console.log(req.user, "req.user => SongsController");
    return this.songsService.create(createSongDTO);
  }

  @SkipThrottle({ default: false })
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
  findAll(
    @Ip() ip: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit = 10,
    @Query('orderBy') orderBy?: string,
    @Query('order', new DefaultValuePipe('DESC')) order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<PaginatedResult<SongDocument>> {
    //this.myLoggerService.log(`Request for ALL Songs\t${ip}`, SongsController.name);
    try {
      limit = limit > 100 ? 100 : limit;
      //return this.songsService.findAll();
      return this.songsService.paginate({
        page,
        limit,
      }, orderBy, order);
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

  @Throttle({'short': { ttl: 1000, limit: 1 }}) // named throttle override global 'short' throttle for this route
  //@Throttle({'short': { ttl: 1000, limit: 1 }}) // default throttle, custom throttle for this route
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SongDocument> {
    const song = await this.songsService.findOne(id);
    if (!song) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Song not found',
      }, HttpStatus.NOT_FOUND);
    }
    return song as SongDocument;
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<SongDocument> {
    return await this.songsService.update(id, updateSongDTO);
  }
  @Delete(':id')
  async remove(
    @Param('id') id:string
  ): Promise<{ deleted: boolean }> {
    return await this.songsService.remove(id);
  }
}
