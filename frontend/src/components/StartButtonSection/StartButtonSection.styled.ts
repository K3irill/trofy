import styled from 'styled-components';

export const Container = styled.section`
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  border: 2px solid #374151;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  padding: 0.5rem 2rem;
`;

export const Description = styled.p`
  color: #d1d5db;
  font-size: 1.125rem;
  margin-bottom: 2rem;
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.5rem 1.5rem;
    max-width: 100%;
  }
`;

export const Button = styled(motion.button)`
  background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
  border: none;
  border-radius: 12px;
  padding: 1rem 3rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0a0e17;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.7);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }
`;
