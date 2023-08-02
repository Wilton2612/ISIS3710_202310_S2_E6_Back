/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CommentEntity } from './comment.entity';
import { faker } from '@faker-js/faker';

describe('CommentService', () => {
  let service: CommentService;
  let repository: Repository<CommentEntity>;
  let CommentsList: CommentEntity[];
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [CommentService],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));
    await seedDatabase();


  });

  const seedDatabase = async () => {
    repository.clear();
    CommentsList = [];
    for(let i = 0; i < 5; i++){
        const Comment: CommentEntity = await repository.save({
          rating: 3,
          text: faker.lorem.text(),
      })
        CommentsList.push(Comment);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all Comments', async () => {
    const Comment: CommentEntity[] = await service.findAll();
    expect(Comment).not.toBeNull();
    expect(Comment).toHaveLength(CommentsList.length);
  });


  it('findOne should return a Comment by id', async () => {
    const storedComment: CommentEntity = CommentsList[0];
    const Comment: CommentEntity = await service.findOne(storedComment.id);
    expect(Comment).not.toBeNull();
    expect(Comment.rating).toEqual(storedComment.rating)
    expect(Comment.text).toEqual(storedComment.text)
  });


  it('findOne should throw an exception for an invalid Comment', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "The Comment with the given id was not found")
  });


  it('create should return a new Comment', async () => {
    const Comment: CommentEntity = {
      id: 1,
      rating: 3,
      text: faker.lorem.text(),
      note: null,
      user: null
    }
 
    const newComment: CommentEntity = await service.create(Comment);
    expect(newComment).not.toBeNull();
 
    const storedComment: CommentEntity = await repository.findOne({where: {id: newComment.id}})
    expect(storedComment).not.toBeNull();
    expect(storedComment.rating).toEqual(newComment.rating)
    expect(storedComment.text).toEqual(newComment.text)

  });


  it('update should modify a Comment', async () => {
    const Comment: CommentEntity = CommentsList[0];
    Comment.rating = 3;
    Comment.text = "New text";
    const updatedComment: CommentEntity = await service.update(Comment.id, Comment);
    expect(updatedComment).not.toBeNull();

    const storedComment: CommentEntity = await repository.findOne({ where: { id: Comment.id } })
    expect(storedComment).not.toBeNull();
    expect(storedComment.rating).toEqual(updatedComment.rating)
    expect(storedComment.text).toEqual(updatedComment.text)
  });


  it('update should throw an exception for an invalid Comment', async () => {
    let Comment: CommentEntity = CommentsList[0];
    Comment = {
      ...Comment, rating: 3, text: "New text"
    }
    await expect(() => service.update(0, Comment)).rejects.toHaveProperty("message", "The Comment with the given id was not found")
  });


  it('delete should remove a Comment', async () => {
    const Comment: CommentEntity = CommentsList[0];
    await service.delete(Comment.id);
     const deletedComment: CommentEntity = await repository.findOne({ where: { id: Comment.id } })
    expect(deletedComment).toBeNull();
  });

  it('delete should throw an exception for an invalid Comment', async () => {
    const Comment: CommentEntity = CommentsList[0];
    await repository.delete(Comment.id);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "The Comment with the given id was not found")
  });
});
