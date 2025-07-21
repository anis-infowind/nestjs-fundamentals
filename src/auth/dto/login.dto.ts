import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'jane_doe@gmail.com',
    description: 'provide the email of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "test123#@",
    description: 'provide the password of the user',
  })
  password: string;
}