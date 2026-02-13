import styled from 'styled-components';

export const Container = styled.section`
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid #374151;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.light[100]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const StatCard = styled.div`
  background: rgba(0, 255, 136, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #4b5563;
`;

export const StatLabel = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const StatValue = styled.span`
  color: #f3f4f6;
  font-size: 2rem;
  font-weight: 700;
`;
