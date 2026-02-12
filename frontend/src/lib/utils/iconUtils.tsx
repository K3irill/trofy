import { IoFolder, IoTrophy } from 'react-icons/io5'

/**
 * Проверяет, является ли iconUrl URL изображения
 */
export const isImageUrl = (iconUrl: string | null): boolean => {
  if (!iconUrl) return false
  return iconUrl.startsWith('http://') || iconUrl.startsWith('https://')
}

/**
 * Рендерит иконку в зависимости от типа (URL изображения или эмодзи)
 */
export const renderIcon = (
  iconUrl: string | null,
  fallback: 'folder' | 'trophy' = 'folder',
  className?: string
): React.ReactNode => {
  if (!iconUrl) {
    if (fallback === 'trophy') {
      return <IoTrophy style={{ width: '100%', height: '100%' }} />
    }
    return <IoFolder style={{ width: '100%', height: '100%' }} />
  }

  if (isImageUrl(iconUrl)) {
    return (
      <img
        src={iconUrl}
        alt=""
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    )
  }

  return iconUrl
}
