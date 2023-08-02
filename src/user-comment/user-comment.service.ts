import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserCommentService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly UserRepository : Repository<UserEntity>,

        @InjectRepository(CommentEntity)
        private readonly CommentRepository : Repository<CommentEntity>

    ){}

    async addCommentUser(UserId: string, CommentId: number): Promise<UserEntity> {
        const Comment: CommentEntity = await this.CommentRepository.findOne({where: {id: CommentId}});
        if (!Comment)
          throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND);
      
        const User: UserEntity = await this.UserRepository.findOne({where: {id: UserId}, relations: ["comments", "university", "friends",  "notes"]})
        if (!User)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
    
        User.comments = [...User.comments, Comment];
        return await this.UserRepository.save(User);
      }

      async findCommentByUserIdCommentId(UserId: string, CommentId: number): Promise<CommentEntity> {
        const comment: CommentEntity = await this.CommentRepository.findOne({where: {id: CommentId}});
        if (!comment)
          throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)
       
        const user: UserEntity = await this.UserRepository.findOne({where: {id: UserId}, relations: ["comments"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
   
        const usercomment: CommentEntity = user.comments.find(e => e.id === comment.id);
   
        if (!usercomment)
          throw new BusinessLogicException("The comment with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)
   
        return usercomment;
    }
     
    async findCommentsByUserId(UserId: string): Promise<CommentEntity[]> {
        const User: UserEntity = await this.UserRepository.findOne({where: {id: UserId}, relations: ["comments"]});
        if (!User)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
        
        return User.comments;
    }
     
    async associateCommentsUser(CommentId: string, Comments: CommentEntity[]): Promise<UserEntity> {
        const User: UserEntity = await this.UserRepository.findOne({where: {id: CommentId}, relations: ["comments"]});
     
        if (!User)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < Comments.length; i++) {
          const Comment: CommentEntity = await this.CommentRepository.findOne({where: {id: Comments[i].id}});
          if (!Comment)
            throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        User.comments = Comments;
        return await this.UserRepository.save(User);
      }
     
      async deleteCommentUser(UserId: string, CommentId: number){
        const comment: CommentEntity = await this.CommentRepository.findOne({where: {id: CommentId}});
        if (!comment)
          throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)
    
        const user: UserEntity = await this.UserRepository.findOne({where: {id: UserId}, relations: ["comments"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
    
        const usercomment: CommentEntity = user.comments.find(e => e.id === comment.id);
    
        if (!usercomment)
            throw new BusinessLogicException("The comment with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)
 
        user.comments = user.comments.filter(e => e.id !== CommentId);
        await this.UserRepository.save(user);
    }  
}
