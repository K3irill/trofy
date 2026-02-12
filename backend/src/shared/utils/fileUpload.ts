import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'achievements')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

// Создаем директорию если её нет
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
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
