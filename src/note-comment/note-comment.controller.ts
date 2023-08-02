import { Controller, UseInterceptors, Param, Post, Get, Put, Body, Delete, HttpCode, UseGuards} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NoteCommentService } from './note-comment.service';
import { plainToInstance } from 'class-transformer';
import { CommentEntity } from '../comment/comment.entity';
import { CommentDto } from '../comment/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notes')
@UseInterceptors(BusinessErrorsInterceptor)
export class NoteCommentController {


    constructor(private readonly noteCommentService: NoteCommentService)
    {}

    
   
    @Post(':noteId/comments/:commentId')
    async addCommentNote(@Param('noteId') nodeId: number, @Param('commentId') commentId: number){
       return await this.noteCommentService.addCommentNote(nodeId, commentId);
   }

   
   @Get(':noteId/comments/:commentId')
   async findCommentByNoteIdCommentId(@Param('noteId') noteId: number, @Param('commentId') commentId: number){
       return await this.noteCommentService.findCommentByNoteIdCommentId(noteId, commentId);
   }

   
   @Get(':noteId/comments')
   async findCommentsByNoteId(@Param('noteId') noteId: number){
       return await this.noteCommentService.findCommentsByNoteId(noteId);
   }

    
    @Put(':noteId/comments')
    async associateCommentsNote(@Body() commentsDto: CommentDto[], @Param('noteId') noteId: number){
        const comments = plainToInstance(CommentEntity, commentsDto)
        return await this.noteCommentService.associateCommentsNote(noteId, comments);
    }

   
    @Delete(':noteId/comments/:commentId')
    @HttpCode(204)
    async deleteCommentNote(@Param('noteId') noteId: number, @Param('commentId') commentId: number){
        return await this.noteCommentService.deleteCommentNote(noteId, commentId);
    }
}
