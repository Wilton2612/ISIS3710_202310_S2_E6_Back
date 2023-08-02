import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
  
    try {
      const user = await this.userService.findOneByUser(email, password);
      return user;
    } catch (error) {
      if (error instanceof BusinessLogicException && error.code === BusinessError.NOT_FOUND) {
       
        return null;
      } else {
        
        throw new Error("Contraseña incorrecta");
      }
    }
  }

  async generateToken(usuario: UserEntity): Promise<string> {
    const payload = { username: usuario.user, sub: usuario.id };
    return this.jwtService.sign(payload);
  }
}
