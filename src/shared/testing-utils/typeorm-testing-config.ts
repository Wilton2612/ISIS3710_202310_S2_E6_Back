/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../../comment/comment.entity';
import { UniversityEntity } from '../../university/university.entity';
import { CourseEntity } from '../../course/course.entity';
import { UserEntity } from '../../user/user.entity';
import { NoteEntity } from '../../note/note.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [CommentEntity,UniversityEntity, CourseEntity, UserEntity,NoteEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([CommentEntity,UniversityEntity, CourseEntity, UserEntity,NoteEntity]),
];
