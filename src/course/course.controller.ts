
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseDto } from './course-dto';
import { plainToInstance } from 'class-transformer';
import { CourseEntity } from './course.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('course')
export class CourseController {
    constructor(private readonly courseService : CourseService){}

  
    @Public()
    @Get()
    async findAll(){
        return await this.courseService.findAll();
    }

   
    @Get(':courseId')
    async findOne(@Param('courseId') courseId : string){
        return await this.courseService.findOne(courseId);
    }

    
    @Get(':courseId/name')
    async findCourseByName(@Param('courseId') courseId : string){
        return await this.courseService.findCourseByName(courseId);
    }
    

    
    @Post()
    async create(@Body() courseDto:CourseDto){
        const course: CourseEntity = plainToInstance(CourseEntity, courseDto);
        return await this.courseService.create(course);
    }

   
    @Put(':courseId')
    async update(@Param('courseId') courseId : string, @Body() courseDto : CourseDto){
        const course : CourseEntity = plainToInstance(CourseEntity,courseDto);
        return await this.courseService.update(courseId,course);
    }

    
    @Delete(':courseId')
    @HttpCode(204)
    async delete(@Param(':courseId') courseId : string){
        return await this.courseService.delete(courseId)
    }


}
