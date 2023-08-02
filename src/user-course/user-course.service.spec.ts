import { Test, TestingModule } from '@nestjs/testing';
import { UserCourseService } from './user-course.service';
import { UserEntity } from '../user/user.entity';
import { CourseEntity } from '../course/course.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UserCourseService', () => {
  let service: UserCourseService;
  let UserRepository: Repository<UserEntity>;
  let courseRepository: Repository<CourseEntity>;
  let User: UserEntity;
  //let Course: CourseEntity;
  let coursesList : CourseEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserCourseService],
    }).compile();

    service = module.get<UserCourseService>(UserCourseService);
    UserRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    courseRepository = module.get<Repository<CourseEntity>>(getRepositoryToken(CourseEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    courseRepository.clear();
    UserRepository.clear();

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

    User = await UserRepository.save({
      name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.imageUrl(),
        user: faker.name.prefix(),
        userType: "student",
        courses:coursesList,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addcourseUser should add an course to a User', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    const newUser: UserEntity = await UserRepository.save({
      name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.imageUrl(),
        user: faker.name.prefix(),
        userType: "student",
    })

    const result: UserEntity = await service.addCourseUser(newUser.id, newCourse.id);
    
    expect(result.courses.length).toBe(1);
    expect(result.courses[0]).not.toBeNull();
    expect(result.courses[0].name).toBe(newCourse.name)
    expect(result.courses[0].section).toBe(newCourse.section)
    expect(result.courses[0].code).toBe(newCourse.code)
    expect(result.courses[0].department).toBe(newCourse.department)
  });

  it('addcourseUser should thrown exception for an invalid course', async () => {
    const newUser: UserEntity = await UserRepository.save({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.imageUrl(),
        user: faker.name.prefix(),
        userType: "student"
    })

    await expect(() => service.addCourseUser(newUser.id, "0")).rejects.toHaveProperty("message", "The course with the given id was not found");
  });

  it('addcourseUser should throw an exception for an invalid User', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    await expect(() => service.addCourseUser("0", newCourse.id)).rejects.toHaveProperty("message", "The User with the given id was not found");
  });

  it('findcourseByUserIdcourseId should return course by User', async () => {
    const course: CourseEntity = coursesList[0];
    const storedcourse: CourseEntity = await service.findCourseByUserIdCourseId(User.id, course.id, )
    expect(storedcourse).not.toBeNull();
    expect(storedcourse.name).toBe(course.name);
    expect(storedcourse.section).toBe(course.section);
    expect(storedcourse.code).toBe(course.code);
    expect(storedcourse.department).toBe(course.department);
  });

  it('findcourseByUserIdcourseId should throw an exception for an invalid course', async () => {
    await expect(()=> service.findCourseByUserIdCourseId(User.id, "0")).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('findcourseByUserIdcourseId should throw an exception for an invalid User', async () => {
    const course: CourseEntity = coursesList[0]; 
    await expect(()=> service.findCourseByUserIdCourseId("0", course.id)).rejects.toHaveProperty("message", "The User with the given id was not found"); 
  });

  it('findcourseByUserIdcourseId should throw an exception for an course not associated to the User', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    await expect(()=> service.findCourseByUserIdCourseId(User.id, newCourse.id)).rejects.toHaveProperty("message", "The course with the given id is not associated to the User"); 
  });

  it('findCoursesByUserId should return courses by User', async ()=>{
    const courses: CourseEntity[] = await service.findCoursesByUserId(User.id);
    expect(courses.length).toBe(5)
  });

  it('findCoursesByUserId should throw an exception for an invalid User', async () => {
    await expect(()=> service.findCoursesByUserId("0")).rejects.toHaveProperty("message", "The User with the given id was not found"); 
  });

  it('associatecoursesUser should update courses list for a User', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    const updatedUser: UserEntity = await service.associateCoursesUser(User.id, [newCourse]);
    expect(updatedUser.courses.length).toBe(1);

    expect(updatedUser.courses[0].name).toBe(newCourse.name);
    expect(updatedUser.courses[0].section).toBe(newCourse.section);
    expect(updatedUser.courses[0].code).toBe(newCourse.code);
    expect(updatedUser.courses[0].department).toBe(newCourse.department);
  });

  it('associatecoursesUser should throw an exception for an invalid User', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    await expect(()=> service.associateCoursesUser("0", [newCourse])).rejects.toHaveProperty("message", "The User with the given id was not found"); 
  });

  it('associatecoursesUser should throw an exception for an invalid course', async () => {
    const newCourse: CourseEntity = coursesList[0];
    newCourse.id = "0";

    await expect(()=> service.associateCoursesUser(User.id, [newCourse])).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('deletecourseToUser should remove an course from a User', async () => {
    const course: CourseEntity = coursesList[0];
    
    await service.deleteCourseUser(User.id, course.id);

    const storedUser: UserEntity = await UserRepository.findOne({where: {id: User.id}, relations: ["courses"]});
    const deletedcourse: CourseEntity = storedUser.courses.find(a => a.id === course.id);

    expect(deletedcourse).toBeUndefined();

  });

  it('deleteCourseToUser should thrown an exception for an invalid course', async () => {
    await expect(()=> service.deleteCourseUser(User.id, "0")).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('deletecourseToUser should thrown an exception for an invalid User', async () => {
    const course: CourseEntity = coursesList[0];
    await expect(()=> service.deleteCourseUser("0", course.id)).rejects.toHaveProperty("message", "The User with the given id was not found"); 
  });

  it('deleteCourseToUser should thrown an exception for an non asocciated course', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(), 
      section: faker.lorem.sentence(),
      code: faker.lorem.sentence(),
      department: faker.lorem.sentence(),
    });

    await expect(()=> service.deleteCourseUser(User.id, newCourse.id)).rejects.toHaveProperty("message", "The course with the given id is not associated to the User"); 
  }); 

});
