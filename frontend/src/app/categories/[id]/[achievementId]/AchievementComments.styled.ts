import styled from 'styled-components'

export const CommentsContainer = styled.div`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[700]}e6 0%, ${(props) => props.theme.colors.dark[800]}f2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  margin-bottom: 1.5rem;
`

export const CommentsHeader = styled.h3`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.light[100]};
  font-weight: 700;
  margin: 0 0 1rem 0;
`

export const CommentsDisabled = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.colors.dark[600]}4d;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[300]};
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
  background: ${(props) => props.theme.colors.dark[800]}cc;
  border: 2px solid ${(props) => props.theme.colors.dark[600]}80;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}1a;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.light[300]};
  }
`

export const CommentSubmitButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border: none;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.dark.bg};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${(props) => props.theme.colors.primary}4d;
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
  background: ${(props) => props.theme.colors.dark[800]}80;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.dark[600]}4d;
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
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.dark.bg};
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const CommentInfo = styled.div`
  flex: 1;
`

export const CommentAuthor = styled.div`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
`

export const CommentDate = styled.div`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.75rem;
`

export const CommentText = styled.div`
  color: ${(props) => props.theme.colors.light[200]};
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
  background: ${(props) => props.theme.colors.danger}33;
  border: 1px solid ${(props) => props.theme.colors.danger};
  border-radius: 6px;
  color: ${(props) => props.theme.colors.danger};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.danger}4d;
  }
`

export const CommentCancelButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${(props) => props.theme.colors.light[300]}33;
  border: 1px solid ${(props) => props.theme.colors.light[300]}4d;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.light[300]};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.light[300]}4d;
  }
`

export const CommentReplyButton = styled.button`
  padding: 0.25rem 0.75rem;
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.light[300]}4d;
  border-radius: 6px;
  color: ${(props) => props.theme.colors.light[300]};
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }
`
