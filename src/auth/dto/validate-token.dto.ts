import { IsNotEmpty, IsString } from "class-validator";
export class ValidateTokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}