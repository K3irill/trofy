import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator'

export enum PlatformType {
  WEB = 'WEB',
  VK = 'VK',
  TELEGRAM = 'TELEGRAM',
}

export class LoginDto {
  @IsString()
  login: string // email или телефон

  @IsString()
  @MinLength(6)
  password: string
}

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone must be a valid phone number',
  })
  phone?: string

  @IsString()
  @MinLength(6)
  password: string
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string
}

export class LinkPlatformDto {
  @IsEnum(PlatformType)
  platform: PlatformType

  @IsString()
  platform_user_id: string

  @IsOptional()
  @IsString()
  access_token?: string
}
