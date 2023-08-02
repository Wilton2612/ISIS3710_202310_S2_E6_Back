import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from '../note/note.entity';
import { UserEntity } from '../user/user.entity';
import { NoteUserService } from './note-user.service';
import { NoteUserController } from './note-user.controller';

@Module({
  providers: [NoteUserService],
  imports: [TypeOrmModule.forFeature([NoteEntity, UserEntity])],
  controllers: [NoteUserController],
})
export class NoteUserModule {}
