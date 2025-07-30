import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AlbumType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;
}