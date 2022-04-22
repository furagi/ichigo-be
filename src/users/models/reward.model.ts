import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Reward {
  @Field(() => ID)
  uuid: string;

  @Field()
  availableAt: Date;

  @Field({ nullable: true })
  expiresAt?: Date;
}
