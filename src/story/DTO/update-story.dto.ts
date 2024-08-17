import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStoryDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  title: string | null;
  story: string | null;
}
