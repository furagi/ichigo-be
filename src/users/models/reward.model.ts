import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Reward {
  @Field(() => ID)
  uuid: string;

  availableAt: Date;
  expiresAt?: Date;
}
