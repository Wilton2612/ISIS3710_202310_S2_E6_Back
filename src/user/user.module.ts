/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  exports: [UserService],
  
})
export class UserModule {
}
