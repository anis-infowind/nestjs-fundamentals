import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class ValidateTokenDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}