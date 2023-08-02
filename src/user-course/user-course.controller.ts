import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserCourseService } from './user-course.service';
import { CourseEntity } from 'src/course/course.entity';
import { plainToInstance } from 'class-transformer';
import { CourseDto } from '../course/course-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('User-course')
export class UserCourseController {
    constructor(private readonly UserCourseService: UserCourseService){}


    @Post(':UserId/users/:userId')
   async addCourseUser(@Param('UserId') UserId: string, @Param('CourseId') CourseId: string){
       return await this.UserCourseService.addCourseUser(UserId, CourseId);
   }

 
   @Get(':UserId/courses/:courseId')
   async findCourseByUserIdCourseId(@Param('UserId') UserId: string, @Param('CourseId') CourseId: string){
       return await this.UserCourseService.findCourseByUserIdCourseId(UserId, CourseId);
   }


   @Get(':UserId/courses')
   async findCoursesByUserId(@Param('UserId') UserId: string){
       return await this.UserCourseService.findCoursesByUserId(UserId);
   }

   
   @Put(':UserId/courses')
   async associateCoursesUser(@Body() coursesDto: CourseDto[], @Param('UserId') UserId: string){
       const courses = plainToInstance(CourseEntity, coursesDto)
       return await this.UserCourseService.associateCoursesUser(UserId, courses);
   }

    @Delete(':UserId/courses/:courseId')
    @HttpCode(204)
    async deleteCourseUser(@Param('UserId') UserId: string, @Param('CourseId') courseId: string){
       return await this.UserCourseService.deleteCourseUser(UserId, courseId);
    }

}
