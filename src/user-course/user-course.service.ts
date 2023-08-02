import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from '../course/course.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserCourseService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly UserRepository : Repository<UserEntity>,

        @InjectRepository(CourseEntity)
        private readonly CourseRepository : Repository<CourseEntity>

    ){}

    async addCourseUser(Userid: string, courseid: string): Promise<UserEntity> {
        const course: CourseEntity = await this.CourseRepository.findOne({where: {id: courseid}});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND);
      
        const User: UserEntity = await this.UserRepository.findOne({where: {id: Userid}, relations: ["comments", "university", "friends", "notes", "courses"]})
        if (!User)
          throw new BusinessLogicException("The User with the given id was not found", BusinessError.NOT_FOUND);
    
          User.courses = [...User.courses, course];
        return await this.UserRepository.save(User);
      }

      async findCourseByUserIdCourseId(courseid: string, courseId: string): Promise<CourseEntity> {
        const course: CourseEntity = await this.CourseRepository.findOne({where: {id: courseId}});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
        
        const User: UserEntity = await this.UserRepository.findOne({where: {id: courseid}, relations: ["courses"]}); 
        if (!User)
          throw new BusinessLogicException("The User with the given id was not found", BusinessError.NOT_FOUND)
    
        const Usercourse: CourseEntity = User.courses.find(e => e.id === course.id);
    
        if (!Usercourse)
          throw new BusinessLogicException("The course with the given id is not associated to the User", BusinessError.PRECONDITION_FAILED)
    
        return Usercourse;
    }
     
    async findCoursesByUserId(UserId: string): Promise<CourseEntity[]> {
        const User: UserEntity = await this.UserRepository.findOne({where: {id: UserId}, relations: ["courses"]});
        if (!User)
          throw new BusinessLogicException("The User with the given id was not found", BusinessError.NOT_FOUND)
        
        return User.courses;
    }


     
    async associateCoursesUser(courseid: string, courses: CourseEntity[]): Promise<UserEntity> {
        const User: UserEntity = await this.UserRepository.findOne({where: {id: courseid}, relations: ["courses"]});
     
        if (!User)
          throw new BusinessLogicException("The User with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < courses.length; i++) {
          const course: CourseEntity = await this.CourseRepository.findOne({where: {id: courses[i].id}});
          if (!course)
            throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        User.courses = courses;
        return await this.UserRepository.save(User);
      }
     
    async deleteCourseUser(courseid: string, courseId: string){
        const course: CourseEntity = await this.CourseRepository.findOne({where: {id: courseId}});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
     
        const User: UserEntity = await this.UserRepository.findOne({where: {id: courseid}, relations: ["courses"]});
        if (!User)
          throw new BusinessLogicException("The User with the given id was not found", BusinessError.NOT_FOUND)
     
        const Usercourse: CourseEntity = User.courses.find(e => e.id === course.id);
     
        if (!Usercourse)
            throw new BusinessLogicException("The course with the given id is not associated to the User", BusinessError.PRECONDITION_FAILED)

        User.courses = User.courses.filter(e => e.id !== courseId);
        await this.UserRepository.save(User);
    }   
}
