import styled from 'styled-components'

export const CommentsContainer = styled.div`
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(55, 65, 81, 0.5);
  margin-bottom: 1.5rem;
`

export const CommentsHeader = styled.h3`
  font-size: 1.125rem;
  color: #f3f4f6;
  font-weight: 700;
  margin: 0 0 1rem 0;
`

export const CommentsDisabled = styled.div`
  padding: 1rem;
  background: rgba(55, 65, 81, 0.3);
  border-radius: 8px;
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1rem;
    flex-shrink: 0;
  }
`

export const CommentForm = styled.form`
  margin-bottom: 1.5rem;
`

export const CommentInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(17, 24, 39, 0.8);
  border: 2px solid rgba(55, 65, 81, 0.5);
  border-radius: 8px;
  color: #f3f4f6;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  &::placeholder {
    color: #6b7280;
  }
`

export const CommentSubmitButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  border: none;
  border-radius: 8px;
  color: #0a0e17;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const CommentItem = styled.div`
  padding: 1rem;
  background: rgba(17, 24, 39, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(55, 65, 81, 0.3);
`

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`

export const CommentAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0e17;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const CommentInfo = styled.div`
  flex: 1;
`

export const CommentAuthor = styled.div`
  color: #f3f4f6;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
`

export const CommentDate = styled.div`
  color: #9ca3af;
  font-size: 0.75rem;
`

export const CommentText = styled.div`
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
`

export const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`

export const CommentDeleteButton = styled.button`
  padding: 0.375rem 0.75rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  border-radius: 6px;
  color: #ef4444;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
  }
`
