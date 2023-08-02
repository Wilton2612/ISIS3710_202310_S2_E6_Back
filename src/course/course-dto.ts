/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from "class-validator";

export class CourseDto {

    @IsString()
    @IsNotEmpty()
    readonly name : string

    
    @IsString()
    @IsNotEmpty()
    readonly section : string

    
    @IsString()
    @IsNotEmpty()
    readonly code : string

    
    @IsString()
    @IsNotEmpty()
    readonly department : string

    @IsString()
    @IsNotEmpty()
    readonly image:string;
}
