/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteModule } from './note/note.module';
import { UniversityModule } from './university/university.module';
import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/comment.entity';
import { UniversityEntity } from './university/university.entity';
import { CourseEntity } from './course/course.entity';
import { UserEntity } from './user/user.entity';
import { NoteEntity } from './note/note.entity';
import { NoteCommentModule } from './note-comment/note-comment.module';
import { UniversityCourseModule } from './university-course/university-course.module';
import { UniversityUserModule } from './university-user/university-user.module';
import { CourseNoteModule } from './course-note/course-note.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserUserModule } from './user-user/user-user.module';
import { NoteUserModule } from './note-user/note-user.module';
import { UserCourseModule } from './user-course/user-course.module';
import { UserCommentModule } from './user-comment/user-comment.module';
import { AuthModule } from './auth/auth.module';




@Module({
imports: [UserCommentModule, UserCourseModule, CommentModule,UniversityModule, CourseModule, UserModule,NoteModule,
TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'uniteU',
    entities: [CommentEntity,UniversityEntity, CourseEntity, UserEntity,NoteEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
}),
NoteCommentModule,
UniversityCourseModule,
UniversityUserModule,
CourseNoteModule,
UserUserModule,
NoteUserModule,
UserCourseModule,
AuthModule,
],
controllers: [AppController],
providers: [AppService],
})
export class AppModule {}
