import { Test, TestingModule } from '@nestjs/testing';
import { UniversityUserService } from './university-user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UniversityEntity } from '../university/university.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UniversityUserService', () => {
  let service: UniversityUserService;
  let userRepository : Repository<UserEntity>;
  let universityRepository : Repository<UniversityEntity>;
  let usersList : UserEntity[];
  let university : UniversityEntity;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UniversityUserService],
    }).compile();

    service = module.get<UniversityUserService>(UniversityUserService);
    universityRepository = module.get<Repository<UniversityEntity>>(getRepositoryToken(UniversityEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    userRepository.clear();
    universityRepository.clear();
 
    usersList = [];
    for(let i = 0; i < 5; i++){
        const user: UserEntity = await userRepository.save({
          name: faker.company.name(),
          email: faker.lorem.word(),
          password: faker.lorem.sentence(),
          user: faker.lorem.word(),
          image: faker.image.imageUrl(),
          userType: 'user'
        })
        usersList.push(user);
    }
    
    university = await universityRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      country: faker.address.country(),
      address: faker.address.secondaryAddress(),
      image: faker.image.imageUrl(),
      users: usersList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Metodos para las pruebas

  it('addUserUniversity should add an user to a university', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.company.name(),
      email: faker.lorem.word(),
      password: faker.lorem.sentence(),
      user: faker.lorem.word(),
      image: faker.image.imageUrl(),
      userType: 'user'
    });

    const newUniversity: UniversityEntity = await universityRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      country: faker.address.country(),
      address: faker.address.secondaryAddress(),
      image: faker.image.imageUrl(),
    })

    const result: UniversityEntity = await service.addUserUniversity(newUniversity.id, newUser.id);
   
    expect(result.users.length).toBe(1);
    expect(result.users[0]).not.toBeNull();
    expect(result.users[0].name).toBe(newUser.name)
    expect(result.users[0].email).toBe(newUser.email)
    expect(result.users[0].password).toBe(newUser.password)
    expect(result.users[0].image).toBe(newUser.image)
    expect(result.users[0].user).toBe(newUser.user)
  });


  it('addUserUniversity should thrown exception for an invalid user', async () => {
    const newuniversity: UniversityEntity = await universityRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      country: faker.address.country(),
      address: faker.address.secondaryAddress(),
      image: faker.image.imageUrl(),
    })

    await expect(() => service.addUserUniversity(newuniversity.id, "0")).rejects.toHaveProperty("message", "The user with the given id was not found");
  });


  it('addUserUniversity should throw an exception for an invalid university', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.company.name(),
      email: faker.lorem.word(),
      password: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
      user:faker.company.name(),
      userType: 'users'
    });

    await expect(() => service.addUserUniversity("0", newUser.id)).rejects.toHaveProperty("message", "The university with the given id was not found");
  });

  it('findUserByUniversityIdUserId should return user by university', async () => {
    const user: UserEntity = usersList[0];
    const storedUser: UserEntity = await service.findUserByUniversityIdUserId(university.id, user.id, )
    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toBe(user.name);
    expect(storedUser.email).toBe(user.email);
    expect(storedUser.password).toBe(user.password);
    expect(storedUser.image).toBe(user.image);
    expect(storedUser.user).toBe(user.user);
    expect(storedUser.userType).toBe(user.userType);
  });


  it('findUserByUniversityIdUserId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findUserByUniversityIdUserId(university.id, "0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });


  it('findUserByuniversityIdUserId should throw an exception for an invalid university', async () => {
    const user: UserEntity = usersList[0]; 
    await expect(()=> service.findUserByUniversityIdUserId("0", user.id)).rejects.toHaveProperty("message", "The university with the given id was not found"); 
  });


  it('findUserByUniversityIdUserId should throw an exception for an user not associated to the university', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.company.name(),
      email: faker.lorem.word(),
      password: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
      user:faker.company.name(),
      userType: 'users'
    });

    await expect(()=> service.findUserByUniversityIdUserId(university.id, newUser.id)).rejects.toHaveProperty("message", "The user with the given id is not associated to the university"); 
  });


  it('findUsersByuniversityId should return Users by university', async ()=>{
    const Users: UserEntity[] = await service.findUsersByUniversityId(university.id);
    expect(Users.length).toBe(5)
  });


  it('findUsersByuniversityId should throw an exception for an invalid university', async () => {
    await expect(()=> service.findUsersByUniversityId("0")).rejects.toHaveProperty("message", "The university with the given id was not found"); 
  });


  it('associateUsersUniversity should update Users list for a university', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.company.name(),
      email: faker.lorem.word(),
      password: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
      user:faker.company.name(),
      userType: 'users'
    });

    const updatedUniversity: UniversityEntity = await service.associateUsersUniversity(university.id, [newUser]);
    expect(updatedUniversity.users.length).toBe(1);
    expect(updatedUniversity.users[0].name).toBe(newUser.name);
    expect(updatedUniversity.users[0].email).toBe(newUser.email);
    expect(updatedUniversity.users[0].password).toBe(newUser.password);
    expect(updatedUniversity.users[0].user).toBe(newUser.user);
    expect(updatedUniversity.users[0].image).toBe(newUser.image);

  });

  it('associateUsersUniversity should throw an exception for an invalid university', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.company.name(),
      email: faker.lorem.word(),
      password: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
      user:faker.company.name(),
      userType: 'users'
    });

    await expect(()=> service.associateUsersUniversity("0", [newUser])).rejects.toHaveProperty("message", "The university with the given id was not found"); 
  });

  it('associateUsersUniversity should throw an exception for an invalid users', async () => {
    const newUser: UserEntity = usersList[0];
    newUser.id = "0";

    await expect(()=> service.associateUsersUniversity(university.id, [newUser])).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('deleteUserTouniversity should remove an users from a university', async () => {
    const users: UserEntity = usersList[0];
    
    await service.deleteUserUniversity(university.id, users.id);

    const storeduniversity: UniversityEntity = await universityRepository.findOne({where: {id: university.id}, relations: ["users"]});
    const deletedUser: UserEntity = storeduniversity.users.find(a => a.id === users.id);

    expect(deletedUser).toBeUndefined();

  });

  it('deleteUserTouniversity should thrown an exception for an invalid users', async () => {
    await expect(()=> service.deleteUserUniversity(university.id, "0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('deleteUserUniversity should thrown an exception for an invalid university', async () => {
    const users: UserEntity = usersList[0];
    await expect(()=> service.deleteUserUniversity("0",users.id)).rejects.toHaveProperty("message", "The university with the given id was not found"); 
  });

  it('deleteUserUniversity should thrown an exception for an non asocciated users', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.company.name(),
      email: faker.lorem.word(),
      password: faker.lorem.sentence(),
      image: faker.image.imageUrl(),
      user:faker.company.name(),
      userType: 'users'
    });

    await expect(()=> service.deleteUserUniversity(university.id, newUser.id)).rejects.toHaveProperty("message", "The user with the given id is not associated to the university"); 
  }); 

});

