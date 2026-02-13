/**
 * Расчет уровня на основе опыта
 * Формула: уровень N требует (N-1)^2 * 100 XP
 * Например:
 * - Уровень 1: 0 XP
 * - Уровень 2: 100 XP (1^2 * 100)
 * - Уровень 3: 400 XP (2^2 * 100)
 * - Уровень 4: 900 XP (3^2 * 100)
 */
export function calculateLevel(xp: number): number {
  if (xp < 0) return 1
  if (xp < 100) return 1
  
  // Решаем уравнение: (level-1)^2 * 100 <= xp < level^2 * 100
  // level^2 * 100 > xp => level > sqrt(xp/100)
  // level = floor(sqrt(xp/100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1
}
