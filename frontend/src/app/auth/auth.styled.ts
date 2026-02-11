import styled from 'styled-components'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    min-height: calc(100vh - 150px);
    padding: 1rem;
  }
`

export const AuthCard = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  background: ${(props) => props.theme.colors.dark[900]};
  border: 1px solid ${(props) => props.theme.colors.dark[700]};
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: ${(props) => props.theme.shadows.glow.primary};

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
`

export const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

export const AuthTitle = styled.h1`
  color: ${(props) => props.theme.colors.light[100]};
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

export const AuthSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;
`

export const AuthLink = styled(Link)`
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`

export const TestUserButton = styled.div`
  margin-top: 1rem;
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid ${(props) => props.theme.colors.dark[700]};
`
