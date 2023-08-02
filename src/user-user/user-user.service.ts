import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class UserUserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async addFriendUser(userId: string, friendId: string,): Promise<UserEntity> {
        const friend: UserEntity = await this.userRepository.findOne({where: {id: friendId}});
        if (!friend)
          throw new BusinessLogicException("The friend with the given id was not found", BusinessError.NOT_FOUND);
      
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["comments", "university", "friends", "notes"]})
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
    
        user.friends = [...user.friends, friend];
        return await this.userRepository.save(user);
      }
    
    async findFriendByUserIdFriendId(userId: string, friendId: string): Promise<UserEntity> {
        const friend: UserEntity = await this.userRepository.findOne({where: {id: friendId}});
        if (!friend)
          throw new BusinessLogicException("The friend with the given id was not found", BusinessError.NOT_FOUND);
      
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["comments", "university", "friends", "notes"]})
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
   
        const userFriend: UserEntity = user.friends.find(e => e.id === friend.id);
   
        if (!userFriend)
          throw new BusinessLogicException("The friend with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)
   
        return userFriend;
    }
    
    async findFriendsByUserId(userId: string): Promise<UserEntity[]> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["friends"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
       
        return user.friends;
    }
    
    async associateFriendsUser(userId: string, friends: UserEntity[]): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["friends"]});
    
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < friends.length; i++) {
          const friend: UserEntity = await this.userRepository.findOne({where: {id: friends[i].id}});
          if (!friend)
            throw new BusinessLogicException("The friend with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        user.friends = friends;
        return await this.userRepository.save(user);
      }
    
    async deleteFriendUser(userId: string, friendId: string){
        const friend: UserEntity = await this.userRepository.findOne({where: {id: friendId}});
        if (!friend)
          throw new BusinessLogicException("The friend with the given id was not found", BusinessError.NOT_FOUND)
    
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ["friends"]});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
    
        const userFriend: UserEntity = user.friends.find(e => e.id === friend.id);
    
        if (!userFriend)
            throw new BusinessLogicException("The friend with the given id is not associated to the user", BusinessError.PRECONDITION_FAILED)
 
        user.friends = user.friends.filter(e => e.id !== friendId);
        await this.userRepository.save(user);
    } 

}
