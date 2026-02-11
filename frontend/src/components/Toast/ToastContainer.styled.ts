import styled from 'styled-components'

export const ToastListContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    top: 0.75rem;
    right: 0.75rem;
    left: 0.75rem;
    gap: 0.5rem;
  }
`
