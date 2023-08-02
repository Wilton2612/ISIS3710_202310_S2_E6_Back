import { Test, TestingModule } from '@nestjs/testing';
import { CourseNoteService } from './course-note.service';
import { CourseEntity } from '../course/course.entity';
import { Repository } from 'typeorm';
import { NoteEntity } from '../note/note.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker'

describe('CourseCourseService', () => {
  let service: CourseNoteService;
  let courseRepository: Repository<CourseEntity>;
  let noteRepository: Repository<NoteEntity>;
  let course: CourseEntity;
  let notesList : NoteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CourseNoteService],
    }).compile();

    service = module.get<CourseNoteService>(CourseNoteService);
    courseRepository = module.get<Repository<CourseEntity>>(getRepositoryToken(CourseEntity));
    noteRepository = module.get<Repository<NoteEntity>>(getRepositoryToken(NoteEntity));

    await seedDatabase();

  });

  const seedDatabase = async () => {
    noteRepository.clear();
    courseRepository.clear();

    notesList = [];
    for(let i = 0; i < 5; i++){
        const note: NoteEntity = await noteRepository.save({
          title: faker.name.firstName(),
          text: faker.lorem.text(),
          icon: faker.image.avatar(),
          portada: faker.image.imageUrl(),
          accessible: 'No',
          publicationDate: "10/10/2023",
        })
        notesList.push(note);
    }

     course= await courseRepository.save({
      name: faker.company.name(),
      section: faker.lorem.sentence(),
      code: faker.address.zipCode(),
      department: faker.address.city(),
      notes: notesList,  
    })
      
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('addCommentNote should add an Comment to a Note', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023",
    });

    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(),
      section: faker.lorem.sentence(),
      code: faker.address.zipCode(),
      department: faker.address.city(),  
    })

    const result: CourseEntity = await service.addNoteCourse(newCourse.id, newNote.id);
    
    expect(result.notes.length).toBe(1);
    expect(result.notes[0]).not.toBeNull();
    expect(result.notes[0].title).toBe(newNote.title)
    expect(result.notes[0].text).toBe(newNote.text)
    expect(result.notes[0].icon).toBe(newNote.icon)
    expect(result.notes[0].portada).toBe(newNote.portada)
    expect(result.notes[0].accessible).toBe(newNote.accessible)
   
  });


  it('addNoteCourse should thrown exception for an invalid Note', async () => {
    const newCourse: CourseEntity = await courseRepository.save({
      name: faker.company.name(),
      section: faker.lorem.sentence(),
      code: faker.address.zipCode(),
      department: faker.address.city(),
    })

    await expect(() => service.addNoteCourse(newCourse.id, 0)).rejects.toHaveProperty("message", "The note with the given id was not found");
  });


  it('addNoteCourse should throw an exception for an invalid Course', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023",
    });

    await expect(() => service.addNoteCourse("0", newNote.id)).rejects.toHaveProperty("message", "The course with the given id was not found");
  });

  
  //AQUI
  it('findNoteByCourseIdNoteId should return Note by course', async () => {
    const note: NoteEntity = notesList[0];
    const storedNote: NoteEntity = await service.findNoteByCourseIdNoteId(course.id, note.id, )
    expect(storedNote).not.toBeNull();
    expect(storedNote.title).toBe(note.title);
    expect(storedNote.text).toBe(note.text);
    expect(storedNote.icon).toBe(note.icon);
    expect(storedNote.portada).toBe(note.portada);
    expect(storedNote.accessible).toBe(note.accessible);
    
  });



  it('findCommentByNoteIdCommentId should throw an exception for an invalid Comment', async () => {
    await expect(()=> service.findNoteByCourseIdNoteId(course.id, 0)).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });


  it('findCommentByNoteIdCommentId should throw an exception for an invalid Note', async () => {
    const note: NoteEntity = notesList[0]; 
    await expect(()=> service.findNoteByCourseIdNoteId("0", note.id)).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('findCommentByNoteIdCommentId should throw an exception for an Comment not associated to the Note', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023",
    });

    await expect(()=> service.findNoteByCourseIdNoteId(course.id, newNote.id)).rejects.toHaveProperty("message", "The note with the given id is not associated to the course"); 
  });


//AQUI
  it('findCommentsByNoteId should return Comments by Note', async ()=>{
    const notes: NoteEntity[] = await service.findNotesByCourseId(course.id);
    expect(notes.length).toBe(5)
  });


  it('findCommentsByNoteId should throw an exception for an invalid Note', async () => {
    await expect(()=> service.findNotesByCourseId("0")).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('associateCommentsNote should update Comments list for a Note', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023",
    });

    const updatedCourse: CourseEntity = await service.associateNotesCourse(course.id, [newNote]);
    expect(updatedCourse.notes.length).toBe(1);
    expect(updatedCourse.notes[0].title).toBe(newNote.title);
    expect(updatedCourse.notes[0].text).toBe(newNote.text);
    expect(updatedCourse.notes[0].icon).toBe(newNote.icon);
    expect(updatedCourse.notes[0].portada).toBe(newNote.portada);
    expect(updatedCourse.notes[0].accessible).toBe(newNote.accessible);

  });



  it('associateCommentsNote should throw an exception for an invalid Note', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023",
    });

    await expect(()=> service.associateNotesCourse("0", [newNote])).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });


  it('associateCommentsNote should throw an exception for an invalid Comment', async () => {
    const newNote: NoteEntity = notesList[0];
    newNote.id = 0;

    await expect(()=> service.associateNotesCourse(course.id, [newNote])).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  // AQUI
  it('deleteCommentToNote should remove an Comment from a Note', async () => {
    const note: NoteEntity = notesList[0];
    
    await service.deleteNoteCourse(course.id, note.id);

    const storedCourse: CourseEntity = await courseRepository.findOne({where: {id: course.id}, relations: ["notes"]});
    const deletedNote: NoteEntity = storedCourse.notes.find(a => a.id === note.id);

    expect(deletedNote).toBeUndefined();

  });

  it('deleteCommentToNote should thrown an exception for an invalid Comment', async () => {
    await expect(()=> service.deleteNoteCourse(course.id, 0)).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  it('deleteCommentToNote should thrown an exception for an invalid Note', async () => {
    const note: NoteEntity = notesList[0];
    await expect(()=> service.deleteNoteCourse("0", note.id)).rejects.toHaveProperty("message", "The course with the given id was not found"); 
  });

  it('deleteCommentToNote should thrown an exception for an non asocciated Comment', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023",
    });

    await expect(()=> service.deleteNoteCourse(course.id, newNote.id)).rejects.toHaveProperty("message", "The note with the given id is not associated to the course"); 
  }); 

});
