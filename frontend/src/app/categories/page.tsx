'use client'

import { useRouter } from 'next/navigation'

import {
  Header as PageHeader,
  Title,
  Grid,
} from './page.styled'
import { categories } from './page.constants'
import { CategoryCardComponent } from './CategoryCard'
import Container from '@/components/Container/Container'

export default function CategoriesPage() {
  const router = useRouter()

  return (
    <>
      <Container>
        <PageHeader>
          <Title>📂 Категории достижений</Title>
        </PageHeader>
        <Grid>
          {categories.map((category) => (
            <CategoryCardComponent
              key={category.id}
              category={category}
              onClick={() => router.push(`/categories/${category.id}`)}
            />
          ))}
        </Grid>
      </Container>
    </>
  )
}
