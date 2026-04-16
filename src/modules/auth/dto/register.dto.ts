import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Minimum must be 6 characters' })
  password: string;

  @IsString()
  name: string;
}
