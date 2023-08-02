import { Injectable } from '@nestjs/common';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity)
        private readonly CommentRepository: Repository<CommentEntity>
    ){
    }

    async findAll(): Promise<CommentEntity[]> {
        return await this.CommentRepository.find({ relations: ["note", "user"] });
    }


    async findOne(id: number): Promise<CommentEntity> {
        const Comment: CommentEntity = await this.CommentRepository.findOne({where: {id}, relations: ["note", "user"] } );
        if (!Comment)
          throw new BusinessLogicException("The Comment with the given id was not found", BusinessError.NOT_FOUND);
   
        return Comment;
    }

    async create(Comment: CommentEntity): Promise<CommentEntity> {
        return await this.CommentRepository.save(Comment);
    }

    async update(id: number, Comment: CommentEntity): Promise<CommentEntity> {
        const persistedComment: CommentEntity = await this.CommentRepository.findOne({where:{id}});
        if (!persistedComment)
          throw new BusinessLogicException("The Comment with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.CommentRepository.save({...persistedComment, ...Comment});
    }

    async delete(id: number) {
        const Comment: CommentEntity = await this.CommentRepository.findOne({where:{id}});
        if (!Comment)
          throw new BusinessLogicException("The Comment with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.CommentRepository.remove(Comment);
    }

}
