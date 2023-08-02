import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { NoteEntity } from '../note/note.entity';

@Injectable()
export class NoteUserService {

  private readonly logger = new Logger(NoteUserService.name);
    constructor(
        @InjectRepository(NoteEntity)
        private readonly noteRepository: Repository<NoteEntity>,
    
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async addNoteUser(userId: string, nota: NoteEntity): Promise<UserEntity> {

       this.logger.log('creando nota - capa servicio...', nota, userId);

       const note: NoteEntity = await this.noteRepository.save(nota); 

       const user: UserEntity = await this.userRepository.findOne({ where: { id: userId }, relations: ["comments", "university","courses", "friends", "notes"]});
   
       if (!user)
           throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
   
        user.notes = [...user.notes, note];
        return await this.userRepository.save(user);
      }
    

      
    async findNoteByUserIdNoteId(userId: string, noteId: number): Promise<NoteEntity> {
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}});
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
       
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["notes"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
   
        const userNote: NoteEntity = user.notes.find(e => e.id === note.id);
   
        if (!userNote)
          throw new BusinessLogicException("The note with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)
   
        return userNote;
    }
    
    async findNotesByUserId(userId: string): Promise<NoteEntity[]> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["notes"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
       
        return user.notes;
    }
    
    async associateNotesUser(userId: string, notes: NoteEntity[]): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["notes"]});
    
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < notes.length; i++) {
          const note: NoteEntity = await this.noteRepository.findOne({where: {id: notes[i].id}});
          if (!note)
            throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        user.notes = notes;
        return await this.userRepository.save(user);
      }
    
    async deleteNoteUser(userId: string, noteId: number){
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}});
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
    
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["notes"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
    
        const userNote: NoteEntity = user.notes.find(e => e.id === note.id);
    
        if (!userNote)
            throw new BusinessLogicException("The note with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)
 
        user.notes = user.notes.filter(e => e.id !== noteId);
        await this.userRepository.save(user);
    }  
}
