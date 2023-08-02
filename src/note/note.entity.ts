import { UserEntity } from '../user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { CourseEntity } from '../course/course.entity';

@Entity()
export class NoteEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    icon: string;

    @Column()
    portada: string;

    @Column()
    accessible: string;

    @Column()
    publicationDate: string;

    @OneToMany(() => CommentEntity, comments => comments.note, {
        cascade: true,
    })
    comments: CommentEntity[];

    @ManyToOne(() => CourseEntity, course => course.notes)
    course:  CourseEntity;

    @ManyToOne(() => UserEntity, user => user.notes)
    user:  UserEntity;

}



