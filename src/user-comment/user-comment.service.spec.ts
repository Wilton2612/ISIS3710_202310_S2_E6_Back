import { Test, TestingModule } from '@nestjs/testing';
import { UserCommentService } from './user-comment.service';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UserCommentService', () => {
  let service: UserCommentService;
  let UserRepository: Repository<UserEntity>;
  let CommentRepository: Repository<CommentEntity>;
  let User: UserEntity;
  let CommentsList : CommentEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserCommentService],
    }).compile();

    service = module.get<UserCommentService>(UserCommentService);
    UserRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    CommentRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    CommentRepository.clear();
    UserRepository.clear();
      CommentsList = [];
      for(let i = 0; i < 5; i++){
          const Comment: CommentEntity = await CommentRepository.save({
          rating: 3,
          text: faker.lorem.text() })
          CommentsList.push(Comment);
      }

    User = await UserRepository.save({
      name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.imageUrl(),
        user: faker.name.prefix(),
        userType: "student",
        comments: CommentsList,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCommentUser should add an Comment to a User', async () => {
    const newComment: CommentEntity = await CommentRepository.save({
      rating: 3,
      text: faker.lorem.text()
    });

    const newUser: UserEntity = await UserRepository.save({
      name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.imageUrl(),
        user: faker.name.prefix(),
        userType: "student",
    })

    const result: UserEntity = await service.addCommentUser(newUser.id, newComment.id);
    
    expect(result.comments.length).toBe(1);
    expect(result.comments[0]).not.toBeNull();
    expect(result.comments[0].rating).toBe(newComment.rating)
    expect(result.comments[0].text).toBe(newComment.text)
  });

  it('addCommentUser should thrown exception for an invalid Comment', async () => {
    const newUser: UserEntity = await UserRepository.save({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.imageUrl(),
        user: faker.name.prefix(),
        userType: "student"
    })

    await expect(() => service.addCommentUser(newUser.id, 0)).rejects.toHaveProperty("message", "The comment with the given id was not found");
  });

  it('addCommentUser should throw an exception for an invalid User', async () => {
    const newComment: CommentEntity = await CommentRepository.save({
      rating: 3,
      text: faker.lorem.text(),
    });

    await expect(() => service.addCommentUser("0", newComment.id)).rejects.toHaveProperty("message", "The user with the given id was not found");
  });

  it('findCommentByUserIdCommentId should return Comment by User', async () => {
    const Comment: CommentEntity = CommentsList[0];
    const storedComment: CommentEntity = await service.findCommentByUserIdCommentId(User.id, Comment.id, )
    expect(storedComment).not.toBeNull();
    expect(storedComment.rating).toBe(Comment.rating);
    expect(storedComment.text).toBe(Comment.text);
  });

  it('findCommentByUserIdCommentId should throw an exception for an invalid Comment', async () => {
    await expect(()=> service.findCommentByUserIdCommentId(User.id, 0)).rejects.toHaveProperty("message", "The comment with the given id was not found"); 
  });

  it('findCommentByUserIdCommentId should throw an exception for an invalid User', async () => {
    const Comment: CommentEntity = CommentsList[0]; 
    await expect(()=> service.findCommentByUserIdCommentId("0", Comment.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('findCommentByUserIdCommentId should throw an exception for an Comment not associated to the User', async () => {
    const newComment: CommentEntity = await CommentRepository.save({
      rating: 3,
      text: faker.lorem.text(),
    });

    await expect(()=> service.findCommentByUserIdCommentId(User.id, newComment.id)).rejects.toHaveProperty("message", "The comment with the given id is not associated to the user"); 
  });

  it('findCommentsByUserId should return Comments by User', async ()=>{
    const Comments: CommentEntity[] = await service.findCommentsByUserId(User.id);
  });

  it('findCommentsByUserId should throw an exception for an invalid User', async () => {
    await expect(()=> service.findCommentsByUserId("0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateCommentsUser should update Comments list for a User', async () => {
    const newComment: CommentEntity = await CommentRepository.save({
      rating: 3,
      text: faker.lorem.text(),
    });

    const updatedUser: UserEntity = await service.associateCommentsUser(User.id, [newComment]);
    expect(updatedUser.comments.length).toBe(1);

    expect(updatedUser.comments[0].rating).toBe(newComment.rating);
    expect(updatedUser.comments[0].text).toBe(newComment.text);

  });

  it('associateCommentsUser should throw an exception for an invalid User', async () => {
    const newComment: CommentEntity = await CommentRepository.save({
      rating: 3,
      text: faker.lorem.text(),
    });

    await expect(()=> service.associateCommentsUser("0", [newComment])).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateCommentsUser should throw an exception for an invalid Comment', async () => {
    const newComment: CommentEntity = CommentsList[0];
    newComment.id = 0;

    await expect(()=> service.associateCommentsUser(User.id, [newComment])).rejects.toHaveProperty("message", "The comment with the given id was not found"); 
  });

  it('deleteCommentToUser should remove an Comment from a User', async () => {
    const Comment: CommentEntity = CommentsList[0];
    
    await service.deleteCommentUser(User.id, Comment.id);

    const storedUser: UserEntity = await UserRepository.findOne({where: {id: User.id}, relations: ["comments"]});
    const deletedComment: CommentEntity = storedUser.comments.find(a => a.id === Comment.id);

    expect(deletedComment).toBeUndefined();

  });

  it('deleteCommentToUser should thrown an exception for an invalid Comment', async () => {
    await expect(()=> service.deleteCommentUser(User.id, 0)).rejects.toHaveProperty("message", "The comment with the given id was not found"); 
  });

  it('deleteCommentToUser should thrown an exception for an invalid User', async () => {
    const Comment: CommentEntity = CommentsList[0];
    await expect(()=> service.deleteCommentUser("0", Comment.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('deleteCommentToUser should thrown an exception for an non asocciated Comment', async () => {
    const newComment: CommentEntity = await CommentRepository.save({
      rating: 3,
      text: faker.lorem.text(),
    });

    await expect(()=> service.deleteCommentUser(User.id, newComment.id)).rejects.toHaveProperty("message", "The comment with the given id is not associated to the user"); 
  }); 

});
