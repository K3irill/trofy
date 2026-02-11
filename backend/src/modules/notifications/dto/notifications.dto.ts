import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator'

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  message: string

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType

  @IsUUID('4')
  @IsOptional()
  user_id?: string // Если не указан, отправляется всем пользователям
}

export class UpdateNotificationDto {
  @IsBoolean()
  @IsOptional()
  is_read?: boolean
}
