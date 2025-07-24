import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'Jane',
    description: 'provide the firstName of the user',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'provide the lastName of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'jane_doe@gmail.com',
    description: 'provide the email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "test123#@",
    description: 'provide the password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  //@ApiProperty({ required: false })
  @ApiHideProperty() // ✅ hides this field in Swagger UI
  apiKey: string | null;
}