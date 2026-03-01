import { IsString, MinLength } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  current_password: string

  @IsString()
  @MinLength(6, { message: 'Новый пароль должен содержать минимум 6 символов' })
  new_password: string
}
