'use client'

import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import styled from 'styled-components'

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
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  background: ${(props) => props.theme.colors.dark[800]};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy};
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100vh;
    padding: 1.5rem;
  }
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
  flex: 1;
  padding-right: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  appearance: none;

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
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
    color: ${props.theme.colors.dark[900]};
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px ${props.theme.colors.primary}40;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
      : `
    background: ${props.theme.colors.dark[700]};
    color: ${props.theme.colors.light[300]};
    border: 1px solid ${props.theme.colors.dark[600]};
    
    &:hover {
      background: ${props.theme.colors.dark[600]};
    }
  `}
`

type Area = {
  x: number
  y: number
  width: number
  height: number
}

interface ImageCropModalProps {
  isOpen: boolean
  imageSrc: string | null
  onClose: () => void
  onCropComplete: (croppedImageBlob: Blob) => void
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
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

  // Устанавливаем размеры canvas равными размерам обрезки
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Рисуем обрезанное изображение
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      }
    }, 'image/jpeg', 0.95)
  })
}

export function ImageCropModal({ isOpen, imageSrc, onClose, onCropComplete }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropCompleteCallback = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setIsProcessing(true)
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(croppedImage)
      onClose()
    } catch (error: unknown) {
      console.error('Error cropping image:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    onClose()
  }

  if (!isOpen || !imageSrc) return null

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && imageSrc && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCancel()
                }
              }}
            >
              <ModalContainer
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>Обрезка изображения</ModalTitle>
                  <CloseButton onClick={handleCancel}>
                    <IoClose size={20} />
                  </CloseButton>
                </ModalHeader>

                <CropContainer>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="rect"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropCompleteCallback}
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
                  <Button variant="secondary" onClick={handleCancel}>
                    Отмена
                  </Button>
                  <Button variant="primary" onClick={handleSave} disabled={isProcessing || !croppedAreaPixels}>
                    {isProcessing ? 'Обработка...' : 'Применить'}
                  </Button>
                </ButtonGroup>
              </ModalContainer>
            </ModalOverlay>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
