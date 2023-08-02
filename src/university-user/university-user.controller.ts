import { Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { UniversityUserService } from '../university-user/university-user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('universities')
export class UniversityUserController {
    constructor(private readonly universityUserService : UniversityUserService){}

   
    @Post(':universityId/users/:userId')
   async addArtworkMuseum(@Param('universityId') universityId: string, @Param('userId') userId: string){
       return await this.universityUserService.addUserUniversity(universityId, userId);
   }

  
   @Get(':universityId/users/:userId')
   async findCourseByUniversityIdCourseId(@Param('universityId') universityId: string, @Param('userId') userId: string){
       return await this.universityUserService.findUserByUniversityIdUserId(universityId, userId);
   }

   
   @Get(':universityId/users')
   async findCoursesByUniversityId(@Param('universityId') universityId: string){
       return await this.universityUserService.findUsersByUniversityId(universityId);
   }

   
   @Delete(':universityId/users/:userId')
   @HttpCode(204)
   async deleteUserUniversity(@Param('universityId') universityId: string, @Param('userId') userId: string){
       return await this.universityUserService.deleteUserUniversity(universityId, userId);
   }
}
