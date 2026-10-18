import { IsEmail, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters' })
  newPassword: string;
}

export class SwitchRoleDto {
  @IsString()
  role: string;
}
