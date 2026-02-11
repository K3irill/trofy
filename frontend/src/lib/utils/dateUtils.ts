/**
 * Форматирует дату в относительное время (например, "2 дня назад", "1 неделя назад")
 */
export function formatRelativeDate(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) {
    return 'только что'
  } else if (diffMins < 60) {
    return `${diffMins} ${getPluralForm(diffMins, 'минуту', 'минуты', 'минут')} назад`
  } else if (diffHours < 24) {
    return `${diffHours} ${getPluralForm(diffHours, 'час', 'часа', 'часов')} назад`
  } else if (diffDays < 7) {
    return `${diffDays} ${getPluralForm(diffDays, 'день', 'дня', 'дней')} назад`
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${getPluralForm(diffWeeks, 'неделю', 'недели', 'недель')} назад`
  } else if (diffMonths < 12) {
    return `${diffMonths} ${getPluralForm(diffMonths, 'месяц', 'месяца', 'месяцев')} назад`
  } else {
    return `${diffYears} ${getPluralForm(diffYears, 'год', 'года', 'лет')} назад`
  }
}

/**
 * Возвращает правильную форму слова в зависимости от числа
 */
function getPluralForm(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) {
    return one
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few
  } else {
    return many
  }
}
