import { Test, TestingModule } from '@nestjs/testing';
import { UniversityCourseService } from './university-course.service';
import { UniversityEntity } from '../university/university.entity';
import { CourseEntity } from '../course/course.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UniversityCourseService', () => {
  let service: UniversityCourseService;
  let universityRepository: Repository<UniversityEntity>;
  let courseRepository: Repository<CourseEntity>;
  let university: UniversityEntity;
  let coursesList : CourseEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UniversityCourseService],
    }).compile();

    service = module.get<UniversityCourseService>(UniversityCourseService);
    universityRepository = module.get<Repository<UniversityEntity>>(getRepositoryToken(UniversityEntity));
    courseRepository = module.get<Repository<CourseEntity>>(getRepositoryToken(CourseEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    courseRepository.clear();
    universityRepository.clear();

    coursesList = [];
    for(let i = 0; i < 5; i++){
      const course: CourseEntity = await courseRepository.save({
        name: faker.company.name(), 
        section: faker.lorem.sentence(),
        code: faker.lorem.sentence(),
        department: faker.lorem.sentence(),
        })
        coursesList.push(course);
    }

    university = await universityRepository.save({
      name: faker.company.name(), 
      description: faker.lorem.sentence(), 
      country: faker.address.country(), 
      address: faker.address.secondaryAddress(), 
      image: faker.image.imageUrl(),
      courses: coursesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addcourseuniversity should add an course to a university', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    const newUniversity: UniversityEntity = await universityRepository.save({
      name: faker.company.name(), 
      description: faker.lorem.sentence(), 
      country: faker.address.country(), 
      address: faker.address.secondaryAddress(), 
      image: faker.image.imageUrl(),
    })

    const result: UniversityEntity = await service.addCourseUniversity(newUniversity.id, newCourse.id);
    
    expect(result.courses.length).toBe(1);
    expect(result.courses[0]).not.toBeNull();
    expect(result.courses[0].name).toBe(newCourse.name)
    expect(result.courses[0].section).toBe(newCourse.section)
    expect(result.courses[0].code).toBe(newCourse.code)
    expect(result.courses[0].department).toBe(newCourse.department)
  });

  it('addcourseuniversity should thrown exception for an invalid course', async () => {
    const newUniversity: UniversityEntity = await universityRepository.save({
      name: faker.company.name(), 
      description: faker.lorem.sentence(), 
      country: faker.address.country(), 
      address: faker.address.secondaryAddress(), 
      image: faker.image.imageUrl(),
    })

    await expect(() => service.addCourseUniversity(newUniversity.id, "0")).rejects.toHaveProperty("message", "The course with the given id was not found");
  });

  it('addcourseuniversity should throw an exception for an invalid university', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    await expect(() => service.addCourseUniversity("0", newCourse.id)).rejects.toHaveProperty("message", "The university with the given id was not found");
  });

  it('findcourseByuniversityIdcourseId should return course by university', async () => {
    const course: CourseEntity = coursesList[0];
    const storedCourse: CourseEntity = await service.findCourseByUniversityIdCourseId(university.id, course.id, )
    expect(storedCourse).not.toBeNull();
    expect(storedCourse.name).toBe(course.name);
    expect(storedCourse.section).toBe(course.section);
    expect(storedCourse.code).toBe(course.code);
    expect(storedCourse.department).toBe(course.department);
  });

  it('findCourseByUniversityIdCourseId should throw an exception for an invalid course', async () => {
    await expect(()=> service.findCourseByUniversityIdCourseId(university.id, "0")).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('findCourseByUniversityIdCourseId should throw an exception for an invalid university', async () => {
    const course: CourseEntity = coursesList[0]; 
    await expect(()=> service.findCourseByUniversityIdCourseId("0", course.id)).rejects.toHaveProperty("message", "The university with the given id was not found"); 
  });

  it('findCourseByUniversityIdCourseId should throw an exception for an course not associated to the university', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    await expect(()=> service.findCourseByUniversityIdCourseId(university.id, newCourse.id)).rejects.toHaveProperty("message", "The course with the given id is not associated to the university"); 
  });

  it('findCoursesByUniversityId should return courses by university', async ()=>{
    const courses: CourseEntity[] = await service.findCoursesByUniversityId(university.id);
    expect(courses.length).toBe(5)
  });

  it('findCoursesByUniversityId should throw an exception for an invalid university', async () => {
    await expect(()=> service.findCoursesByUniversityId("0")).rejects.toHaveProperty("message", "The university with the given id was not found"); 
  });

  it('associateCoursesUniversity should update courses list for a university', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    const updateduniversity: UniversityEntity = await service.associateCoursesUniversity(university.id, [newCourse]);
    expect(updateduniversity.courses.length).toBe(1);

    expect(updateduniversity.courses[0].name).toBe(newCourse.name);
    expect(updateduniversity.courses[0].section).toBe(newCourse.section);
    expect(updateduniversity.courses[0].code).toBe(newCourse.code);
    expect(updateduniversity.courses[0].department).toBe(newCourse.department);
  });

  it('associatecoursesuniversity should throw an exception for an invalid university', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    await expect(()=> service.associateCoursesUniversity("0", [newCourse])).rejects.toHaveProperty("message", "The university with the given id was not found"); 
  });

  it('associatecoursesuniversity should throw an exception for an invalid course', async () => {
    const newCourse: CourseEntity = coursesList[0];
    newCourse.id = "0";

    await expect(()=> service.associateCoursesUniversity(university.id, [newCourse])).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('deletecourseTouniversity should remove an course from a university', async () => {
    const course: CourseEntity = coursesList[0];
    
    await service.deleteCourseUniversity(university.id, course.id);

    const storeduniversity: UniversityEntity = await universityRepository.findOne({where: {id: university.id}, relations: ["courses"]});
    const deletedcourse: CourseEntity = storeduniversity.courses.find(a => a.id === course.id);

    expect(deletedcourse).toBeUndefined();

  });

  it('deleteCourseToUniversity should thrown an exception for an invalid course', async () => {
    await expect(()=> service.deleteCourseUniversity(university.id, "0")).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('deletecourseTouniversity should thrown an exception for an invalid university', async () => {
    const course: CourseEntity = coursesList[0];
    await expect(()=> service.deleteCourseUniversity("0", course.id)).rejects.toHaveProperty("message", "The university with the given id was not found"); 
  });

  it('deleteCourseToUniversity should thrown an exception for an non asocciated course', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    await expect(()=> service.deleteCourseUniversity(university.id, newCourse.id)).rejects.toHaveProperty("message", "The course with the given id is not associated to the university"); 
  }); 

});
