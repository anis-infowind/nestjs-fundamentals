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

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  //@IsNumber({}, { each: true }) // For relationship
  readonly artists: string[];

  @ApiProperty({ required: false, example: '2022-08-29' })
  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;

  @ApiProperty({ required: false, example: '03:45' })
  @IsMilitaryTime()
  @IsOptional()
  readonly duration: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly lyrics: string;
}