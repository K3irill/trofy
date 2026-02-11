import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'

export enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export enum SortBy {
  DEFAULT = 'default',
  UNLOCKED_ASC = 'unlocked-asc',
  UNLOCKED_DESC = 'unlocked-desc',
  DATE_ASC = 'date-asc',
  DATE_DESC = 'date-desc',
  XP_ASC = 'xp-asc',
  XP_DESC = 'xp-desc',
}

export class GetAchievementsDto {
  @IsString()
  @IsOptional()
  query?: string

  @IsString()
  @IsOptional()
  categoryId?: string

  @IsEnum(Rarity)
  @IsOptional()
  rarity?: Rarity

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  unlocked?: boolean

  @IsEnum(SortBy)
  @IsOptional()
  sortBy?: SortBy

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset?: number
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  icon_url?: string
}

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsOptional()
  icon_url?: string

  @IsEnum(Rarity)
  @IsOptional()
  rarity?: Rarity

  @IsString()
  @IsNotEmpty()
  category_id: string

  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  @Type(() => Number)
  xp_reward?: number
}
