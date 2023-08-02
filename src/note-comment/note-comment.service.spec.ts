import { Test, TestingModule } from '@nestjs/testing';
import { NoteCommentService } from './note-comment.service';
import { CommentEntity } from '../comment/comment.entity';
import { Repository } from 'typeorm';
import { NoteEntity } from '../note/note.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker'


describe('NoteCommentService', () => {
  let service: NoteCommentService;
  let noteRepository: Repository<NoteEntity>;
  let commentRepository: Repository<CommentEntity>;
  let note: NoteEntity;
  let commentsList : CommentEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [NoteCommentService],
    }).compile();

    service = module.get<NoteCommentService>(NoteCommentService);
    noteRepository = module.get<Repository<NoteEntity>>(getRepositoryToken(NoteEntity));
    commentRepository = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    commentRepository.clear();
    noteRepository.clear();

    commentsList = [];
    for(let i = 0; i < 5; i++){
        const comment: CommentEntity = await commentRepository.save({
          rating: 3,
          text: faker.lorem.text()
        })
        commentsList.push(comment);
    }

     note= await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023",
      comments: commentsList,  
    })
      
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('addCommentNote should add an Comment to a Note', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      rating: 3,
      text: faker.lorem.text()
    });

    const newNote: NoteEntity = await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      accessible: 'No',
      publicationDate: "10/10/2023"
    })

    const result: NoteEntity = await service.addCommentNote(newNote.id, newComment.id);
    
    expect(result.comments.length).toBe(1);
    expect(result.comments[0]).not.toBeNull();
    expect(result.comments[0].rating).toBe(newComment.rating)
    expect(result.comments[0].text).toBe(newComment.text)
   
  });


  it('addCommentNote should thrown exception for an invalid Comment', async () => {
    const newNote: NoteEntity = await noteRepository.save({
      title: faker.name.firstName(),
      text: faker.lorem.text(),
      icon: faker.image.avatar(),
      portada: faker.image.imageUrl(),
      publicationDate: "10/10/2023",
      accessible: 'No',
    })

    await expect(() => service.addCommentNote(newNote.id, 0)).rejects.toHaveProperty("message", "The comment with the given id was not found");
  });


  it('addCommentNote should throw an exception for an invalid Note', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      rating: 3,
      text: faker.lorem.text()
    });

    await expect(() => service.addCommentNote(0, newComment.id)).rejects.toHaveProperty("message", "The note with the given id was not found");
  });

  
  //AQUI
  it('findCommentByNoteIdCommentId should return Comment by note', async () => {
    const comment: CommentEntity = commentsList[0];
    const storedComment: CommentEntity = await service.findCommentByNoteIdCommentId(note.id, comment.id, )
    expect(storedComment).not.toBeNull();
    expect(storedComment.rating).toBe(comment.rating);
    expect(storedComment.text).toBe(comment.text);
    
  });



  it('findCommentByNoteIdCommentId should throw an exception for an invalid Comment', async () => {
    await expect(()=> service.findCommentByNoteIdCommentId(note.id, 0)).rejects.toHaveProperty("message", "The comment with the given id was not found"); 
  });


  it('findCommentByNoteIdCommentId should throw an exception for an invalid Note', async () => {
    const comment: CommentEntity = commentsList[0]; 
    await expect(()=> service.findCommentByNoteIdCommentId(0, comment.id)).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  it('findCommentByNoteIdCommentId should throw an exception for an Comment not associated to the Note', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      rating: 3,
      text: faker.lorem.text()
    });

    await expect(()=> service.findCommentByNoteIdCommentId(note.id, newComment.id)).rejects.toHaveProperty("message", "The comment with the given id is not associated to the note"); 
  });


//AQUI
  it('findCommentsByNoteId should return Comments by Note', async ()=>{
    const Comments: CommentEntity[] = await service.findCommentsByNoteId(note.id);
    expect(Comments.length).toBe(5)
  });


  it('findCommentsByNoteId should throw an exception for an invalid Note', async () => {
    await expect(()=> service.findCommentsByNoteId(0)).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  it('associateCommentsNote should update Comments list for a Note', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      rating: 3,
      text: faker.lorem.text()
    });

    const updatedNote: NoteEntity = await service.associateCommentsNote(note.id, [newComment]);
    expect(updatedNote.comments.length).toBe(1);
    expect(updatedNote.comments[0].rating).toBe(newComment.rating);
    expect(updatedNote.comments[0].text).toBe(newComment.text);
    
  });


  it('associateCommentsNote should throw an exception for an invalid Note', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      rating: 3,
      text: faker.lorem.text() 
    });

    await expect(()=> service.associateCommentsNote(0, [newComment])).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  it('associateCommentsNote should throw an exception for an invalid Comment', async () => {
    const newComment: CommentEntity = commentsList[0];
    newComment.id = 0;

    await expect(()=> service.associateCommentsNote(note.id, [newComment])).rejects.toHaveProperty("message", "The comment with the given id was not found"); 
  });

  // AQUI
  it('deleteCommentToNote should remove an Comment from a Note', async () => {
    const comment: CommentEntity = commentsList[0];
    
    await service.deleteCommentNote(note.id, comment.id);

    const storedNote: NoteEntity = await noteRepository.findOne({where: {id: note.id}, relations: ["comments"]});
    const deletedComment: CommentEntity = storedNote.comments.find(a => a.id === comment.id);

    expect(deletedComment).toBeUndefined();

  });



  it('deleteCommentToNote should thrown an exception for an invalid Comment', async () => {
    await expect(()=> service.deleteCommentNote(note.id, 0)).rejects.toHaveProperty("message", "The comment with the given id was not found"); 
  });

  it('deleteCommentToNote should thrown an exception for an invalid Note', async () => {
    const Comment: CommentEntity = commentsList[0];
    await expect(()=> service.deleteCommentNote(0, Comment.id)).rejects.toHaveProperty("message", "The note with the given id was not found"); 
  });

  it('deleteCommentToNote should thrown an exception for an non asocciated Comment', async () => {
    const newComment: CommentEntity = await commentRepository.save({
      rating: 3,
      text: faker.lorem.text()
    });

    await expect(()=> service.deleteCommentNote(note.id, newComment.id)).rejects.toHaveProperty("message", "The comment with the given id is not associated to the note"); 
  }); 

});
