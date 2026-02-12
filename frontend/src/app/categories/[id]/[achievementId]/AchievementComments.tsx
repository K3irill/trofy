'use client'

import { useState } from 'react'
import { AchievementDetail, AchievementComment } from './types'
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '@/store/api/achievementDetailApi'
import { BlockLoader } from '@/components/Loader/BlockLoader'
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
  userAchievementId?: string
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

export const AchievementComments = ({ achievement, isOwner, currentUserId, userAchievementId }: AchievementCommentsProps) => {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const { data: comments = [], isLoading } = useGetCommentsQuery(
    { userAchievementId: userAchievementId || '' },
    { skip: !userAchievementId || !achievement.unlocked }
  )
  const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation()
  const [deleteComment] = useDeleteCommentMutation()

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
    if (!newComment.trim() || isSubmitting || !userAchievementId) return

    try {
      await createComment({
        userAchievementId,
        data: {
          text: newComment,
          parent_comment_id: replyingTo || undefined,
        },
      }).unwrap()
      setNewComment('')
      setReplyingTo(null)
      setReplyText('')
    } catch (error) {
      alert('Ошибка при добавлении комментария')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Удалить комментарий?') || !userAchievementId) return

    try {
      await deleteComment({ userAchievementId, commentId }).unwrap()
    } catch (error) {
      alert('Ошибка при удалении комментария')
    }
  }

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId)
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyText('')
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

  if (isLoading) {
    return (
      <CommentsContainer>
        <BlockLoader text="Загрузка комментариев..." size="small" />
      </CommentsContainer>
    )
  }

  return (
    <CommentsContainer>
      <CommentsHeader>
        💬 Комментарии ({comments.length})
      </CommentsHeader>

      <CommentForm onSubmit={handleSubmitComment}>
        <CommentInput
          value={replyingTo ? replyText : newComment}
          onChange={(e) => {
            if (replyingTo) {
              setReplyText(e.target.value)
            } else {
              setNewComment(e.target.value)
            }
          }}
          placeholder={replyingTo ? 'Написать ответ...' : 'Написать комментарий...'}
          rows={3}
        />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {replyingTo && (
            <button
              type="button"
              onClick={handleCancelReply}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(156, 163, 175, 0.2)',
                border: '1px solid rgba(156, 163, 175, 0.3)',
                borderRadius: '8px',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Отмена
            </button>
          )}
          <CommentSubmitButton type="submit" disabled={(!newComment.trim() && !replyText.trim()) || isSubmitting}>
            {isSubmitting ? 'Отправка...' : replyingTo ? 'Ответить' : 'Отправить'}
          </CommentSubmitButton>
        </div>
      </CommentForm>

      <CommentsList>
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem>
              <CommentHeader>
                <CommentAvatar>{comment.username[0].toUpperCase()}</CommentAvatar>
                <CommentInfo>
                  <CommentAuthor>{comment.username}</CommentAuthor>
                  <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                </CommentInfo>
              </CommentHeader>
              <CommentText>{comment.text}</CommentText>
              <CommentActions>
                {currentUserId && comment.userId !== currentUserId && (
                  <button
                    onClick={() => handleReply(comment.id)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: 'transparent',
                      border: '1px solid rgba(156, 163, 175, 0.3)',
                      borderRadius: '6px',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    Ответить
                  </button>
                )}
                {(isOwner || comment.userId === currentUserId) && (
                  <CommentDeleteButton onClick={() => handleDeleteComment(comment.id)}>
                    Удалить
                  </CommentDeleteButton>
                )}
              </CommentActions>
            </CommentItem>
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginLeft: '3rem', marginTop: '0.5rem' }}>
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} style={{ marginBottom: '0.75rem' }}>
                    <CommentHeader>
                      <CommentAvatar>{reply.username[0].toUpperCase()}</CommentAvatar>
                      <CommentInfo>
                        <CommentAuthor>{reply.username}</CommentAuthor>
                        <CommentDate>{formatDate(reply.createdAt)}</CommentDate>
                      </CommentInfo>
                    </CommentHeader>
                    <CommentText>{reply.text}</CommentText>
                    {(isOwner || reply.userId === currentUserId) && (
                      <CommentActions>
                        <CommentDeleteButton onClick={() => handleDeleteComment(reply.id)}>
                          Удалить
                        </CommentDeleteButton>
                      </CommentActions>
                    )}
                  </CommentItem>
                ))}
              </div>
            )}
          </div>
        ))}
      </CommentsList>
    </CommentsContainer>
  )
}
