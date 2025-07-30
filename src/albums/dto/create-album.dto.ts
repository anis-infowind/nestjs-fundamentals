import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateAlbumDto {
  @Field()
  name: string;
}
