import { Controller, UseInterceptors, Get, Param, Post, Put, Delete, HttpCode, Body, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NoteDto } from './note.dto';
import { NoteEntity } from './note.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notes')
@UseInterceptors(BusinessErrorsInterceptor)
export class NoteController {


    constructor(private readonly noteService: NoteService) {

    }

  
    @Get()
    async findAll() {
      return await this.noteService.findAll();
    }

    
    @Get(':noteId')
    async findOne(@Param('noteId') noteId: number) {
      return await this.noteService.findOne(noteId);
    }

   
    @Get('date/:date')
    async findNotesByDate(@Param('date') date: string) {
      return await this.noteService.findNotesByDate(date);
    }

    
    @Post()
    async create(@Body() noteDto: NoteDto) {
    const note: NoteEntity = plainToInstance(NoteEntity, noteDto);
    return await this.noteService.create(note);
    }

    
    @Put(':noteId')
    async update(@Param('noteId') noteId: number, @Body() noteDto: NoteDto) {
    const note: NoteEntity = plainToInstance(NoteEntity, noteDto);
    return await this.noteService.update(noteId, note);
    }

    
    @Delete(':noteId')
    @HttpCode(204)
    async delete(@Param('noteId') noteId: number) {
    return await this.noteService.delete(noteId) 
    }

}
