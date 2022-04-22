import { Module } from '@nestjs/common';
import { DateScalar } from 'src/common/scalars/date.scalar';
import { UsersResolver } from './user.resolver';

@Module({
  providers: [UsersResolver, DateScalar],
})
export class UsersModule {}
