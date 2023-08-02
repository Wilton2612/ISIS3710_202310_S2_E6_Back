/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UniversityEntity } from './university.entity';
import { UniversityService } from './university.service';
import { faker } from '@faker-js/faker';

describe('UniversityService', () => {
  let service: UniversityService;
  let repository: Repository<UniversityEntity>;
  let universitiesList : UniversityEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UniversityService],
    }).compile();

    service = module.get<UniversityService>(UniversityService);
    repository = module.get<Repository<UniversityEntity>>(getRepositoryToken(UniversityEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


const seedDatabase = async () => {
  repository.clear();
  universitiesList = [];
  for(let i = 0; i < 5; i++){
      const university: UniversityEntity = await repository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      country: faker.address.country(),
      address: faker.address.secondaryAddress(),
      image: faker.image.imageUrl()})
      universitiesList.push(university);
  }
}

it('findAll should return all universities', async () => {
  const universitites: UniversityEntity[] = await service.findAll();
  expect(universitites).not.toBeNull();
  expect(universitites).toHaveLength(universitiesList.length);

});

it('findOne should return a university by id', async () => {
  const storedUniversity: UniversityEntity = universitiesList[0];
  const university: UniversityEntity = await service.findOne(storedUniversity.id);
  expect(university).not.toBeNull();
  expect(university.name).toEqual(storedUniversity.name)
  expect(university.description).toEqual(storedUniversity.description)
  expect(university.country).toEqual(storedUniversity.country)
  expect(university.address).toEqual(storedUniversity.address)
  expect(university.image).toEqual(storedUniversity.image)
});


it('findOne should throw an exception for an invalid university', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The university with the given id was not found")
});

it('create should return a new university', async () => {
  const university: UniversityEntity = {
    id: "",
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    country: faker.address.country(),
    address: faker.address.secondaryAddress(),
    image: faker.image.imageUrl(),
    courses: [],
    users: []
  }

  const newUniversity: UniversityEntity = await service.create(university);
  expect(newUniversity).not.toBeNull();

  const storedUniversity: UniversityEntity = await repository.findOne({where: {id: newUniversity.id}})
  expect(storedUniversity).not.toBeNull();
  expect(storedUniversity.name).toEqual(newUniversity.name)
  expect(storedUniversity.description).toEqual(newUniversity.description)
  expect(storedUniversity.country).toEqual(newUniversity.country)
  expect(storedUniversity.address).toEqual(newUniversity.address)
  expect(storedUniversity.image).toEqual(newUniversity.image)
});

it('update should modify a university', async () => {
  const university: UniversityEntity = universitiesList[0];
  university.name = "New name";
  university.address = "New address";
  const updatedUniversity: UniversityEntity = await service.update(university.id, university);
  expect(updatedUniversity).not.toBeNull();
  const storedUniversity: UniversityEntity = await repository.findOne({ where: { id: university.id } })
  expect(storedUniversity).not.toBeNull();
  expect(storedUniversity.name).toEqual(university.name)
  expect(storedUniversity.address).toEqual(university.address)
});

it('update should throw an exception for an invalid university', async () => {
  let university: UniversityEntity = universitiesList[0];
  university = {
    ...university, name: "New name", address: "New address"
  }
  await expect(() => service.update("0", university)).rejects.toHaveProperty("message", "The university with the given id was not found")
});

it('delete should remove a university', async () => {
  const university: UniversityEntity = universitiesList[0];
  await service.delete(university.id);
   const deletedUniversity: UniversityEntity = await repository.findOne({ where: { id: university.id } })
  expect(deletedUniversity).toBeNull();
});


it('delete should throw an exception for an invalid university', async () => {

  const university: UniversityEntity = universitiesList[0];

  await repository.delete(university.id);

  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The university with the given id was not found")

});

});