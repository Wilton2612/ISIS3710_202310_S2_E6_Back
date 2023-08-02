import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { UserUserService } from './user-user.service';
import { UserUserController } from './user-user.controller';

@Module({
  providers: [UserUserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserUserController],
})
export class UserUserModule {}
