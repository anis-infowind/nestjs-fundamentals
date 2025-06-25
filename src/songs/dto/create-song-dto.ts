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
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsArray()
  //@IsString({ each: true })
  @IsNumber({}, { each: true }) // For relationship
  @IsNotEmpty()
  readonly artists: number[];

  @IsDateString()
  @IsNotEmpty()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
