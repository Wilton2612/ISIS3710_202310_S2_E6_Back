import { Body, Controller, Logger, Delete, Get, HttpCode, Param, Query, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {

    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {}
    
   
    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @Get(':userId')
    async findOne(@Param('userId') userId: string) {
        this.logger.log('Buscando usuario...', userId);
        return await this.userService.findOne(userId);
    }

    @Public()
    @Post()
    async create(@Body() userDto: UserDto) {
        this.logger.log('Holaaaa...', userDto);
        const user: UserEntity = plainToInstance(UserEntity, userDto);
        return await this.userService.create(user);
    }
    
    @Put(':userId')
    async update(@Param('userId') userId: string, @Body() userDto: UserDto) {
      this.logger.log('updating...', userDto);
      const user: UserEntity = plainToInstance(UserEntity, userDto);
      return await this.userService.update(userId, user);
    }

    @Delete(':userId')
    @HttpCode(204)
    async delete(@Param('userId') userId: string) {
      return await this.userService.delete(userId);
    }
}
