import styled from 'styled-components'
import { motion } from 'framer-motion'

export const SwiperContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
  padding: 0;
`

export const SwiperWrapper = styled.div`
  position: relative;
  width: 100%;

  .main-swiper {
    margin-bottom: 1rem;
    border-radius: 16px;
    overflow: hidden;
    padding-bottom: 3rem !important; // Добавляем место для пагинации
  }

  .thumbs-swiper {
    margin-top: 1rem;
    padding: 0.5rem 0;

    .swiper-slide {
      opacity: 0.6;
      transition: opacity 0.3s ease;

      &.swiper-slide-thumb-active {
        opacity: 1;
      }
    }
  }

  .swiper-button-prev-custom,
  .swiper-button-next-custom {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    background: rgba(31, 41, 55, 0.9);
    backdrop-filter: blur(10px);
    border: 2px solid ${(props) => props.theme.colors.primary}60;
    border-radius: 50%;
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.3s ease;
    font-size: 1.5rem;

    &:hover {
      background: ${(props) => props.theme.colors.primary};
      color: ${(props) => props.theme.colors.dark[900]};
      transform: translateY(-50%) scale(1.1);
      box-shadow: ${(props) => props.theme.shadows.glow.primary};
    }

    &:active {
      transform: translateY(-50%) scale(0.95);
    }

    &.swiper-button-disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .swiper-button-prev-custom {
    left: 1rem;
  }

  .swiper-button-next-custom {
    right: 1rem;
  }

  .swiper-pagination {
    bottom: 0.5rem !important;
    padding: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    height: auto;
    overflow: visible;
  }

  .swiper-pagination-bullet {
    background: ${(props) => props.theme.colors.primary};
    opacity: 0.4;
    width: 10px;
    height: 10px;
    transition: all 0.3s ease;
    margin: 0 !important;
    flex-shrink: 0;

    &-active {
      opacity: 1;
      transform: scale(1.4);
      background: ${(props) => props.theme.colors.primary};
    }
  }

  @media (max-width: 768px) {
    .swiper-button-prev-custom,
    .swiper-button-next-custom {
      width: 40px;
      height: 40px;
      font-size: 1.25rem;
    }

    .swiper-button-prev-custom {
      left: 0.5rem;
    }

    .swiper-button-next-custom {
      right: 0.5rem;
    }
  }
`

export const SwiperSlideContent = styled.div<{ $isThumb?: boolean }>`
  position: relative;
  border-radius: ${(props) => (props.$isThumb ? '12px' : '16px')};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => props.theme.colors.dark[700]};
  border: ${(props) => (props.$isThumb ? '2px' : '3px')} solid ${(props) => props.theme.colors.dark[600]}50;
  box-shadow: ${(props) => props.theme.shadows.glass.medium};
  ${(props) => !props.$isThumb && 'height: auto;'}

  &:hover {
    transform: ${(props) => (props.$isThumb ? 'scale(1.05)' : 'translateY(-8px) scale(1.02)')};
    box-shadow: ${(props) => props.theme.shadows.glow.primary}60, ${(props) => props.theme.shadows.glass.heavy};
    border-color: ${(props) => props.theme.colors.primary}80;
  }
`

export const SwiperImage = styled.div<{ $isThumb?: boolean }>`
  position: relative;
  width: 100%;
  ${(props) =>
    props.$isThumb
      ? `
    height: 80px;
    min-height: 80px;
  `
      : `
    padding-bottom: 66.67%; // 3:2 aspect ratio для основного
  `}
  overflow: hidden;
  border-radius: ${(props) => (props.$isThumb ? '10px' : '14px')};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.dark[800]};

  img {
    transition: transform 0.3s ease;
    object-position: center;
    ${(props) =>
      props.$isThumb &&
      `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `}
  }

  ${SwiperSlideContent}:hover & img {
    transform: scale(1.08);
  }
`

export const ZoomModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const ZoomModal = styled(motion.div)`
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
    background: rgba(31, 41, 55, 0.9);
    backdrop-filter: blur(10px);
    border: 2px solid ${(props) => props.theme.colors.primary}60;
    border-radius: 50%;
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.3s ease;
    font-size: 1.75rem;

    &:hover {
      background: ${(props) => props.theme.colors.primary};
      color: ${(props) => props.theme.colors.dark[900]};
      transform: translateY(-50%) scale(1.1);
      box-shadow: ${(props) => props.theme.shadows.glow.primary};
    }

    &.modal-nav-prev {
      left: 1rem;
    }

    &.modal-nav-next {
      right: 1rem;
    }

    @media (max-width: 768px) {
      width: 44px;
      height: 44px;
      font-size: 1.5rem;

      &.modal-nav-prev {
        left: 0.5rem;
      }

      &.modal-nav-next {
        right: 0.5rem;
      }
    }
  }
`

export const ZoomModalImage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.glass.heavy}, ${(props) => props.theme.shadows.glow.primary};
  background: ${(props) => props.theme.colors.dark[900]};
`

export const ZoomModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 48px;
  height: 48px;
  background: rgba(31, 41, 55, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => props.theme.colors.primary}60;
  border-radius: 50%;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.dark[900]};
    transform: rotate(90deg) scale(1.1);
    box-shadow: ${(props) => props.theme.shadows.glow.primary};
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    top: 0.5rem;
    right: 0.5rem;
  }
`

export const PhotoCounter = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(31, 41, 55, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => props.theme.colors.primary}60;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 10;

  @media (max-width: 768px) {
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
`
