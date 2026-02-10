'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionMarker } from '@/components/SectionMarker'
import {
  Container,
  Content,
  Header,
  Title,
  Subtitle,
  BonusBanner,
  BonusIcon,
  BonusText,
  BonusHighlight,
  FriendsList,
  FriendItem,
  FriendAvatar,
  FriendName,
  InviteButton,
  VKShareButton,
  FriendsContainer,
} from './styled'

interface Friend {
  id: string
  name: string
  avatar: string
  isInvited: boolean
}

const friendsNotInGame: Friend[] = [
  { id: '1', name: 'Алексей Петров', avatar: '👨', isInvited: false },
  { id: '2', name: 'Мария Иванова', avatar: '👩', isInvited: false },
  { id: '3', name: 'Дмитрий Сидоров', avatar: '👨‍💼', isInvited: false },
]

export const InviteFriendSection = () => {
  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set())

  const handleInvite = (friendId: string) => {
    setInvitedFriends((prev) => new Set([...prev, friendId]))
  }

  const handleVKShare = () => {
    if (typeof window !== 'undefined') {
      const url = 'https://trofy.art'
      const text = 'Присоединяйся к Trofy — геймификация достижений!'
      const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
      window.open(vkUrl, '_blank')
    }
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <SectionMarker />
        <Title>Приведи друзей</Title>
      </Header>
      <Content>
        <Subtitle>Друзья, которых ещё нет в игре</Subtitle>

        <FriendsList>
          {friendsNotInGame.map((friend, index) => (
            <FriendItem
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <FriendAvatar>{friend.avatar}</FriendAvatar>
              <FriendName>{friend.name}</FriendName>
              {invitedFriends.has(friend.id) ? (
                <InviteButton invited whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  ✓ Приглашено
                </InviteButton>
              ) : (
                <InviteButton
                  onClick={() => handleInvite(friend.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Пригласить
                </InviteButton>
              )}
            </FriendItem>
          ))}
        </FriendsList>

        <BonusBanner
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <BonusIcon>🎁</BonusIcon>
          <BonusText>
            Приведи <BonusHighlight>3 друзей</BonusHighlight> — получи секретные трофеи
          </BonusText>
        </BonusBanner>

        <FriendsContainer>
          <VKShareButton
            onClick={handleVKShare}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            Поделиться во ВКонтакте
          </VKShareButton>
        </FriendsContainer>
      </Content>
    </Container>
  )
}
// став версия
/*'use client' 

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Container,
  Content,
  Header,
  Title,
  Subtitle,
  BonusBanner,
  BonusIcon,
  BonusText,
  BonusHighlight,
  FormContainer,
  InputField,
  SendButton,
  RocketIcon,
} from './styled'

export const InviteFriendSection = () => {
  const [inviteLink, setInviteLink] = useState('https://trofy.art/invite/user123')
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '4px',
            height: '32px',
            background: 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
            borderRadius: '2px',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
          }}
        />
        <Title>Расширь экипаж</Title>
      </Header>
      <Content>
        <Subtitle>Приведи друзей и получи секретные трофеи</Subtitle>

        <BonusBanner
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <BonusIcon>🎁</BonusIcon>
          <BonusText>
            Приведи <BonusHighlight>3 друзей</BonusHighlight> — открой секретный трофей{' '}
            <BonusHighlight>«Лидер отряда»</BonusHighlight>
          </BonusText>
        </BonusBanner>

        <FormContainer>
          <InputField
            type="text"
            value={inviteLink}
            onChange={(e) => setInviteLink(e.target.value)}
            readOnly
          />
          <SendButton
            onClick={handleCopyLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <span>✓ Скопировано</span>
            ) : (
              <>
                <RocketIcon>📡</RocketIcon>
                <span>Передать сигнал</span>
              </>
            )}
          </SendButton>
        </FormContainer>
      </Content>
    </Container>
  )
}
*/