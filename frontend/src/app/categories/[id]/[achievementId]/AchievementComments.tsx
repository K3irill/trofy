'use client'

import { useState, useEffect } from 'react'
import { AchievementDetail, AchievementComment } from './types'
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import { BlockLoader } from '@/components/Loader/BlockLoader'
import { IoChatbubbleOutline, IoChatbubble, IoChevronDown, IoChevronUp } from 'react-icons/io5'
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
  ReplyForm,
  ReplyFormActions,
  RepliesContainer,
  RepliesToggle,
  RepliesList,
  ReplyItem,
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
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
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

  // Разворачиваем ответы по умолчанию при загрузке комментариев
  useEffect(() => {
    if (comments.length > 0) {
      const defaultExpanded = new Set<string>()
      comments.forEach((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          defaultExpanded.add(comment.id)
        }
      })
      setExpandedReplies(defaultExpanded)
    }
  }, [comments])

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
        },
      }).unwrap()
      setNewComment('')
      showToast('Комментарий добавлен', 'success')
    } catch (error) {
      showToast('Ошибка при добавлении комментария', 'error')
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    const text = replyText[commentId]?.trim()
    if (!text || isSubmitting || !userAchievementId) return

    try {
      await createComment({
        userAchievementId,
        data: {
          text,
          parent_comment_id: commentId,
        },
      }).unwrap()
      setReplyText((prev) => {
        const newReplyText = { ...prev }
        delete newReplyText[commentId]
        return newReplyText
      })
      setReplyingTo(null)
      // Разворачиваем ответы, если они были свернуты
      setExpandedReplies((prev) => new Set(prev).add(commentId))
      showToast('Ответ добавлен', 'success')
    } catch (error) {
      showToast('Ошибка при добавлении ответа', 'error')
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
    // Разворачиваем ответы при начале ответа
    setExpandedReplies((prev) => new Set(prev).add(commentId))
  }

  const handleCancelReply = (commentId: string) => {
    if (replyingTo === commentId) {
      setReplyingTo(null)
    }
    setReplyText((prev) => {
      const newReplyText = { ...prev }
      delete newReplyText[commentId]
      return newReplyText
    })
  }

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
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
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Написать комментарий..."
          rows={3}
        />
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <CommentSubmitButton type="submit" disabled={!newComment.trim() || isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </CommentSubmitButton>
        </div>
      </CommentForm>

      <CommentsList>
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem>
              <CommentHeader>
                <CommentAvatar>
                  {comment.avatarUrl ? (
                    <img
                      src={comment.avatarUrl.startsWith('http') ? comment.avatarUrl : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${comment.avatarUrl}`}
                      alt={comment.username}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.textContent = comment.username[0].toUpperCase()
                      }}
                    />
                  ) : (
                    comment.username[0].toUpperCase()
                  )}
                </CommentAvatar>
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
              
              {/* Форма ответа под комментарием */}
              {replyingTo === comment.id && (
                <ReplyForm>
                  <CommentInput
                    value={replyText[comment.id] || ''}
                    onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                    placeholder="Написать ответ..."
                    rows={2}
                  />
                  <ReplyFormActions>
                    <CommentCancelButton type="button" onClick={() => handleCancelReply(comment.id)}>
                      Отмена
                    </CommentCancelButton>
                    <CommentSubmitButton
                      type="button"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText[comment.id]?.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Отправка...' : 'Ответить'}
                    </CommentSubmitButton>
                  </ReplyFormActions>
                </ReplyForm>
              )}
            </CommentItem>
            
            {/* Ответы на комментарий */}
            {comment.replies && comment.replies.length > 0 && (
              <RepliesContainer>
                <RepliesToggle onClick={() => toggleReplies(comment.id)}>
                  {expandedReplies.has(comment.id) ? <IoChevronUp /> : <IoChevronDown />}
                  <span>{expandedReplies.has(comment.id) ? 'Скрыть' : 'Показать'} {comment.replies.length} {comment.replies.length === 1 ? 'ответ' : comment.replies.length < 5 ? 'ответа' : 'ответов'}</span>
                </RepliesToggle>
                {expandedReplies.has(comment.id) && (
                  <RepliesList>
                    {comment.replies.map((reply) => (
                      <ReplyItem key={reply.id}>
                        <CommentHeader>
                          <CommentAvatar>
                            {reply.avatarUrl ? (
                              <img
                                src={reply.avatarUrl.startsWith('http') ? reply.avatarUrl : `${process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:3333'}${reply.avatarUrl}`}
                                alt={reply.username}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.parentElement!.textContent = reply.username[0].toUpperCase()
                                }}
                              />
                            ) : (
                              reply.username[0].toUpperCase()
                            )}
                          </CommentAvatar>
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
                      </ReplyItem>
                    ))}
                  </RepliesList>
                )}
              </RepliesContainer>
            )}
          </div>
        ))}
      </CommentsList>
      <ToastComponent />
      <ConfirmComponent />
    </CommentsContainer>
  )
}
