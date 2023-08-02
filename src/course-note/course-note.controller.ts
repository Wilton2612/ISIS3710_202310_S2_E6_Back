import { Controller, UseInterceptors, Param, Post, Get, Put, Body, Delete, HttpCode, UseGuards} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CourseNoteService } from './course-note.service';
import { plainToInstance } from 'class-transformer';
import { NoteEntity } from '../note/note.entity';
import { NoteDto } from '../note/note.dto';;
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('courses')
@UseInterceptors(BusinessErrorsInterceptor)
export class CourseNoteController {


    constructor(private readonly courseNoteService: CourseNoteService)
    {}


    
    @Post(':courseId/notes/:noteId')
    async addNoteCourse(@Param('courseId') courseId: string, @Param('noteId') noteId: number){
        return await this.courseNoteService.addNoteCourse( courseId, noteId);
    }

    
    @Get(':courseId/notes/:noteId')
    async findNoteByCourseIdNoteId(@Param('courseId') courseId: string, @Param('noteId') noteId: number){
        return await this.courseNoteService.findNoteByCourseIdNoteId(courseId, noteId);
    }

    
    @Get(':courseId/notes')
    async findNotesByCourseId(@Param('courseId') courseId: string){
        console.log(courseId)
        return await this.courseNoteService.findNotesByCourseId(courseId);
    }


    
    @Put(':courseId/notes')
    async associateNotesCourse(@Body() notesDto: NoteDto[], @Param('courseId') courseId: string){
        const notes = plainToInstance(NoteEntity, notesDto)
        return await this.courseNoteService.associateNotesCourse(courseId, notes);
    }

    @Delete(':courseId/notes/:noteId')
    @HttpCode(204)
    async deleteNoteCourse(@Param('courseId') courseId: string, @Param('noteId') noteId: number){
        return await this.courseNoteService.deleteNoteCourse(courseId, noteId);
    }
}
    

