export interface Category {
  id: string
  name: string
  icon: string
  total: number
  unlocked: number
  achievements: AchievementPreview[]
}

export interface AchievementPreview {
  id: string
  icon: string
  unlocked: boolean
  name?: string
  description?: string
}

export const categories: Category[] = [
  {
    id: 'transport',
    name: 'Транспорт',
    icon: '🚗',
    total: 12,
    unlocked: 4,
    achievements: [
      { id: '1', icon: '🚗', unlocked: true, name: 'Права категории B', description: 'Получил права на управление легковым автомобилем' },
      { id: '2', icon: '🏍', unlocked: true, name: 'Права категории A', description: 'Получил права на управление мотоциклом' },
      { id: '3', icon: '🚂', unlocked: true, name: 'Поездка на поезде', description: 'Совершил поездку на поезде' },
      { id: '4', icon: '🚁', unlocked: true, name: 'Полёт на вертолёте', description: 'Совершил полёт на вертолёте' },
      { id: '5', icon: '✈', unlocked: false, name: 'Первый полёт', description: 'Совершил первый полёт на самолёте' },
      { id: '6', icon: '🚠', unlocked: false, name: 'Канатная дорога', description: 'Проехал на канатной дороге' },
      { id: '7', icon: '🚲', unlocked: false, name: 'Велосипед', description: 'Научился ездить на велосипеде' },
      { id: '8', icon: '⛴', unlocked: false, name: 'Морское путешествие', description: 'Совершил морское путешествие' },
    ],
  },
  {
    id: 'travel',
    name: 'Путешествия',
    icon: '✈️',
    total: 10,
    unlocked: 3,
    achievements: [
      { id: '9', icon: '🌍', unlocked: true, name: 'Посетил Европу', description: 'Побывал в Европе' },
      { id: '10', icon: '🗺', unlocked: true, name: 'Исследователь', description: 'Посетил 5 разных стран' },
      { id: '11', icon: '🗽', unlocked: true, name: 'Статуя Свободы', description: 'Увидел Статую Свободы' },
      { id: '12', icon: '🗼', unlocked: false, name: 'Эйфелева башня', description: 'Посетил Париж и Эйфелеву башню' },
      { id: '13', icon: '🏰', unlocked: false, name: 'Средневековый замок', description: 'Посетил средневековый замок' },
      { id: '14', icon: '🗽', unlocked: false, name: 'Нью-Йорк', description: 'Побывал в Нью-Йорке' },
      { id: '15', icon: '🌎', unlocked: false, name: 'Путешественник', description: 'Посетил 10 разных стран' },
      { id: '16', icon: '🏯', unlocked: false, name: 'Азия', description: 'Побывал в Азии' },
      { id: '17', icon: '🏰', unlocked: false, name: 'Замки Европы', description: 'Посетил 3 европейских замка' },
      { id: '18', icon: '🎡', unlocked: false, name: 'Колесо обозрения', description: 'Прокатился на колесе обозрения' },
    ],
  },
  {
    id: 'relationships',
    name: 'Отношения',
    icon: '💕',
    total: 8,
    unlocked: 2,
    achievements: [
      { id: '19', icon: '👩', unlocked: true },
      { id: '20', icon: '💑', unlocked: true },
      { id: '21', icon: '💏�', unlocked: false },
      { id: '22', icon: '💎', unlocked: false },
      { id: '23', icon: '👪', unlocked: false },
      { id: '24', icon: '👰', unlocked: false },
      { id: '25', icon: '🚬', unlocked: false },
      { id: '26', icon: '👼', unlocked: false },
    ],
  },
  {
    id: 'skills',
    name: 'Навыки',
    icon: '⭐',
    total: 15,
    unlocked: 5,
    achievements: [
      { id: '27', icon: '🎹', unlocked: true, name: 'Пианино', description: 'Научился играть на пианино' },
      { id: '28', icon: '🎸', unlocked: true, name: 'Гитара', description: 'Научился играть на гитаре' },
      { id: '29', icon: '🎤', unlocked: true, name: 'Пение', description: 'Научился петь' },
      { id: '30', icon: '🎺', unlocked: true, name: 'Труба', description: 'Научился играть на трубе' },
      { id: '31', icon: '🎻', unlocked: true, name: 'Скрипка', description: 'Научился играть на скрипке' },
      { id: '32', icon: '🎨', unlocked: false, name: 'Рисование', description: 'Научился рисовать' },
      { id: '33', icon: '🎬', unlocked: false, name: 'Кино', description: 'Снял свой фильм' },
      { id: '34', icon: '🎭', unlocked: false, name: 'Театр', description: 'Выступил на сцене' },
      { id: '35', icon: '🪘', unlocked: false, name: 'Барабаны', description: 'Научился играть на барабанах' },
      { id: '36', icon: '🎪', unlocked: false, name: 'Цирк', description: 'Посетил цирк' },
      { id: '37', icon: '🎫', unlocked: false, name: 'Билет', description: 'Купил билет на концерт' },
      { id: '38', icon: '🎯', unlocked: false, name: 'Меткость', description: 'Развил меткость' },
      { id: '39', icon: '🎱', unlocked: false, name: 'Бильярд', description: 'Научился играть в бильярд' },
      { id: '40', icon: '🎲', unlocked: false, name: 'Игры', description: 'Изучил настольные игры' },
      { id: '41', icon: '🥁', unlocked: false, name: 'Ударные', description: 'Освоил ударные инструменты' },
    ],
  },
  {
    id: 'sports',
    name: 'Спорт',
    icon: '🏆',
    total: 10,
    unlocked: 4,
    achievements: [
      { id: '42', icon: '⚽', unlocked: true },
      { id: '43', icon: '🏀', unlocked: true },
      { id: '44', icon: '🏈', unlocked: true },
      { id: '45', icon: '🏐', unlocked: true },
      { id: '46', icon: '🏏', unlocked: false },
      { id: '47', icon: '🏑', unlocked: false },
      { id: '48', icon: '🏒', unlocked: false },
      { id: '49', icon: '🏓', unlocked: false },
      { id: '50', icon: '🏏�', unlocked: false },
      { id: '51', icon: '🥊', unlocked: false },
    ],
  },
  {
    id: 'career',
    name: 'Карьера',
    icon: '💼',
    total: 8,
    unlocked: 3,
    achievements: [
      { id: '52', icon: '🎓', unlocked: true, name: 'Диплом', description: 'Получил диплом' },
      { id: '53', icon: '📜', unlocked: true, name: 'Сертификат', description: 'Получил сертификат' },
      { id: '54', icon: '🎖', unlocked: true, name: 'Награда', description: 'Получил награду' },
      { id: '55', icon: '🎭', unlocked: false, name: 'Актёр', description: 'Развил актёрские навыки' },
      { id: '56', icon: '🎬', unlocked: false, name: 'Режиссёр', description: 'Снял свой проект' },
      { id: '57', icon: '🎪', unlocked: false, name: 'Выступление', description: 'Выступил публично' },
      { id: '58', icon: '🎫', unlocked: false, name: 'Конференция', description: 'Посетил конференцию' },
      { id: '59', icon: '🎯', unlocked: false, name: 'Цель', description: 'Достиг важной цели' },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Образ жизни',
    icon: '🌟',
    total: 6,
    unlocked: 2,
    achievements: [
      { id: '60', icon: '🏠', unlocked: true, name: 'Свой дом', description: 'Приобрёл собственный дом' },
      { id: '61', icon: '🏡', unlocked: true, name: 'Загородный дом', description: 'Купил загородный дом' },
      { id: '62', icon: '🏢', unlocked: false, name: 'Офис', description: 'Открыл свой офис' },
      { id: '63', icon: '🏣', unlocked: false, name: 'Почта', description: 'Посетил почтовое отделение' },
      { id: '64', icon: '🏤', unlocked: false, name: 'Бизнес', description: 'Открыл свой бизнес' },
      { id: '65', icon: '🏥', unlocked: false, name: 'Здоровье', description: 'Позаботился о здоровье' },
      { id: '66', icon: '🏦', unlocked: false, name: 'Банк', description: 'Открыл счёт в банке' },
    ],
  },
]
