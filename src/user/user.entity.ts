/* eslint-disable prettier/prettier */
import { CourseEntity } from '../course/course.entity';
import { UniversityEntity } from '../university/university.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany, TableInheritance} from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { NoteEntity } from '../note/note.entity';

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column()
    image:string;

    @Column()
    user:string;

    @Column()
    userType:string;

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[];

    @ManyToOne(()=>UniversityEntity,university=>university.users)
    university:UniversityEntity;

    @ManyToMany(() => CourseEntity,course => course.users)
    @JoinTable()
    courses:CourseEntity[];

    @ManyToMany(()=> UserEntity, estudiante => estudiante.friends)
    @JoinTable()
    friends: UserEntity[];

    @OneToMany(() => NoteEntity, notes => notes.user)
    notes: NoteEntity[];

}
