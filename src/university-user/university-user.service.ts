import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { UniversityEntity } from '../university/university.entity';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UniversityUserService {


    constructor(
        @InjectRepository(UniversityEntity)
        private readonly universityRepository: Repository<UniversityEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
        
    ){}

    async addUserUniversity(universityId:string,userId:string): Promise<UniversityEntity>{

        const user : UserEntity = await this.userRepository.findOne({where:{id:userId}});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found",BusinessError.NOT_FOUND);

        const university : UniversityEntity = await this.universityRepository.findOne({where:{id:universityId}, relations:['users']});
        if(!university)
            throw new BusinessLogicException("The university with the given id was not found",BusinessError.NOT_FOUND);
        
        university.users = [...university.users, user];
        return await this.universityRepository.save(university);

    }

    async findUserByUniversityIdUserId(universityId:string,userId:string): Promise<UserEntity>{

        const university : UniversityEntity = await this.universityRepository.findOne({where:{id:universityId},relations:["users"]});
        if(!university)
            throw new BusinessLogicException("The university with the given id was not found",BusinessError.NOT_FOUND);

        const user : UserEntity = await this.userRepository.findOne({where:{id:userId}});
        if(!user)
            throw new BusinessLogicException("The user with the given id was not found",BusinessError.NOT_FOUND);

        const universityUser : UserEntity = university.users.find(e => e.id === user.id);
        if(!universityUser)
            throw new BusinessLogicException("The user with the given id is not associated to the university",BusinessError.PRECONDITION_FAILED);

        return universityUser;
    }
        async findUsersByUniversityId(universityId: string): Promise<UserEntity[]> {
            const university: UniversityEntity = await this.universityRepository.findOne({where: {id: universityId}, relations: ["users"]});
            if (!university)
              throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND)
            
            return university.users;
        }
         
        async associateUsersUniversity(universityId: string, users: UserEntity[]): Promise<UniversityEntity> {
            const university: UniversityEntity = await this.universityRepository.findOne({where: {id: universityId}, relations: ["users"]});
        
            if (!university)
              throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND)
        
            for (let i = 0; i < users.length; i++) {
              const user: UserEntity = await this.userRepository.findOne({where: {id: users[i].id}});
              if (!user)
                throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
            }
        
            university.users = users;
            return await this.universityRepository.save(university);
        }
         
        async deleteUserUniversity(universityId: string, userId: string){
            const user: UserEntity = await this.userRepository.findOne({where: {id: userId}});
            if (!user)
              throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
        
            const university: UniversityEntity = await this.universityRepository.findOne({where: {id: universityId}, relations: ["users"]});
            if (!university)
              throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND)
        
            const universityUser: UserEntity = university.users.find(e => e.id === user.id);
        
            if (!universityUser)
                throw new BusinessLogicException("The user with the given id is not associated to the university", BusinessError.PRECONDITION_FAILED)
     
            university.users = university.users.filter(e => e.id !== userId);
            await this.universityRepository.save(university);
        } 
    }

    


