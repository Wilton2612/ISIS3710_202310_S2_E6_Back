import { Module } from '@nestjs/common';
import { UserCourseService } from './user-course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CourseEntity } from 'src/course/course.entity';
import { UserCourseController } from './user-course.controller';


@Module({
  providers: [UserCourseService],
  imports: [TypeOrmModule.forFeature([UserEntity, CourseEntity])],
  controllers: [UserCourseController],
})
export class UserCourseModule {}
