'use client'

import { useState } from 'react'
import { AchievementDetail, AchievementComment } from './types'
import {
  CommentsContainer,
  CommentsHeader,
  CommentsDisabled,
  CommentForm,
  CommentInput,
  CommentSubmitButton,
  CommentsList,
  CommentItem,
  CommentHeader,
  CommentAvatar,
  CommentInfo,
  CommentAuthor,
  CommentDate,
  CommentText,
  CommentActions,
  CommentDeleteButton,
} from './AchievementComments.styled'

interface AchievementCommentsProps {
  achievement: AchievementDetail
  isOwner: boolean
  currentUserId?: string
}

const mockComments: AchievementComment[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'Пользователь 1',
    text: 'Отличное достижение! Поздравляю! 🎉',
    createdAt: '2024-01-20T10:30:00Z',
    isOwner: false,
  },
  {
    id: '2',
    userId: 'user2',
    username: 'Пользователь 2',
    text: 'Вдохновляюще! Хочу тоже попробовать.',
    createdAt: '2024-01-20T11:15:00Z',
    isOwner: false,
  },
]

export const AchievementComments = ({ achievement, isOwner, currentUserId }: AchievementCommentsProps) => {
  const [comments, setComments] = useState<AchievementComment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!achievement.unlocked) {
    return null
  }

  if (achievement.canComment === false) {
    return (
      <CommentsContainer>
        <CommentsDisabled>
          💬 Комментарии отключены владельцем
        </CommentsDisabled>
      </CommentsContainer>
    )
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)

    const comment: AchievementComment = {
      id: Date.now().toString(),
      userId: currentUserId || 'current',
      username: 'Вы',
      text: newComment,
      createdAt: new Date().toISOString(),
      isOwner: isOwner,
    }

    try {
      // Здесь будет API вызов
      // await addComment(achievement.id, newComment)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setComments([...comments, comment])
      setNewComment('')
    } catch (error) {
      alert('Ошибка при добавлении комментария')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Удалить комментарий?')) return

    try {
      // Здесь будет API вызов
      // await deleteComment(achievement.id, commentId)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setComments(comments.filter(c => c.id !== commentId))
    } catch (error) {
      alert('Ошибка при удалении комментария')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'только что'
    if (minutes < 60) return `${minutes} мин. назад`
    if (hours < 24) return `${hours} ч. назад`
    if (days < 7) return `${days} дн. назад`
    return date.toLocaleDateString('ru-RU')
  }

  return (
    <CommentsContainer>
      <CommentsHeader>
        💬 Комментарии ({comments.length})
      </CommentsHeader>

      <CommentForm onSubmit={handleSubmitComment}>
        <CommentInput
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Написать комментарий..."
          rows={3}
        />
        <CommentSubmitButton type="submit" disabled={!newComment.trim() || isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </CommentSubmitButton>
      </CommentForm>

      <CommentsList>
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            <CommentHeader>
              <CommentAvatar>{comment.username[0].toUpperCase()}</CommentAvatar>
              <CommentInfo>
                <CommentAuthor>{comment.username}</CommentAuthor>
                <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
              </CommentInfo>
            </CommentHeader>
            <CommentText>{comment.text}</CommentText>
            {(isOwner || comment.userId === currentUserId) && (
              <CommentActions>
                <CommentDeleteButton onClick={() => handleDeleteComment(comment.id)}>
                  Удалить
                </CommentDeleteButton>
              </CommentActions>
            )}
          </CommentItem>
        ))}
      </CommentsList>
    </CommentsContainer>
  )
}
