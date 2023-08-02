import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto } from '../user/user.dto';
import { UserEntity } from '../user/user.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UserUserService } from './user-user.service';


@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserUserController {
    constructor(private readonly userUserService: UserUserService){}

    @UseGuards(JwtAuthGuard)
    @Post(':userId/friends/:friendId')
    async addFriendUser(@Param('userId') userId: string, @Param('friendId') friendId: string){
        return await this.userUserService.addFriendUser(userId, friendId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':userId/friends/:friendId')
    async findFriendByUserIdFriendId(@Param('userId') userId: string, @Param('friendId') friendId: string){
        return await this.userUserService.findFriendByUserIdFriendId(userId, friendId);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':userId/friends')
    async findFriendsByUserId(@Param('userId') userId: string){
        return await this.userUserService.findFriendsByUserId(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':userId/friends')
    async associateFriendsUser(@Body() friendsDto: UserDto[], @Param('userId') userId: string){
       const friends = plainToInstance(UserEntity, friendsDto)
       return await this.userUserService.associateFriendsUser(userId, friends);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':userId/friends/:friendId')
   @HttpCode(204)
   async deleteFriendUser(@Param('userId') userId: string, @Param('friendId') friendId: string){
       return await this.userUserService.deleteFriendUser(userId, friendId);
   }
}
