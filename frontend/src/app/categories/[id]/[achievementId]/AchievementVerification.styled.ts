import styled from 'styled-components'

export const VerificationContainer = styled.div`
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(55, 65, 81, 0.5);
  margin-bottom: 1.5rem;
`

export const VerificationStatus = styled.div`
  margin-bottom: 1rem;
`

export const VerificationBadge = styled.div<{ verified: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => props.verified
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)'};
  border: 2px solid ${props => props.verified ? '#22c55e' : '#f59e0b'};
  color: ${props => props.verified ? '#22c55e' : '#f59e0b'};
`

export const VerificationButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  border-radius: 12px;
  color: #0a0e17;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const VerificationList = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(55, 65, 81, 0.3);
`

export const VerificationItem = styled.div`
  padding: 0.75rem;
  background: rgba(17, 24, 39, 0.5);
  border-radius: 8px;
  margin-bottom: 0.5rem;
`

export const VerificationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f3f4f6;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`

export const VerificationReason = styled.div`
  color: #9ca3af;
  font-size: 0.75rem;
  font-style: italic;
`
