/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UniversityEntity } from './university.entity';

@Injectable()
export class UniversityService {
    constructor(
        @InjectRepository(UniversityEntity)
        private readonly universityRepository : Repository<UniversityEntity>
    ){}

    async findAll():Promise<UniversityEntity[]> {

        return await this.universityRepository.find({ relations : ["courses","users"]});

    }

    async findOne(id: string): Promise<UniversityEntity> {
        const university : UniversityEntity = await this.universityRepository.findOne({where:{id}, relations:["courses","users"]});
        if (!university)
            throw new BusinessLogicException("The university with the given id was not found", BusinessError.NOT_FOUND);

        return university;

    }

    async create(university:UniversityEntity):Promise<UniversityEntity>{

        return await this.universityRepository.save(university);
    }

    async update(id:string, university:UniversityEntity):Promise<UniversityEntity>{

        const persistedUniversity: UniversityEntity = await this.universityRepository.findOne({where:{id}});

        if(!persistedUniversity)
            throw new BusinessLogicException("The university with the given id was not found",BusinessError.NOT_FOUND);
        
        return await this.universityRepository.save({...persistedUniversity,...university});
    }

    async delete(id:string):Promise<UniversityEntity>{
        const university: UniversityEntity = await this.universityRepository.findOne({where:{id}});
        if(!university)
            throw new BusinessLogicException("The university with the given id was not found",BusinessError.NOT_FOUND);

        return this.universityRepository.remove(university); 
    }

}
