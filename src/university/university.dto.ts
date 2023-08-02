/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class UniversityDto {

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    description:string;

    @IsString()
    @IsNotEmpty()
    country:string;

    @IsString()
    @IsNotEmpty()
    address:string;

    @IsUrl()
    @IsNotEmpty()
    image:string;
}
