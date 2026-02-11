import styled from 'styled-components'
import { AchievementViewMode } from './ViewModeSelector'

export const AchievementGrid = styled.div<{ mode: AchievementViewMode }>`
  display: grid;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  ${(props) => {
    if (props.mode === 'grid3') {
      return `
        grid-template-columns: repeat(3, 1fr);
        @media (max-width: 1200px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 600px) {
          gap: 1rem;
        }
      `
    } else if (props.mode === 'grid2') {
      return `
        grid-template-columns: repeat(2, 1fr);
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      `
    } else {
      return `
        grid-template-columns: 1fr;
        gap: 1rem;
      `
    }
  }}
`
