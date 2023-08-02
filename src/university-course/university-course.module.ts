import { Module } from '@nestjs/common';
import { UniversityCourseService } from './university-course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityEntity } from 'src/university/university.entity';
import { CourseEntity } from 'src/course/course.entity';
import { UniversityCourseController } from './university-course.controller';


@Module({
  providers: [UniversityCourseService],
  imports: [TypeOrmModule.forFeature([UniversityEntity, CourseEntity])],
  controllers: [UniversityCourseController],
})
export class UniversityCourseModule {}
