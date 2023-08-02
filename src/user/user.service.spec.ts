/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserEntity } from './user.entity';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let usersList: UserEntity[];
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDatabase();


  });

  const seedDatabase = async () => {
    repository.clear();
    usersList = [];
    for(let i = 0; i < 5; i++){
        const user: UserEntity = await repository.save({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.imageUrl(),
        user: faker.name.prefix(),
        userType: "student"
      })
        usersList.push(user);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all users', async () => {
    const user: UserEntity[] = await service.findAll();
    expect(user).not.toBeNull();
    expect(user).toHaveLength(usersList.length);
  });


  it('findOne should return a user by id', async () => {
    const storedUser: UserEntity = usersList[0];
    const user: UserEntity = await service.findOne(storedUser.id);
    expect(user).not.toBeNull();
    expect(user.name).toEqual(storedUser.name)
    expect(user.email).toEqual(storedUser.email)
    expect(user.password).toEqual(storedUser.password)
    expect(user.image).toEqual(storedUser.image)
    expect(user.user).toEqual(storedUser.user)
  });


  it('findOne should throw an exception for an invalid User', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The user with the given id was not found")
  });


  it('create should return a new User', async () => {
    const User: UserEntity = {
      id: "1",
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(), 
      userType: "student",
      comments: [],
      university: null,
      courses: [],
      friends: [],
      notes: []
    }
 
    const newUser: UserEntity = await service.create(User);
    expect(newUser).not.toBeNull();
 
    const storedUser: UserEntity = await repository.findOne({where: {id: newUser.id}})
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(newUser.name)
    expect(storedUser.email).toEqual(newUser.email)
    expect(storedUser.password).toEqual(newUser.password)
    expect(storedUser.image).toEqual(newUser.image)
    expect(storedUser.user).toEqual(newUser.user)
    expect(storedUser.userType).toEqual(newUser.userType)
  });


  it('update should modify a User', async () => {
    const user: UserEntity = usersList[0];
    user.name = "New name";
    user.email = "New imail";
    const updatedUser: UserEntity = await service.update(user.id, user);
    expect(updatedUser).not.toBeNull();

    const storedUser: UserEntity = await repository.findOne({ where: { id: user.id } })
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toEqual(updatedUser.name)
    expect(storedUser.email).toEqual(updatedUser.email)
  });


  it('update should throw an exception for an invalid User', async () => {
    let user: UserEntity = usersList[0];
    user = {
      ...user, name: "New name", email: "New email"
    }
    await expect(() => service.update("0", user)).rejects.toHaveProperty("message", "The user with the given id was not found")
  });


  it('delete should remove a User', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);
     const deletedUser: UserEntity = await repository.findOne({ where: { id: user.id } })
    expect(deletedUser).toBeNull();
  });

  it('delete should throw an exception for an invalid User', async () => {
    const user: UserEntity = usersList[0];
    await repository.delete(user.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The user with the given id was not found")
  });
});
