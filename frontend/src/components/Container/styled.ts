import styled from 'styled-components'

export const ContainerStyled = styled.div`
	max-width: 1400px;
	margin: 0 auto;
	min-height: 100%;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    max-width: 100%;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }

  @media (max-width: 640px) {
    padding: 0.5rem;
  }
`
