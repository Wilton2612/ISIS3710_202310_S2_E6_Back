import { Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}
    


    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find({ relations: ["comments", "university", "friends", "notes"] });
    }

    async findOne(id: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id}, relations: ["comments", "university", "friends", "notes"] } );
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
   
        return user;
    }

    async findOneByUser(email: string, password: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {email: email}} );
        this.logger.log('obtiendo usuario: ', user);
        if (!user)
          throw new BusinessLogicException("The user with the given email was not foundssss", BusinessError.NOT_FOUND);
        
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw new BusinessLogicException("The user with the given email was not foundssss", BusinessError.NOT_FOUND);
        }

        return user;
    }


    async create(usuario: UserEntity): Promise<UserEntity> {
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario.password, salt);
        usuario.password = hashedPassword;
        
        let username = usuario.name.replace(/\s+/g, '').toLowerCase();

        if (username.length > 10) {
            username = username.substring(0, 10);
        }

        const existingUser = await this.userRepository.findOne({ where: { user: username }, });
        this.logger.log('Buscando usuario existente...', existingUser);

        if (existingUser) {
            const suffix = Date.now().toString().substring(7);
            const newUsername = `${username}-${suffix}`;
            usuario.user = newUsername;
            this.logger.log(`Generando nombre de usuario único: ${newUsername}`);
            
        } else {
            usuario.user = username;
        }

        this.logger.log('Capa servicio...', UserEntity);

        const savedUser = await this.userRepository.save(usuario);
        this.logger.log('Usuario guardado en la base de datos: ', savedUser);

        return savedUser;
    }

    async update(id: string, user: UserEntity): Promise<UserEntity> {
        const persistedUser: UserEntity = await this.userRepository.findOne({where:{id}});
        if (!persistedUser)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
        
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;

        return await this.userRepository.save({...persistedUser, ...user});
    }

    async delete(id: string) {
        const user: UserEntity = await this.userRepository.findOne({where:{id}});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.userRepository.remove(user);
    }

}
