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

  @ApiProperty({ type: [Number] })
  @IsArray()
  //@IsString({ each: true })
  @IsNumber({}, { each: true }) // For relationship
  @IsNotEmpty()
  readonly artists: number[];

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly releasedDate: Date;

  @ApiProperty()
  @IsMilitaryTime()
  @IsNotEmpty()
  readonly duration: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
