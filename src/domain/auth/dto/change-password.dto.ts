import { IsString, MinLength, IsNotEmpty, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  reset_token: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
