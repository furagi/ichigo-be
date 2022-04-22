import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Reward {
  @Field(() => Int)
  id: number;

  @Field()
  availableAt: string;

  @Field({ nullable: true })
  redeemedAt?: string;

  @Field({ nullable: true })
  expiresAt: string;
}
