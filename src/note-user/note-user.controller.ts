import { Body, Controller, Delete, Logger, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NoteDto } from '../note/note.dto';
import { NoteEntity } from '../note/note.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { NoteUserService } from './note-user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class NoteUserController {

    private readonly logger = new Logger(NoteUserController.name);

    constructor(private readonly noteUserService: NoteUserService){}
    
    
    @Post(':userId/notes')
    async addNoteUser(@Param('userId') userId: string, @Body() noteDto: NoteDto){
        this.logger.log('creando nota - capa controller...', noteDto);
        const notaCreate: NoteEntity = plainToInstance(NoteEntity, noteDto);
        return await this.noteUserService.addNoteUser(userId, notaCreate);
    }

    
    @Get(':userId/notes/:noteId')
    async findNoteByUserIdNoteId(@Param('userId') userId: string, @Param('noteId') noteId: number){
        return await this.noteUserService.findNoteByUserIdNoteId(userId, noteId);
    }
    
    
    @Get(':userId/notes')
    async findNotesByUserId(@Param('userId') userId: string){
       return await this.noteUserService.findNotesByUserId(userId);
    }

    @Put(':userId/notes')
    async associateNotesUser(@Body() notesDto: NoteDto[], @Param('userId') userId: string){
       const notes = plainToInstance(NoteEntity, notesDto)
       return await this.noteUserService.associateNotesUser(userId, notes);
    }

    @Delete(':userId/notes/:noteId')
    @HttpCode(204)
    async deleteNoteUser(@Param('userId') userId: string, @Param('noteId') noteId: number){
        return await this.noteUserService.deleteNoteUser(userId, noteId);
    }
}
