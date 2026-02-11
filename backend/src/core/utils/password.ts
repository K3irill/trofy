import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

/**
 * Хеширует пароль
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Сравнивает пароль с хешем
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
