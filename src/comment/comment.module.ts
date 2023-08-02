import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  providers: [CommentService,
CommentService,
CommentService],
  controllers: [CommentController,
]
})
export class CommentModule { }
