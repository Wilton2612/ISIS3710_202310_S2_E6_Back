import {IsNotEmpty, IsString, IsUrl, IsEmail} from 'class-validator';

export class UserDto {

    @IsString()
    //@IsNotEmpty()
    readonly name: string;

    @IsEmail()
    //@IsNotEmpty()
    readonly email: string;

    @IsString()
    //@IsNotEmpty()
    readonly password: string;

    @IsUrl()
    readonly image: string;

    @IsString()
    readonly user: string;

    @IsString()
    //@IsNotEmpty()
    readonly userType: string;

}
