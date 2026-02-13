import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  ValidateNested,
  MaxLength,
  IsArray,
  IsUUID,
  ArrayMaxSize,
} from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateBioDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string
}

export class UpdatePrivacySettingsDto {
  @IsBoolean()
  @IsOptional()
  show_achievements?: boolean

  @IsBoolean()
  @IsOptional()
  show_level?: boolean

  @IsBoolean()
  @IsOptional()
  show_profile?: boolean
}

export class UpdateProfileThemeDto {
  @IsString()
  @IsOptional()
  profile_theme_id?: string
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string

  @IsString()
  @IsOptional()
  profile_theme_id?: string

  @IsString()
  @IsOptional()
  main_info_theme?: string

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(10, { message: 'Maximum 10 background icons allowed' })
  @IsString({ each: true, message: 'Each icon must be a string' })
  background_icons?: string[]

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePrivacySettingsDto)
  privacy_settings?: UpdatePrivacySettingsDto

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(3, { message: 'Maximum 3 pinned achievements allowed' })
  @IsUUID('4', { each: true, message: 'Each achievement ID must be a valid UUID' })
  pinned_achievements?: string[]

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(2, { message: 'Maximum 2 priority achievements allowed' })
  @IsUUID('4', { each: true, message: 'Each achievement ID must be a valid UUID' })
  priority_achievements?: string[]

  @IsString()
  @IsOptional()
  avatar_url?: string
}
