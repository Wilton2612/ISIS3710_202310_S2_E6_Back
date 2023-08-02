import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityEntity } from './university.entity';
import { UniversityDto } from './university.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('university')
@UseInterceptors(BusinessErrorsInterceptor)
export class UniversityController {
    constructor(private readonly universityService : UniversityService){}

    
    @Get()
    async findAll() {
      return await this.universityService.findAll();
    }


    @Get(':universityId')
    async findOne(@Param('universityId') universityId: string) {
      return await this.universityService.findOne(universityId);
    }
    
    
   
    @Post()
    async create(@Body() universityDto: UniversityDto) {
      const university: UniversityEntity = plainToInstance(UniversityEntity, universityDto);
      return await this.universityService.create(university);
    }
    
    
    @Put(':universityId')
    async update(@Param('universityId') universityId: string, @Body() universityDto: UniversityDto) {
      const university: UniversityEntity = plainToInstance(UniversityEntity, universityDto);
      return await this.universityService.update(universityId, university);
    }
    
  
    @Delete(':universityId')
    @HttpCode(204)
    async delete(@Param('universityId') universityId: string) {
      return await this.universityService.delete(universityId);
    }
}
