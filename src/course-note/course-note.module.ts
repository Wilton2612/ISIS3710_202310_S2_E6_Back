import { Module } from '@nestjs/common';
import { CourseNoteService } from './course-note.service';
import { NoteEntity } from '../note/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from '../course/course.entity';
import { CourseNoteController } from './course-note.controller';

@Module({
  providers: [CourseNoteService],
  imports: [TypeOrmModule.forFeature([NoteEntity, CourseEntity])],
  controllers: [CourseNoteController],
})
export class CourseNoteModule {}
