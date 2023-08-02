/* eslint-disable prettier/prettier */
import { UniversityEntity } from '../university/university.entity';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { NoteEntity } from '../note/note.entity';

@Entity()
export class CourseEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    section:string;

    @Column()
    code:string;

    @Column()
    department:string;

    @ManyToOne(()=> UniversityEntity,university => university.courses)
    university:UniversityEntity;

    @ManyToMany(() => UserEntity,user => user.courses)
    users:UserEntity[];

    @OneToMany(() => NoteEntity, note => note.course)
    notes: NoteEntity[];
}
