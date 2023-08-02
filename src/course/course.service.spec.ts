import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { CourseEntity } from './course.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UniversityEntity } from '../university/university.entity';

describe('CourseService', () => {
  let service: CourseService;
  let repository : Repository<CourseEntity>;
  let coursesList : CourseEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CourseService],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get<Repository<CourseEntity>>(getRepositoryToken(CourseEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    coursesList = [];
    for(let i = 0; i < 5; i++){
        const course: CourseEntity = await repository.save({
          name: faker.company.name(),
          section: faker.lorem.sentence(),
          code: faker.address.zipCode(),
          department: faker.address.city()})
        coursesList.push(course);
    }
  }

  it('findAll should return all courses', async () => {
    const courses: CourseEntity[] = await service.findAll();
    expect(courses).not.toBeNull();
    expect(courses).toHaveLength(coursesList.length);
  });

  it('findOne should return a course by id', async () => {

    const storedCourse : CourseEntity = coursesList[0];
    const course : CourseEntity = await service.findOne(storedCourse.id)
    expect(course).not.toBeNull();
    expect(course.name).toEqual(storedCourse.name)
    expect(course.section).toEqual(storedCourse.section)
    expect(course.code).toEqual(storedCourse.code)
    expect(course.department).toEqual(storedCourse.department)
  });

  it('findOne should throw an exception telling the course id doesnt exist', async () =>{

    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The course with the given id was not found")

  });

  it('create should create a new course', async () => {
    const course: CourseEntity = {
      id:"",
      name: faker.company.name(),
      section: faker.lorem.sentence(),
      code: faker.address.zipCode(),
      department: faker.address.city(),
      users: [],
      notes: [],
      university: new UniversityEntity()

    }
    const createdCourse: CourseEntity = await service.create(course);
    expect(createdCourse).not.toBeNull();
    expect(createdCourse.name).toEqual(course.name);
    expect(createdCourse.section).toEqual(course.section);
    expect(createdCourse.code).toEqual(course.code);
    expect(createdCourse.department).toEqual(course.department);
  });

  it('update should modify a course', async () => {
    const course: CourseEntity = coursesList[0];
    course.name = "New name";
    course.section = "New section";
     const updatedCourse: CourseEntity = await service.update(course.id, course);
    expect(updatedCourse).not.toBeNull();
     const storedCourse: CourseEntity = await repository.findOne({ where: { id: course.id } })
    expect(storedCourse).not.toBeNull();
    expect(storedCourse.name).toEqual(course.name)
    expect(storedCourse.section).toEqual(course.section)
    expect(storedCourse.code).toEqual(course.code)
    expect(storedCourse.department).toEqual(course.department)
  });

  it('update should throw an error of an invalid course', async() =>{
    let course : CourseEntity = coursesList[0];
    course = {
      ...course, name: "New name", section: "New section"
    }
    await expect(() => service.update("0", course)).rejects.toHaveProperty("message", "The course with the given id was not found")
  })


  it('delete should remove a course', async() =>{

    const course : CourseEntity = coursesList[0];
    await service.delete(course.id);
    const deletedCourse: CourseEntity = await repository.findOne({ where: { id: course.id } })
    expect(deletedCourse).toBeNull();
  });

  it('delete should throw an exception for an invalid museum', async () => {
    const course: CourseEntity = coursesList[0];
    await service.delete(course.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The course with the given id was not found")
  });

});
