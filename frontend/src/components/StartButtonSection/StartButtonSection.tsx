import { motion } from 'framer-motion';
import {
  Container,
  Title,
  Description,
  Button,
} from './StartButtonSection.styled';

export const StartButtonSection = () => {
  return (
    <Container>
      <Title>
        🚀
        Начни свой путь!
      </Title>
      <Description>
        Создай свой профиль и начни разблокировать достижения. Каждый шаг приближает тебя к новым вершинам геймификации!
      </Description>
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Создать профиль
      </Button>
    </Container>
  );
};
