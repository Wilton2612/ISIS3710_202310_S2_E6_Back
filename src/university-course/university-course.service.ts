import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from '../course/course.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { UniversityEntity } from '../university/university.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UniversityCourseService {
    constructor(
        @InjectRepository(UniversityEntity)
        private readonly universityRepository : Repository<UniversityEntity>,

        @InjectRepository(CourseEntity)
        private readonly courseRepository : Repository<CourseEntity>

    ){}

    async addCourseUniversity(universityId: string, courseId: string): Promise<UniversityEntity> {
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courseId}});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND);
      
        const university: UniversityEntity = await this.universityRepository.findOne({where: {id: universityId}, relations: ["courses", "users"]})
        if (!university)
          throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND);
    
          university.courses = [...university.courses, course];
        return await this.universityRepository.save(university);
      }

      async findCourseByUniversityIdCourseId(courseid: string, courseId: string): Promise<CourseEntity> {
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courseId}});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
        
        const university: UniversityEntity = await this.universityRepository.findOne({where: {id: courseid}, relations: ["courses"]}); 
        if (!university)
          throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND)
    
        const universitycourse: CourseEntity = university.courses.find(e => e.id === course.id);
    
        if (!universitycourse)
          throw new BusinessLogicException("The course with the given id is not associated to the university", BusinessError.PRECONDITION_FAILED)
    
        return universitycourse;
    }
     
    async findCoursesByUniversityId(courseid: string): Promise<CourseEntity[]> {
        const university: UniversityEntity = await this.universityRepository.findOne({where: {id: courseid}, relations: ["courses"]});
        if (!university)
          throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND)
        
        return university.courses;
    }
     
    async associateCoursesUniversity(universityId: string, courses: CourseEntity[]): Promise<UniversityEntity> {
      const university: UniversityEntity = await this.universityRepository.findOne({where: {id: universityId}, relations: ["courses"]});
  
      if (!university)
        throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND)
  
      for (let i = 0; i < courses.length; i++) {
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courses[i].id}});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
      }
  
      university.courses = courses;
      return await this.universityRepository.save(university);
    }
     
    async deleteCourseUniversity(courseid: string, courseId: string){
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courseId}});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
     
        const university: UniversityEntity = await this.universityRepository.findOne({where: {id: courseid}, relations: ["courses"]});
        if (!university)
          throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND)
     
        const universitycourse: CourseEntity = university.courses.find(e => e.id === course.id);
     
        if (!universitycourse)
            throw new BusinessLogicException("The course with the given id is not associated to the university", BusinessError.PRECONDITION_FAILED)

        university.courses = university.courses.filter(e => e.id !== courseId);
        await this.universityRepository.save(university);
    }   
}
