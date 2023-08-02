import { UserEntity } from '../user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { NoteEntity } from '../note/note.entity';


@Entity()
export class CommentEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    rating: number;

    @Column()
    text: string;

    @ManyToOne(() => NoteEntity, note => note.comments)
    note: NoteEntity;

    @ManyToOne(() => UserEntity, user => user.comments)
    user: UserEntity;

}



