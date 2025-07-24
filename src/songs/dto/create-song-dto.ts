import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateSongDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  //@IsNumber({}, { each: true }) // For relationship
  @IsNotEmpty()
  readonly artists: string[];

  @ApiProperty({ example: '2022-08-29' })
  @IsDateString()
  @IsNotEmpty()
  readonly releasedDate: Date;

  @ApiProperty({ example: '03:45' }) // HH:mm format
  @IsMilitaryTime()
  @IsNotEmpty()
  readonly duration: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
