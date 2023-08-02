
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class NoteDto {

   @IsString()
   //@IsNotEmpty()
   readonly title: string;

   @IsString()
   //@IsNotEmpty()
   readonly text: string;

   @IsUrl()
   //@IsNotEmpty()
   readonly icon: string;

   @IsUrl()
   //@IsNotEmpty()
   readonly portada: string;

   @IsString()
   //@IsNotEmpty()
   readonly accessible: string;

   @IsString()
   //@IsNotEmpty()
   readonly publicationDate: string;
}