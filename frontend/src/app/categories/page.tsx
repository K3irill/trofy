'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Header as PageHeader,
  Title,
  Grid,
  ListContainer,
  ListItem,
  ListItemIcon,
  ListItemContent,
  ListItemName,
  ListItemStats,
  ProgressRing,
  StatItem,
  StatLabel,
  StatValue,
  PageHeaderWrap,
} from './page.styled'
import { categories } from './page.constants'
import { CategoryCardComponent } from './CategoryCard'
import { Tumbler } from './Tumbler'

import Container from '@/components/Container/Container'

export default function CategoriesPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <>
      <Container>
        <PageHeader>
          <PageHeaderWrap>
            <Title>📂 Категории достижений</Title>
            <Tumbler mode={viewMode} onChange={setViewMode} />
          </PageHeaderWrap>

        </PageHeader>
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid>
                {categories.map((category) => (
                  <CategoryCardComponent
                    key={category.id}
                    category={category}
                    onClick={() => router.push(`/categories/${category.id}`)}
                  />
                ))}
              </Grid>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ListContainer>
                {categories.map((category) => (
                  <ListItem key={category.id} onClick={() => router.push(`/categories/${category.id}`)}>
                    <ListItemIcon>{category.icon}</ListItemIcon>
                    <ListItemContent>
                      <ListItemName>{category.name}</ListItemName>
                      <ListItemStats>
                        <StatItem>
                          <StatLabel>Доступно:</StatLabel>
                          <StatValue>{category.unlocked}/{category.total}</StatValue>
                        </StatItem>
                        <StatItem>
                          <StatLabel>Прогресс:</StatLabel>
                          <StatValue>{Math.round((category.unlocked / category.total) * 100)}%</StatValue>
                        </StatItem>
                      </ListItemStats>
                    </ListItemContent>
                    <ProgressRing progress={Math.round((category.unlocked / category.total) * 100)} />
                  </ListItem>
                ))}
              </ListContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  )
}
