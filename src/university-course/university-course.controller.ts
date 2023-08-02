import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UniversityCourseService } from './university-course.service';
import { CourseEntity } from '../course/course.entity';
import { plainToInstance } from 'class-transformer';
import { CourseDto } from '../course/course-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('universities')
export class UniversityCourseController {
    constructor(private readonly universityCourseService: UniversityCourseService){}

    
    @Post(':universityId/courses/:courseId')
   async addCourseUniversity(@Param('universityId') universityId: string, @Param('courseId') courseId: string){
       return await this.universityCourseService.addCourseUniversity(universityId, courseId);
   }


   @Get(':universityId/courses/:courseId')
   async findCourseByUniversityIdCourseId(@Param('universityId') universityId: string, @Param('courseId') courseId: string){
       return await this.universityCourseService.findCourseByUniversityIdCourseId(universityId, courseId);
   }


  
   @Get(':universityId/courses')
   async findCoursesByUniversityId(@Param('universityId') universityId: string){
       return await this.universityCourseService.findCoursesByUniversityId(universityId);
   }

 
   @Put(':universityId/courses')
   async associateCoursesUniversity(@Body() coursesDto: CourseDto[], @Param('universityId') universityId: string){
       const courses = plainToInstance(CourseEntity, coursesDto)
       return await this.universityCourseService.associateCoursesUniversity(universityId, courses);
   }

   
   @Delete(':universityId/courses/:courseId')
    @HttpCode(204)
   async deleteCourseUniversity(@Param('universityId') universityId: string, @Param('courseId') courseId: string){
       return await this.universityCourseService.deleteCourseUniversity(universityId, courseId);
   }

}
