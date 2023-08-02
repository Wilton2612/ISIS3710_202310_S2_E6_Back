import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { NoteEntity } from './note.entity';
import { NoteService } from './note.service';
import { faker } from '@faker-js/faker';

describe('NoteService', () => {
  let service: NoteService;
  let repository: Repository<NoteEntity>;
  let notesList: NoteEntity[];
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [NoteService],
    }).compile();

    service = module.get<NoteService>(NoteService);
    repository = module.get<Repository<NoteEntity>>(getRepositoryToken(NoteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    notesList = [];
    for(let i = 0; i < 5; i++){
        const note: NoteEntity = await repository.save({
        title: faker.name.firstName(),
        text: faker.lorem.text(),
        icon: faker.image.avatar(),
        portada: faker.image.imageUrl(),
        accessible: 'No',
        publicationDate: "10/10/2023"   
      })
        notesList.push(note);
    }
  }




  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all notes', async () => {
    const notes: NoteEntity[] = await service.findAll();
    expect(notes).not.toBeNull();
    expect(notes).toHaveLength(notesList.length);
  });


  it('findOne should return a note by id', async () => {
    const storedNote: NoteEntity = notesList[0];
    const note: NoteEntity = await service.findOne(storedNote.id);
    expect(note).not.toBeNull();
    expect(note.title).toEqual(storedNote.title)
    expect(note.text).toEqual(storedNote.text)
    expect(note.icon).toEqual(storedNote.icon)
    expect(note.portada).toEqual(storedNote.portada)
    expect(note.accessible).toEqual(storedNote.accessible)
  });


  it('findOne should throw an exception for an invalid note', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "The note with the given id was not found")
  });


  it('create should return a new note', async () => {
    const note: NoteEntity = {
      id: 1,
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023",
      comments: [],
      course: null,
      user: null,
    }
 
    const newNote: NoteEntity = await service.create(note);
    expect(newNote).not.toBeNull();
 
    const storedNote: NoteEntity = await repository.findOne({where: {id: newNote.id}})
    expect(storedNote).not.toBeNull();
    expect(storedNote.title).toEqual(newNote.title)
    expect(storedNote.text).toEqual(newNote.text)
    expect(storedNote.icon).toEqual(newNote.icon)
    expect(storedNote.portada).toEqual(newNote.portada)
    expect(storedNote.accessible).toEqual(newNote.accessible)
  });

  it('create should throw exception for empty parameters', async () => {
    const note: NoteEntity = {
      id: 1,
      title: '',
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: '',
      comments: [],
      publicationDate: "10/10/2023",
      course: null,
      user: null,
    }
 
    await expect (service.create(note)).rejects.toHaveProperty("message", "Cannot create an untitled note and accessibility")
 
    
  });

  it('update should modify a note', async () => {
    const note: NoteEntity = notesList[0];
    note.title = "New title";
    note.text = "New text";
    const updatedNote: NoteEntity = await service.update(note.id, note);
    expect(updatedNote).not.toBeNull();

    const storedNote: NoteEntity = await repository.findOne({ where: { id: note.id } })
    expect(storedNote).not.toBeNull();
    expect(storedNote.title).toEqual(note.title)
    expect(storedNote.text).toEqual(note.text)
  });


  it('update should throw an exception for an invalid note', async () => {
    let note: NoteEntity = notesList[0];
    note = {
      ...note, title: "New title", text: "New text"
    }
    await expect(() => service.update(0, note)).rejects.toHaveProperty("message", "The note with the given id was not found")
  });


  it('delete should remove a note', async () => {
    const note: NoteEntity = notesList[0];
    await service.delete(note.id);
     const deletedNote: NoteEntity = await repository.findOne({ where: { id: note.id } })
    expect(deletedNote).toBeNull();
  });

  it('delete should throw an exception for an invalid note', async () => {
    const note: NoteEntity = notesList[0];
    await repository.delete(note.id);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "The note with the given id was not found")
  });

});





