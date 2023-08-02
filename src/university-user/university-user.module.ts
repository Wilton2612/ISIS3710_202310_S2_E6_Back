import { Module } from '@nestjs/common';
import { UniversityUserService } from './university-user.service';
import { UniversityEntity } from 'src/university/university.entity';
import { UserEntity } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityUserController } from './university-user.controller';

@Module({
  providers: [UniversityUserService],
  imports: [TypeOrmModule.forFeature([UniversityEntity, UserEntity])],
  controllers: [UniversityUserController],

})
export class UniversityUserModule {}
