'use client'

import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  min-height: 200px;
`

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${(props) => props.theme.colors.dark[600]};
  border-top-color: ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const Text = styled.div`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  font-weight: 500;
  animation: ${pulse} 1.5s ease-in-out infinite;
`

interface BlockLoaderProps {
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export function BlockLoader({ text = 'Загрузка...', size = 'medium' }: BlockLoaderProps) {
  const spinnerSize = {
    small: '32px',
    medium: '48px',
    large: '64px',
  }[size]

  const borderWidth = {
    small: '3px',
    medium: '4px',
    large: '5px',
  }[size]

  return (
    <LoaderContainer>
      <Spinner
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: borderWidth,
        }}
      />
      {text && <Text>{text}</Text>}
    </LoaderContainer>
  )
}
