import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly title: string;

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  //@IsString({ each: true })
  @IsNumber({}, { each: true }) // For relationship
  readonly artists: number[];

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;

  @ApiProperty({ required: false })
  @IsMilitaryTime()
  @IsOptional()
  readonly duration: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly lyrics: string;
}