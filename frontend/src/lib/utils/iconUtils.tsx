import { IoFolder, IoTrophy } from 'react-icons/io5'

/**
 * Проверяет, является ли iconUrl URL изображения
 */
export const isImageUrl = (iconUrl: string | null): boolean => {
  if (!iconUrl) return false
  
  // Проверяем абсолютные URL (http/https)
  if (iconUrl.startsWith('http://') || iconUrl.startsWith('https://')) {
    return true
  }
  
  // Проверяем относительные пути, начинающиеся с /
  if (iconUrl.startsWith('/')) {
    // Проверяем расширения изображений
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp']
    const lowerIconUrl = iconUrl.toLowerCase()
    return imageExtensions.some(ext => lowerIconUrl.endsWith(ext))
  }
  
  return false
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
          objectFit: 'cover',
          borderRadius: 'inherit',
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
        }}
      />
    )
  }

  return iconUrl
}
