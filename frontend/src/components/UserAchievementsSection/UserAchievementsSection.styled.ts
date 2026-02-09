import styled from 'styled-components';

export const Container = styled.section`
  padding: 2rem;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  color: #f3f4f6;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  font-size: 1.125rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    font-size: 1rem;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;
