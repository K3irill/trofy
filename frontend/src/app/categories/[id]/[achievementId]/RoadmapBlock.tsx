'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { IoMap } from 'react-icons/io5'
import { RoadmapModal } from './RoadmapModal'

const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: var(--bg-secondary, #1a1a1a);
  border: 1px solid var(--border-color, #2a2a2a);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-tertiary, #222);
    border-color: var(--primary-color, #6366f1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }
`

const BlockContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-color, #6366f1) 0%, var(--primary-color-dark, #4f46e5) 100%);
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
`

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary, #fff);
`

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary, #999);
`

interface RoadmapBlockProps {
  userAchievementId: string
  achievementId: string
  isOwner: boolean
}

export const RoadmapBlock = ({ userAchievementId, achievementId, isOwner }: RoadmapBlockProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Block onClick={() => setIsModalOpen(true)}>
        <BlockContent>
          <Icon>
            <IoMap />
          </Icon>
          <Text>
            <Title>Роадмап</Title>
            <Description>
              {isOwner ? 'Создайте план достижения цели' : 'Просмотр плана достижения'}
            </Description>
          </Text>
        </BlockContent>
      </Block>
      {isModalOpen && (
        <RoadmapModal
          userAchievementId={userAchievementId}
          achievementId={achievementId}
          isOwner={isOwner}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
