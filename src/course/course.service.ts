/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CourseEntity } from './course.entity';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>
    ){}

    async findAll():Promise<CourseEntity[]>{
        return await this.courseRepository.find({relations:["university","users","notes"]});
    }

    async findOne(id:string):Promise<CourseEntity>{
        const course: CourseEntity = await this.courseRepository.findOne({where:{id},relations:["university","users","notes"]});
        if(!course)
            throw new BusinessLogicException("The course with the given id was not found",BusinessError.NOT_FOUND);
        return course;
    }

    async findCourseByName(name:string):Promise<CourseEntity>{
        const course: CourseEntity = await this.courseRepository.findOne({where:{name:name},relations:["university","users","notes"]});
        if(!course)
            throw new BusinessLogicException("The course with the given name was not found",BusinessError.NOT_FOUND);
        return course;
    }

    async create(course:CourseEntity):Promise<CourseEntity>{
        return await this.courseRepository.save(course);
    }

    async update(id:string,course:CourseEntity):Promise<CourseEntity>{
        const persistedCourse: CourseEntity = await this.courseRepository.findOne({where:{id}});
        if(!persistedCourse)
            throw new BusinessLogicException("The course with the given id was not found",BusinessError.NOT_FOUND);
        return await this.courseRepository.save({...persistedCourse,...course});
    }

    async delete(id:string):Promise<CourseEntity>{
        const course:CourseEntity= await this.courseRepository.findOne({where:{id}});
        if(!course)
            throw new BusinessLogicException("The course with the given id was not found",BusinessError.NOT_FOUND);

        return await this.courseRepository.remove(course);
    }


}
