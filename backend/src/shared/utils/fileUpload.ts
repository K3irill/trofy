import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'achievements')
const AVATAR_DIR = path.join(process.cwd(), 'uploads', 'avatars')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

// Создаем директории если их нет
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}
if (!fs.existsSync(AVATAR_DIR)) {
  fs.mkdirSync(AVATAR_DIR, { recursive: true })
}

export interface UploadedFile {
  originalName: string
  filename: string
  path: string
  url: string
  size: number
  mimeType: string
}

/**
 * Валидация файла
 */
export function validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Файл не предоставлен' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `Размер файла превышает ${MAX_FILE_SIZE / 1024 / 1024}MB` }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { valid: false, error: 'Неподдерживаемый тип файла. Разрешены: JPEG, PNG, WebP, GIF' }
  }

  return { valid: true }
}

/**
 * Сохранение файла из буфера
 */
export async function saveFileFromBuffer(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  userAchievementId: string
): Promise<UploadedFile> {
  // Валидация размера
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`Размер файла превышает ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Валидация типа
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw new Error('Неподдерживаемый тип файла. Разрешены: JPEG, PNG, WebP, GIF')
  }

  // Создаем директорию для конкретного достижения
  const achievementDir = path.join(UPLOAD_DIR, userAchievementId)
  if (!fs.existsSync(achievementDir)) {
    fs.mkdirSync(achievementDir, { recursive: true })
  }

  // Генерируем уникальное имя файла
  const ext = path.extname(originalName) || '.jpg'
  const filename = `${uuidv4()}${ext}`
  const filePath = path.join(achievementDir, filename)

  // Сохраняем файл
  fs.writeFileSync(filePath, buffer)

  // Генерируем URL для доступа к файлу
  const url = `/uploads/achievements/${userAchievementId}/${filename}`

  return {
    originalName,
    filename,
    path: filePath,
    url,
    size: buffer.length,
    mimeType: mimetype,
  }
}

/**
 * Удаление файла
 */
export function deleteFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

/**
 * Удаление всех файлов достижения
 */
export function deleteAchievementFiles(userAchievementId: string): void {
  const achievementDir = path.join(UPLOAD_DIR, userAchievementId)
  if (fs.existsSync(achievementDir)) {
    fs.rmSync(achievementDir, { recursive: true, force: true })
  }
}

/**
 * Сохранение аватарки пользователя
 */
export async function saveAvatar(
  buffer: Buffer,
  mimetype: string,
  userId: string
): Promise<UploadedFile> {
  // Валидация размера
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`Размер файла превышает ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Валидация типа
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw new Error('Неподдерживаемый тип файла. Разрешены: JPEG, PNG, WebP, GIF')
  }

  // Удаляем старую аватарку если есть
  const files = fs.readdirSync(AVATAR_DIR).filter((file) => file.startsWith(`${userId}_`))
  files.forEach((file) => {
    const filePath = path.join(AVATAR_DIR, file)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  })

  // Генерируем уникальное имя файла
  const ext = mimetype === 'image/jpeg' ? '.jpg' : mimetype === 'image/png' ? '.png' : '.jpg'
  const filename = `${userId}_${uuidv4()}${ext}`
  const filePath = path.join(AVATAR_DIR, filename)

  // Сохраняем файл
  fs.writeFileSync(filePath, buffer)

  // Генерируем URL для доступа к файлу
  const url = `/uploads/avatars/${filename}`

  return {
    originalName: 'avatar',
    filename,
    path: filePath,
    url,
    size: buffer.length,
    mimeType: mimetype,
  }
}

/**
 * Удаление аватарки
 */
export function deleteAvatar(avatarPath: string): void {
  if (avatarPath && fs.existsSync(avatarPath)) {
    fs.unlinkSync(avatarPath)
  }
}
