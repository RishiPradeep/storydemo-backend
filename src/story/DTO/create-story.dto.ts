import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  story: string;
  @IsString()
  @IsNotEmpty()
  visibility: string;
}
