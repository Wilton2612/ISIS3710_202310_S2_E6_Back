import { Injectable } from '@nestjs/common';
import { NoteEntity } from './note.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class NoteService {

    constructor(
        @InjectRepository(NoteEntity)
        private readonly noteRepository: Repository<NoteEntity>
    ){
    }

    async findAll(): Promise<NoteEntity[]> {
        return await this.noteRepository.find({ relations: ['comments','course', 'user'] });
    }


    async findOne(id: number): Promise<NoteEntity> {
        const note: NoteEntity = await this.noteRepository.findOne({where: {id}, relations: ['comments','course', 'user'] } );
        if (!note)
            throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND);
   
        return note;
    }

    async findNotesByDate(publicationDate: string): Promise<NoteEntity[]> {
        const note: NoteEntity[] = await this.noteRepository.find({where: {publicationDate:publicationDate}, relations: ['comments','course', 'user'] } );
        if (!note)
            throw new BusinessLogicException("The publication date was not found", BusinessError.NOT_FOUND);
   
        return note;
    }

    async create(note: NoteEntity): Promise<NoteEntity> {
        if (note.title === "" || note.accessible === "")
            throw new BusinessLogicException("Cannot create an untitled note and accessibility", BusinessError.PRECONDITION_FAILED);

        return await this.noteRepository.save(note);
    }

    async update(id: number, note: NoteEntity): Promise<NoteEntity> {
        const persistedNote: NoteEntity = await this.noteRepository.findOne({where:{id}});
        if (!persistedNote)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND);
        
        
        return await this.noteRepository.save({... persistedNote, ...note});
    }

    async delete(id: number) {
        const note: NoteEntity = await this.noteRepository.findOne({where:{id}});
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.noteRepository.remove(note);
    }

}
