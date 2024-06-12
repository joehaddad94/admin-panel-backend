import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  reset_token?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  newPassword?: string;
}
