'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import Image from 'next/image'
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import {
  SwiperContainer,
  SwiperWrapper,
  SwiperSlideContent,
  SwiperImage,
  ZoomModal,
  ZoomModalOverlay,
  ZoomModalImage,
  ZoomModalClose,
  PhotoCounter,
} from './PhotoSwiper.styled'

interface PhotoSwiperProps {
  photos: string[]
}

export const PhotoSwiper = ({ photos }: PhotoSwiperProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

  if (!photos || photos.length === 0) {
    return null
  }

  const handleImageClick = (photo: string, index: number) => {
    setSelectedImage(photo)
    setSelectedIndex(index)
  }

  const closeZoom = () => {
    setSelectedImage(null)
  }

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % photos.length
    setSelectedIndex(nextIndex)
    setSelectedImage(photos[nextIndex])
  }

  const handlePrev = () => {
    const prevIndex = (selectedIndex - 1 + photos.length) % photos.length
    setSelectedIndex(prevIndex)
    setSelectedImage(photos[prevIndex])
  }

  const getImageUrl = (photo: string) => {
    if (photo.startsWith('http')) return photo
    return `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${photo}`
  }

  return (
    <>
      <SwiperContainer>
        <SwiperWrapper>
          <Swiper
            modules={[Navigation, Pagination, Thumbs]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            className="main-swiper"
          >
            {photos.map((photo, index) => (
              <SwiperSlide key={index}>
                <SwiperSlideContent onClick={() => handleImageClick(photo, index)}>
                  <SwiperImage>
                    <Image
                      src={getImageUrl(photo)}
                      alt={`Фото ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="100vw"
                      unoptimized={process.env.NODE_ENV === 'development'}
                    />
                  </SwiperImage>
                </SwiperSlideContent>
              </SwiperSlide>
            ))}
          </Swiper>

          {photos.length > 1 && (
            <Swiper
              modules={[FreeMode, Thumbs]}
              onSwiper={setThumbsSwiper}
              spaceBetween={12}
              slidesPerView={photos.length > 4 ? 4 : photos.length}
              freeMode={true}
              watchSlidesProgress={true}
              className="thumbs-swiper"
            >
              {photos.map((photo, index) => (
                <SwiperSlide key={index}>
                  <SwiperSlideContent $isThumb onClick={() => handleImageClick(photo, index)}>
                    <SwiperImage $isThumb>
                      <Image
                        src={getImageUrl(photo)}
                        alt={`Миниатюра ${index + 1}`}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="(max-width: 768px) 25vw, 20vw"
                        unoptimized={process.env.NODE_ENV === 'development'}
                      />
                    </SwiperImage>
                  </SwiperSlideContent>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <div className="swiper-button-prev-custom">
            <IoChevronBack />
          </div>
          <div className="swiper-button-next-custom">
            <IoChevronForward />
          </div>
        </SwiperWrapper>
      </SwiperContainer>

      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedImage && (
              <ZoomModalOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeZoom}
              >
                <ZoomModal
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ZoomModalClose onClick={closeZoom}>
                    <IoClose />
                  </ZoomModalClose>
                  {photos.length > 1 && (
                    <>
                      <PhotoCounter>
                        {selectedIndex + 1} / {photos.length}
                      </PhotoCounter>
                      <div className="modal-nav-button modal-nav-prev" onClick={handlePrev}>
                        <IoChevronBack />
                      </div>
                      <div className="modal-nav-button modal-nav-next" onClick={handleNext}>
                        <IoChevronForward />
                      </div>
                    </>
                  )}
                  <ZoomModalImage>
                    <Image
                      src={getImageUrl(selectedImage)}
                      alt="Увеличенное фото"
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="90vw"
                      unoptimized={process.env.NODE_ENV === 'development'}
                    />
                  </ZoomModalImage>
                </ZoomModal>
              </ZoomModalOverlay>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
