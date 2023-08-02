import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { UserUserService } from './user-user.service';

describe('UserUserService', () => {
  let service: UserUserService;
  let repository: Repository<UserEntity>;
  let user: UserEntity;
  let friendsList : UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserUserService],
    }).compile();

    service = module.get<UserUserService>(UserUserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();

    friendsList = [];
    for(let i = 0; i < 5; i++){
        const friend: UserEntity = await repository.save({
          name: faker.name.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          image: faker.image.imageUrl(),
          user: faker.name.prefix(),
          userType: "student"
        })
          friendsList.push(friend);
    }

    user = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student",
      friends: friendsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addFriendUser should add a friend to a user', async () => {
    const friend: UserEntity = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    const newUser: UserEntity = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    const result: UserEntity = await service.addFriendUser(newUser.id, friend.id);
    
    expect(result.friends.length).toBe(1);
    expect(result.friends[0]).not.toBeNull();
    expect(result.friends[0].name).toBe(friend.name)
    expect(result.friends[0].email).toBe(friend.email)
    expect(result.friends[0].password).toBe(friend.password)
    expect(result.friends[0].image).toBe(friend.image)
    expect(result.friends[0].userType).toBe(friend.userType)
  });

  it('addFriendUser should thrown exception for an invalid friend', async () => {
    const newUser: UserEntity = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    await expect(() => service.addFriendUser(newUser.id, "0")).rejects.toHaveProperty("message", "The friend with the given id was not found");
  });

  it('addFriendUser should throw an exception for an invalid museum', async () => {
    const newUser: UserEntity = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    await expect(() => service.addFriendUser("0", newUser.id)).rejects.toHaveProperty("message", "The user with the given id was not found");
  });

  it('findFriendByUserIdFriendId should return friend by user', async () => {
    const friend: UserEntity = friendsList[0];
    const storedFriend: UserEntity = await service.findFriendByUserIdFriendId(user.id, friend.id, )
    expect(storedFriend).not.toBeNull();
    expect(storedFriend.name).toBe(friend.name);
    expect(storedFriend.email).toBe(friend.email);
    expect(storedFriend.password).toBe(friend.password);
    expect(storedFriend.image).toBe(friend.image);
    expect(storedFriend.user).toBe(friend.user);
    expect(storedFriend.userType).toBe(friend.userType);
  });

  it('findFriendByUserIdFriendId should throw an exception for an invalid friend', async () => {
    await expect(()=> service.findFriendByUserIdFriendId(user.id, "0")).rejects.toHaveProperty("message", "The friend with the given id was not found"); 
  });

  it('findFriendByUserIdFriendId should throw an exception for an invalid user', async () => {
    const friend: UserEntity = friendsList[0]; 
    await expect(()=> service.findFriendByUserIdFriendId("0", friend.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('findFriendByUserIdFriendId should throw an exception for a friend not associated to the user', async () => {
    const newFriend: UserEntity = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    await expect(()=> service.findFriendByUserIdFriendId(user.id, newFriend.id)).rejects.toHaveProperty("message", "The friend with the given id is not associated to the user"); 
  });

  it('findFriendsByUserId should return artworks by museum', async ()=>{
    const friends: UserEntity[] = await service.findFriendsByUserId(user.id);
    expect(friends.length).toBe(5)
  });

  it('findFriendsByUserId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findFriendsByUserId("0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateFriendsUser should update friends list for a user', async () => {
    const newFriend: UserEntity = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    const updatedUser: UserEntity = await service.associateFriendsUser(user.id, [newFriend]);
    expect(updatedUser.friends.length).toBe(1);

    expect(updatedUser.friends[0].name).toBe(newFriend.name);
    expect(updatedUser.friends[0].email).toBe(newFriend.email);
    expect(updatedUser.friends[0].password).toBe(newFriend.password);
    expect(updatedUser.friends[0].image).toBe(newFriend.image);
    expect(updatedUser.friends[0].user).toBe(newFriend.user);
    expect(updatedUser.friends[0].userType).toBe(newFriend.userType);
  });

  it('associateFriendsUser should throw an exception for an invalid user', async () => {
    const newFriend: UserEntity = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    await expect(()=> service.associateFriendsUser("0", [newFriend])).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateFriendsUser should throw an exception for an invalid friend', async () => {
    const newFriend: UserEntity = friendsList[0];
    newFriend.id = "0";

    await expect(()=> service.associateFriendsUser(user.id, [newFriend])).rejects.toHaveProperty("message", "The friend with the given id was not found"); 
  });

  it('deleteFriendUser should remove an friend from a user', async () => {
    const friend: UserEntity = friendsList[0];
    
    await service.deleteFriendUser(user.id, friend.id);

    const storedUser: UserEntity = await repository.findOne({where: {id: user.id}, relations: ["friends"]});
    const deletedFriend: UserEntity = storedUser.friends.find(a => a.id === friend.id);

    expect(deletedFriend).toBeUndefined();

  });

  it('deleteFriendUser should thrown an exception for an invalid friend', async () => {
    await expect(()=> service.deleteFriendUser(user.id, "0")).rejects.toHaveProperty("message", "The friend with the given id was not found"); 
  });

  it('deleteFriendUser should thrown an exception for an invalid user', async () => {
    const friend: UserEntity = friendsList[0];
    await expect(()=> service.deleteFriendUser("0", friend.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('deleteFriendUser should thrown an exception for an non asocciated artwork', async () => {
    const newFriend: UserEntity = await repository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    await expect(()=> service.deleteFriendUser(user.id, newFriend.id)).rejects.toHaveProperty("message", "The friend with the given id is not associated to the user"); 
  }); 

});
