import { Injectable } from '@nestjs/common';
import { CourseEntity } from '../course/course.entity';
import { NoteEntity } from '../note/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CourseNoteService {


    constructor(
        @InjectRepository(NoteEntity)
        private readonly noteRepository: Repository<NoteEntity>,
    
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>
    ) {}


    async addNoteCourse(courseId: string, noteId: number, ): Promise<CourseEntity> {
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}});
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND);
       
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courseId}, relations: ["notes"]}) 
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND);
     
        course.notes = [...course.notes, note];
        return await this.courseRepository.save(course);
      }
     
    
    async findNoteByCourseIdNoteId(courseId: string, noteId: number): Promise<NoteEntity> {
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}});
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
        
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courseId}, relations: ["notes"]}); 
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
    
        const courseNote: NoteEntity = course.notes.find(e => e.id === note.id);
    
        if (!courseNote)
          throw new BusinessLogicException("The note with the given id is not associated to the course", BusinessError.PRECONDITION_FAILED)
    
        return courseNote;
    }

     
    async findNotesByCourseId(courseId: string): Promise<NoteEntity[]> {
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courseId}, relations: ["notes"]});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
        
        return course.notes;
    }
     

    async associateNotesCourse(courseId: string, notes: NoteEntity[]): Promise<CourseEntity> {
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courseId}, relations: ["notes"]});
     
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < notes.length; i++) {
          const note: NoteEntity = await this.noteRepository.findOne({where: {id: notes[i].id}});
          if (!note)
            throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        course.notes = notes;
        return await this.courseRepository.save(course);
      }
     
    async deleteNoteCourse(courseId: string, noteId: number){
        const note: NoteEntity = await this.noteRepository.findOne({where: {id: noteId}});
        if (!note)
          throw new BusinessLogicException("The note with the given id was not found", BusinessError.NOT_FOUND)
     
        const course: CourseEntity = await this.courseRepository.findOne({where: {id: courseId}, relations: ["notes"]});
        if (!course)
          throw new BusinessLogicException("The course with the given id was not found", BusinessError.NOT_FOUND)
     
        const courseNote: NoteEntity = course.notes.find(e => e.id === note.id);
     
        if (!courseNote)
            throw new BusinessLogicException("The note with the given id is not associated to the course", BusinessError.PRECONDITION_FAILED)

        course.notes = course.notes.filter(e => e.id !==  noteId);
        await this.courseRepository.save(course);
    }
}
