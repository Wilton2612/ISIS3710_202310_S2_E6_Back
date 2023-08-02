import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { NoteUserService } from './note-user.service';
import { NoteEntity } from '../note/note.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('NoteUserService', () => {
  let service: NoteUserService;
  let userRepository: Repository<UserEntity>;
  let noteRepository: Repository<NoteEntity>;
  let user: UserEntity;
  let notesList : NoteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [NoteUserService],
    }).compile();

    service = module.get<NoteUserService>(NoteUserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    noteRepository = module.get<Repository<NoteEntity>>(getRepositoryToken(NoteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    noteRepository.clear();
    userRepository.clear();

    notesList = [];
    for(let i = 0; i < 5; i++){
        const note: NoteEntity = await noteRepository.save({
          title: faker.company.name(), 
          text: faker.random.alpha(),
          icon: faker.image.cats(),
          portada: faker.image.city(),
          accessible: faker.company.name(),
          publicationDate: "10/10/2023",
        })
        notesList.push(note);
    }

    user = await userRepository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student",
      notes: notesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addNoteUser should add an note to a user', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.company.name(), 
      text: faker.random.alpha(),
      icon: faker.image.cats(),
      portada: faker.image.city(),
      accessible: faker.company.name(),
      publicationDate: "10/10/2023",
    })

    const newUser: UserEntity = await userRepository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student"
    })

    const result: UserEntity = await service.addNoteUser(newUser.id, newNote.id);
    
    expect(result.notes.length).toBe(1);
    expect(result.notes[0]).not.toBeNull();
    expect(result.notes[0].title).toBe(newNote.title)
    expect(result.notes[0].text).toBe(newNote.text)
    expect(result.notes[0].icon).toBe(newNote.icon)
    expect(result.notes[0].portada).toBe(newNote.portada)
    expect(result.notes[0].accessible).toBe(newNote.accessible)
  });

  it('addNoteUser should thrown exception for an invalid note', async () => {
    const newUser: UserEntity = await userRepository.save({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      image: faker.image.imageUrl(),
      user: faker.name.prefix(),
      userType: "student",
      notes: notesList
    })

    await expect(() => service.addNoteUser(newUser.id, 0)).rejects.toHaveProperty("message", "The note with the given id was not found");
  });

  it('addNoteUser should throw an exception for an invalid user', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.company.name(), 
      text: faker.random.alpha(),
      icon: faker.image.cats(),
      portada: faker.image.city(),
      accessible: faker.company.name(),
      publicationDate: "10/10/2023",
    })

    await expect(() => service.addNoteUser("0", newNote.id)).rejects.toHaveProperty("message", "The user with the given id was not found");
  });

  it('findNoteByUserIdNoteId should return note by user', async () => {
    const note: NoteEntity = notesList[0];
    const storedNote: NoteEntity = await service.findNoteByUserIdNoteId(user.id, note.id )
    expect(storedNote).not.toBeNull();
    expect(storedNote.title).toBe(note.title);
    expect(storedNote.text).toBe(note.text);
    expect(storedNote.icon).toBe(note.icon);
    expect(storedNote.portada).toBe(note.portada);
    expect(storedNote.accessible).toBe(note.accessible);
  });

  it('findNoteByUserIdNoteId should throw an exception for an invalid note', async () => {
    await expect(()=> service.findNoteByUserIdNoteId(user.id, 0)).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  it('findNoteByUserIdNoteId should throw an exception for an invalid user', async () => {
    const note: NoteEntity = notesList[0]; 
    await expect(()=> service.findNoteByUserIdNoteId("0", note.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('findNoteByUserIdNoteId should throw an exception for a note not associated to the user', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.company.name(), 
      text: faker.random.alpha(),
      icon: faker.image.cats(),
      portada: faker.image.city(),
      accessible: faker.company.name(),
      publicationDate: "10/10/2023",
    })

    await expect(()=> service.findNoteByUserIdNoteId(user.id, newNote.id)).rejects.toHaveProperty("message", "The note with the given id is not associated to the user"); 
  });

  it('findNotesByUserId should return notes by user', async ()=>{
    const notes: NoteEntity[] = await service.findNotesByUserId(user.id);
    expect(notes.length).toBe(5)
  });

  it('findNotesByUserId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findNotesByUserId("0")).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateNotesUser should update notes list for a user', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.company.name(), 
      text: faker.random.alpha(),
      icon: faker.image.cats(),
      portada: faker.image.city(),
      accessible: faker.company.name(),
      publicationDate: "10/10/2023",
    })

    const updatedUser: UserEntity = await service.associateNotesUser(user.id, [newNote]);
    expect(updatedUser.notes.length).toBe(1);

    expect(updatedUser.notes[0].title).toBe(newNote.title);
    expect(updatedUser.notes[0].text).toBe(newNote.text);
    expect(updatedUser.notes[0].icon).toBe(newNote.icon);
    expect(updatedUser.notes[0].portada).toBe(newNote.portada);
    expect(updatedUser.notes[0].accessible).toBe(newNote.accessible);
  });

  it('associateNotesUser should throw an exception for an invalid user', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.company.name(), 
      text: faker.random.alpha(),
      icon: faker.image.cats(),
      portada: faker.image.city(),
      accessible: faker.company.name(),
      publicationDate: "10/10/2023",
    })

    await expect(()=> service.associateNotesUser("0", [newNote])).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('associateNotesUser should throw an exception for an invalid note', async () => {
    const newNote: NoteEntity = notesList[0];
    newNote.id = 0;

    await expect(()=> service.associateNotesUser(user.id, [newNote])).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  it('deleteNoteUser should remove an note from a user', async () => {
    const note: NoteEntity = notesList[0];
    
    await service.deleteNoteUser(user.id, note.id);

    const storedUser: UserEntity = await userRepository.findOne({where: {id: user.id}, relations: ["notes"]});
    const deletedNote: NoteEntity = storedUser.notes.find(a => a.id === note.id);

    expect(deletedNote).toBeUndefined();

  });

  it('deleteNoteUser should thrown an exception for an invalid note', async () => {
    await expect(()=> service.deleteNoteUser(user.id, 0)).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  it('deleteNoteUser should thrown an exception for an invalid museum', async () => {
    const note: NoteEntity = notesList[0];
    await expect(()=> service.deleteNoteUser("0", note.id)).rejects.toHaveProperty("message", "The user with the given id was not found"); 
  });

  it('deleteNoteUser should thrown an exception for an non asocciated note', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.company.name(), 
      text: faker.random.alpha(),
      icon: faker.image.cats(),
      portada: faker.image.city(),
      accessible: faker.company.name(),
      publicationDate: "10/10/2023",
    })

    await expect(()=> service.deleteNoteUser(user.id, newNote.id)).rejects.toHaveProperty("message", "The note with the given id is not associated to the user"); 
  }); 

});
