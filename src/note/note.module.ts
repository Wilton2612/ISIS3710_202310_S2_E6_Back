import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { NoteEntity } from './note.entity';
import { NoteController } from './note.controller';

@Module({
  providers: [NoteService],
  imports: [TypeOrmModule.forFeature([NoteEntity])],
  controllers: [NoteController],
})

export class NoteModule {

 
}
