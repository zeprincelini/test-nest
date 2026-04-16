import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'email must be an email' })
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;
}
