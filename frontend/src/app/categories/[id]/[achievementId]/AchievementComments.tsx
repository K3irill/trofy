'use client'

import { useState } from 'react'
import { AchievementDetail, AchievementComment } from './types'
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import { BlockLoader } from '@/components/Loader/BlockLoader'
import { IoChatbubbleOutline, IoChatbubble } from 'react-icons/io5'
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
  CommentCancelButton,
  CommentReplyButton,
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
  const { showToast, ToastComponent } = useToast()
  const { confirm, ConfirmComponent } = useConfirm()

  // Комментарии доступны, если есть UserAchievement (progress > 0 или completion_date)
  const hasUserAchievement = !!userAchievementId

  const { data: comments = [], isLoading } = useGetCommentsQuery(
    { userAchievementId: userAchievementId || '' },
    { skip: !userAchievementId || !hasUserAchievement }
  )
  const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation()
  const [deleteComment] = useDeleteCommentMutation()

  if (!hasUserAchievement) {
    return null
  }

  if (achievement.canComment === false) {
    return (
      <CommentsContainer>
        <CommentsDisabled>
          <IoChatbubbleOutline style={{ marginRight: '0.5rem' }} />
          Комментарии отключены владельцем
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
      showToast('Комментарий добавлен', 'success')
    } catch (error) {
      showToast('Ошибка при добавлении комментария', 'error')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!userAchievementId) return

    const confirmed = await confirm({
      title: 'Удалить комментарий?',
      message: 'Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      type: 'danger',
    })

    if (!confirmed) return

    try {
      await deleteComment({ userAchievementId, commentId }).unwrap()
      showToast('Комментарий удален', 'success')
    } catch (error) {
      showToast('Ошибка при удалении комментария', 'error')
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
        <IoChatbubble style={{ marginRight: '0.5rem' }} />
        Комментарии ({comments.length})
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
            <CommentCancelButton type="button" onClick={handleCancelReply}>
              Отмена
            </CommentCancelButton>
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
                  <CommentReplyButton onClick={() => handleReply(comment.id)}>
                    Ответить
                  </CommentReplyButton>
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
      <ToastComponent />
      <ConfirmComponent />
    </CommentsContainer>
  )
}
