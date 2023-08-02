/* eslint-disable prettier/prettier */
import { CourseEntity } from '../course/course.entity';
import { UserEntity } from '../user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class UniversityEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    description:string;

    @Column()
    country:string;

    @Column()
    address:string;

    @Column()
    image:string;
    
    @OneToMany(()=> CourseEntity, courses => courses.university)
    courses: CourseEntity[];

    @OneToMany(()=> UserEntity, users => users.university)
    users: UserEntity[];

}

