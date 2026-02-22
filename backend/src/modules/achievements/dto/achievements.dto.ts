import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsISO8601,
  IsArray,
  ValidateNested,
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
  @Max(1000)
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

export class CreateAchievementsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAchievementDto)
  achievements: CreateAchievementDto[]
}

export class CompleteAchievementDto {
  @IsString()
  @IsNotEmpty()
  completion_date: string

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  difficulty?: number

  @IsString()
  @IsOptional()
  impressions?: string
}

export class UpdateAchievementDto {
  @IsString()
  @IsOptional()
  completion_date?: string

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  difficulty?: number

  @IsString()
  @IsOptional()
  impressions?: string
}

export class UpdateAchievementSettingsDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  is_main?: boolean

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  is_hidden?: boolean

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  can_like?: boolean

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  can_comment?: boolean

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  is_public?: boolean
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string

  @IsString()
  @IsOptional()
  parent_comment_id?: string
}

export class UpdateProgressDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  progress: number
}

export class RoadmapNodeDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsNotEmpty()
  position: {
    x: number
    y: number
  }

  @IsNotEmpty()
  data: Record<string, any>
}

export class RoadmapEdgeDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  source: string

  @IsString()
  @IsNotEmpty()
  target: string
}

export class CreateOrUpdateRoadmapDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoadmapNodeDto)
  nodes: RoadmapNodeDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoadmapEdgeDto)
  edges: RoadmapEdgeDto[]
}
