import { IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class CommentDto {

   @IsNumber()
   @IsNotEmpty()
   readonly rating: number;

   @IsString()
   @IsNotEmpty()
   readonly text: string;

   
}