import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserCommentService } from './user-comment.service';
import { CommentEntity } from 'src/comment/comment.entity';
import { plainToInstance } from 'class-transformer';
import { CommentDto } from '../comment/comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserCommentController {
    constructor(private readonly UserCommentService: UserCommentService){}

   
    @Post(':UserId/comments/:CommentId')
   async addCommentUser(@Param('UserId') UserId: string, @Param('CommentId') CommentId: number){
       return await this.UserCommentService.addCommentUser(UserId, CommentId);
   }
   
   @Get(':UserId/Comments/:CommentId')
   async findCommentByUserIdCommentId(@Param('UserId') UserId: string, @Param('CommentId') CommentId: number){
       return await this.UserCommentService.findCommentByUserIdCommentId(UserId, CommentId);
   }

   @Get(':UserId/Comments')
   async findCommentsByUserId(@Param('UserId') UserId: string){
       return await this.UserCommentService.findCommentsByUserId(UserId);
   }

  
   @Put(':UserId/Comments')
   async associateCommentsUser(@Body() CommentsDto: CommentDto[], @Param('UserId') UserId: string){
       const Comments = plainToInstance(CommentEntity, CommentsDto)
       return await this.UserCommentService.associateCommentsUser(UserId, Comments);
   }

 
   @Delete(':UserId/Comments/:CommentId')
    @HttpCode(204)
   async deleteCommentUser(@Param('UserId') UserId: string, @Param('CommentId') CommentId: number){
       return await this.UserCommentService.deleteCommentUser(UserId, CommentId);
   }

}
