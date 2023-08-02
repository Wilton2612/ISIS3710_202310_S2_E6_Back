import { Injectable } from '@nestjs/common';
import { NoteEntity } from '../note/note.entity';
import { CommentEntity} from '../comment/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class NoteCommentService {

    constructor(
        @InjectRepository(NoteEntity)
        private readonly noteRepository: Repository<NoteEntity>,
    
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>
    ) {}


    async addCommentNote(noteId: number, commentId: number): Promise<NoteEntity> {
        const comment: CommentEntity = await this.commentRepository.findOne({where: {id: commentId}});
        if (!comment)
          throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND);
       
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}, relations: ["comments"]}) 
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND);
     
        note.comments = [...note.comments, comment];
        return await this.noteRepository.save(note);
      }
     
    
    async findCommentByNoteIdCommentId(noteId: number, commentId: number): Promise<CommentEntity> {
        const comment: CommentEntity = await this.commentRepository.findOne({where: {id: commentId}});
        if (!comment)
          throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)
        
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}, relations: ["comments"]}); 
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
    
        const noteComment: CommentEntity = note.comments.find(e => e.id === comment.id);
    
        if (!noteComment)
          throw new BusinessLogicException("The comment with the given id is not associated to the note", BusinessError.PRECONDITION_FAILED)
    
        return noteComment;
    }
     
    async findCommentsByNoteId(noteId: number): Promise<CommentEntity[]> {
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}, relations: ["comments"]});
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
        
        return note.comments;
    }
     
    async associateCommentsNote(noteId: number, comments: CommentEntity[]): Promise<NoteEntity> {
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}, relations: ["comments"]});
     
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < comments.length; i++) {
          const comment: CommentEntity = await this.commentRepository.findOne({where: {id: comments[i].id}});
          if (!comment)
            throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        note.comments = comments;
        return await this.noteRepository.save(note);
      }
     
    async deleteCommentNote(noteId: number, commentId: number){
        const comment: CommentEntity = await this.commentRepository.findOne({where: {id: commentId}});
        if (!comment)
          throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)
     
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}, relations: ["comments"]});
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
     
        const noteComment: CommentEntity = note.comments.find(e => e.id === comment.id);
     
        if (!noteComment)
            throw new BusinessLogicException("The comment with the given id is not associated to the note", BusinessError.PRECONDITION_FAILED)

        note.comments = note.comments.filter(e => e.id !==  commentId);
        await this.noteRepository.save(note);
    }


}
