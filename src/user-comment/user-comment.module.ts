import { Module } from '@nestjs/common';
import { UserCommentService } from './user-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from 'src/comment/comment.entity';
import { UserCommentController } from './user-comment.controller';


@Module({
  providers: [UserCommentService],
  imports: [TypeOrmModule.forFeature([UserEntity, CommentEntity])],
  controllers: [UserCommentController],
})
export class UserCommentModule {}
