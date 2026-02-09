import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled(motion.section)`
  padding: 2rem;
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  border-radius: 20px;
  border: 2px solid #374151;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  color: #f3f4f6;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

export const Card = styled(motion.div)<{ rank: number }>`
  background: linear-gradient(145deg, ${(props) => {
    if (props.rank === 1) return '#2a165a 0%, #1e3a8a 100%';
    if (props.rank === 2) return '#1e3a8a 0%, #9333ea 100%';
    if (props.rank === 3) return '#9333ea 0%, #6b21a8 100%';
    return '#374151 0%, #1f2937 100%';
  }};
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00ff88 0%, #00d4ff 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
    border-color: #00ff88;

    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Rank = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff 0%, #ff00ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0a0e17;
  font-size: 1rem;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.875rem;
  }
`;

export const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const AchievementTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #f3f4f6;
  margin: 0;
`;

export const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const UserName = styled.span`
  color: #9ca3af;
  font-size: 0.875rem;
`;

export const XP = styled.span`
  color: #00ff88;
  font-weight: 700;
  font-size: 1rem;
`;
