import { Module } from '@nestjs/common';
import { NoteCommentService } from './note-comment.service';
import { NoteEntity } from '../note/note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity} from '../comment/comment.entity';
import { NoteCommentController } from './note-comment.controller';


@Module({
  providers: [NoteCommentService],
  imports: [TypeOrmModule.forFeature([NoteEntity, CommentEntity])],
  controllers: [NoteCommentController],
})

export class NoteCommentModule {}
