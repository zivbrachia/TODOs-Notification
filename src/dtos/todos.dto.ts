import { IsString, IsNotEmpty, MaxLength, IsDateString } from 'class-validator';
import { IsFutureDateString } from '@/validators/isFutureDateString.validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  public note: string;

  @IsFutureDateString()
  public notify: string;
}

export class UpdateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  public note: string;

  @IsFutureDateString()
  public notify: string;
}
