import { Controller, Logger, Query, Post, UseGuards, Param, Body, HttpException, HttpStatus } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor( private readonly authService: AuthService) {}
    
    private readonly logger = new Logger(AuthController.name);


    //@UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Body('email') email: string, @Body('password') password: string) {
      this.logger.log('Parameters...', email, password);
      const user = await this.authService.validateUser(email, password);
      this.logger.log('User encontrado...', user);
      if (user) {
        const token = await this.authService.generateToken(user);
        return { message: 'Login successful!', token };
      } else {
        throw new HttpException('Invalid username or password', HttpStatus.NOT_FOUND);
      }
    }

}
