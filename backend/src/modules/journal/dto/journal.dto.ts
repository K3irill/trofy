import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsUUID, IsObject } from 'class-validator'

export enum JournalEntryType {
  NOTE = 'NOTE',
  TASK = 'TASK',
  TOPIC = 'TOPIC',
  IDEA = 'IDEA',
}

export class CreateJournalEntryDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsObject()
  @IsNotEmpty()
  content: object // TipTap JSON content

  @IsEnum(JournalEntryType)
  @IsOptional()
  type?: JournalEntryType

  @IsUUID('4')
  @IsOptional()
  folder_id?: string

  @IsUUID('4', { each: true })
  @IsOptional()
  tag_ids?: string[]
}

export class UpdateJournalEntryDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsObject()
  @IsOptional()
  content?: object

  @IsEnum(JournalEntryType)
  @IsOptional()
  type?: JournalEntryType

  @IsUUID('4')
  @IsOptional()
  folder_id?: string | null

  @IsUUID('4', { each: true })
  @IsOptional()
  tag_ids?: string[]
}

export class CreateJournalFolderDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  color?: string

  @IsString()
  @IsOptional()
  icon?: string

  @IsUUID('4')
  @IsOptional()
  parent_id?: string
}

export class UpdateJournalFolderDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  color?: string

  @IsString()
  @IsOptional()
  icon?: string

  @IsUUID('4')
  @IsOptional()
  parent_id?: string | null
}

export class CreateJournalTagDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  color?: string
}

export class UpdateJournalTagDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  color?: string
}

export class GetJournalEntriesDto {
  @IsEnum(JournalEntryType)
  @IsOptional()
  type?: JournalEntryType

  @IsUUID('4')
  @IsOptional()
  folder_id?: string

  @IsUUID('4')
  @IsOptional()
  tag_id?: string

  @IsString()
  @IsOptional()
  search?: string

  @IsBoolean()
  @IsOptional()
  is_pinned?: boolean

  @IsBoolean()
  @IsOptional()
  is_archived?: boolean
}
