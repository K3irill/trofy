'use client'

import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose, IoCameraOutline } from 'react-icons/io5'
import styled from 'styled-components'
import { getAccessToken } from '@/lib/auth/tokenStorage'
import { useGetMeQuery } from '@/store/api/userApi'
import { useToast } from '@/hooks/useToast'

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: ${(props) => props.theme.colors.dark[800]};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  position: relative;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

const ModalTitle = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.dark[700]};
  border: 1px solid ${(props) => props.theme.colors.dark[600]};
  color: ${(props) => props.theme.colors.light[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.danger};
    border-color: ${(props) => props.theme.colors.danger};
    color: ${(props) => props.theme.colors.light[100]};
  }
`

const CropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: ${(props) => props.theme.colors.dark[900]};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
`

const ControlsContainer = styled.div`
  margin-bottom: 1.5rem;
`

const ControlLabel = styled.label`
  display: block;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${(props) => props.theme.colors.dark[600]};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 0 10px ${(props) => props.theme.colors.primary}80;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.primary};
    cursor: pointer;
    border: none;
    box-shadow: 0 0 10px ${(props) => props.theme.colors.primary}80;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: ${props.theme.colors.light[100]};
    
    &:hover {
      background: ${props.theme.colors.secondary};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: ${props.theme.colors.dark[700]};
    color: ${props.theme.colors.light[300]};
    border: 1px solid ${props.theme.colors.dark[600]};
    
    &:hover {
      background: ${props.theme.colors.dark[600]};
      color: ${props.theme.colors.light[100]};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const FileInput = styled.input`
  display: none;
`

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: ${(props) => props.theme.colors.dark[700]};
  border: 2px dashed ${(props) => props.theme.colors.dark[600]};
  border-radius: 12px;
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: ${(props) => props.theme.colors.dark[600]};
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }
`

interface AvatarUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

type Area = {
  x: number
  y: number
  width: number
  height: number
}

export function AvatarUploadModal({ isOpen, onClose }: AvatarUploadModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { refetch } = useGetMeQuery()
  const { showToast, ToastComponent } = useToast()

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверка размера файла (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Размер файла превышает 10MB', 'error')
      return
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      showToast('Пожалуйста, выберите изображение', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

    canvas.width = safeArea
    canvas.height = safeArea

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    )

    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        }
      }, 'image/jpeg', 0.95)
    })
  }

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setIsUploading(true)
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)

      const formData = new FormData()
      formData.append('avatar', croppedImage, 'avatar.jpg')

      // Используем тот же базовый URL, что и в RTK Query
      // Если NEXT_PUBLIC_API_URL начинается с /, это относительный путь
      // Иначе это полный URL
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
      const uploadUrl = API_BASE_URL.startsWith('http')
        ? `${API_BASE_URL}/users/me/avatar`
        : `${API_BASE_URL}/users/me/avatar`

      const token = getAccessToken()
      if (!token) {
        showToast('Необходима авторизация', 'error')
        return
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          // Не устанавливаем Content-Type - браузер установит автоматически с boundary для FormData
        },
      })

      if (!response.ok) {
        // Проверяем, является ли ответ JSON
        const contentType = response.headers.get('content-type') || ''
        let errorMessage = 'Ошибка загрузки аватарки'

        if (contentType.includes('application/json')) {
          try {
            const error = await response.json()
            errorMessage = error.error || error.message || errorMessage
          } catch (e) {
            console.error('Failed to parse error JSON:', e)
          }
        } else {
          // Если ответ не JSON, читаем как текст для диагностики
          const text = await response.text()
          errorMessage = `Ошибка сервера (${response.status}): ${response.statusText}`
        }

        throw new Error(errorMessage)
      }

      // Проверяем, что ответ JSON перед парсингом
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Сервер вернул неожиданный формат ответа')
      }

      await response.json()

      // Обновляем данные пользователя
      await refetch()

      // Показываем уведомление об успехе перед закрытием
      showToast('Аватарка успешно загружена!', 'success')

      // Закрываем модалку и сбрасываем состояние
      onClose()
      setImageSrc(null)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      showToast(error.message || 'Не удалось загрузить аватарку', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    onClose()
  }

  if (!isOpen) return <ToastComponent />

  return (
    <>
      {createPortal(
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Загрузка аватарки</ModalTitle>
              <CloseButton onClick={handleCancel}>
                <IoClose size={20} />
              </CloseButton>
            </ModalHeader>

            {!imageSrc ? (
              <>
                <FileInput
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <FileInputLabel htmlFor="avatar-upload">
                  <IoCameraOutline size={20} />
                  Выбрать изображение
                </FileInputLabel>
              </>
            ) : (
              <>
                <CropContainer>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </CropContainer>

                <ControlsContainer>
                  <ControlLabel>Масштаб</ControlLabel>
                  <Slider
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                </ControlsContainer>

                <ButtonGroup>
                  <Button variant="secondary" onClick={handleCancel} disabled={isUploading}>
                    Отмена
                  </Button>
                  <Button variant="primary" onClick={handleSave} disabled={isUploading || !croppedAreaPixels}>
                    {isUploading ? 'Загрузка...' : 'Сохранить'}
                  </Button>
                </ButtonGroup>
              </>
            )}
          </ModalContainer>
        </ModalOverlay>,
        document.body
      )}
      <ToastComponent />
    </>
  )
}
