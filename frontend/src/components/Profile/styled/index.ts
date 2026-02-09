import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ProfileContainer = styled(motion.div)`
  background: linear-gradient(145deg, ${(props) => props.theme.colors.dark[800]} 0%, ${(props) => props.theme.colors.dark[900]} 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid ${(props) => props.theme.colors.primary};
  box-shadow: 0 0 40px rgba(0, 255, 136, 0.2);
  text-align: center;
`;

export const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 4px solid ${(props) => props.theme.colors.dark[700]};
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
`;

export const Username = styled.h2`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const Level = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.accent} 0%, ${(props) => props.theme.colors.secondary} 100%);
  color: ${(props) => props.theme.colors.dark[900]};
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const XPBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${(props) => props.theme.colors.dark[700]};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

export const XPProgress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  border-radius: 4px;
`;

export const XPText = styled.p`
  color: ${(props) => props.theme.colors.light[300]};
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
`;

export const StatItem = styled.div`
  background: ${(props) => props.theme.colors.dark[700]};
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.dark[600]};
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.light[300]};
  text-transform: uppercase;
  margin-top: 0.25rem;
`;
