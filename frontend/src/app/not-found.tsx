'use client'

import Link from 'next/link'
import Container from '@/components/Container/Container'
import styled from 'styled-components'
import { IoSearch } from 'react-icons/io5'

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
`

const NotFoundIcon = styled.div`
  font-size: 6rem;
  color: ${props => props.theme?.colors?.light?.[300] || '#9ca3af'};
  margin-bottom: 2rem;
  opacity: 0.5;
`

const NotFoundTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme?.colors?.light?.[100] || '#f3f4f6'};
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`

const NotFoundText = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme?.colors?.light?.[300] || '#9ca3af'};
  margin-bottom: 2rem;
  max-width: 600px;
`

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${props => props.theme?.colors?.primary || '#6366f1'} 0%, ${props => props.theme?.colors?.secondary || '#8b5cf6'} 100%);
  color: ${props => props.theme?.colors?.dark?.bg || '#1a1a1a'};
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme?.shadows?.glow?.primary || '0 0 20px rgba(99, 102, 241, 0.5)'};
  }
`

export default function NotFound() {
  return (
    <Container>
      <NotFoundContainer>
        <NotFoundIcon>
          <IoSearch />
        </NotFoundIcon>
        <NotFoundTitle>Страница не найдена</NotFoundTitle>
        <NotFoundText>
          К сожалению, запрашиваемая страница не существует. Возможно, она была удалена или перемещена.
        </NotFoundText>
        <HomeLink href="/">
          Вернуться на главную
        </HomeLink>
      </NotFoundContainer>
    </Container>
  )
}
