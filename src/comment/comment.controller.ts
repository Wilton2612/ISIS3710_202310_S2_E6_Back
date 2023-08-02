/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CommentDto } from './comment.dto';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('Comments')
@UseInterceptors(BusinessErrorsInterceptor)
export class CommentController {
    constructor(private readonly CommentService: CommentService) {}


  @Get()
  async findAll() {
    return await this.CommentService.findAll();
  }

  @Get(':CommentId')
  async findOne(@Param('CommentId') CommentId: number) {
    return await this.CommentService.findOne(CommentId);
  }

 
  @Post()
  async create(@Body() CommentDto: CommentDto) {
    const Comment: CommentEntity = plainToInstance(CommentEntity, CommentDto);
    return await this.CommentService.create(Comment);
  }


  @Put(':CommentId')
  async update(@Param('CommentId') CommentId: number, @Body() CommentDto: CommentDto) {
    const Comment: CommentEntity = plainToInstance(CommentEntity, CommentDto);
    return await this.CommentService.update( CommentId, Comment);
  }

  
  @Delete(':CommentId')
  @HttpCode(204)
  async delete(@Param('CommentId') CommentId: number) {
    return await this.CommentService.delete(CommentId);

}

}