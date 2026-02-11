import { TumblerWrapper, TumblerTrack, TumblerThumb, ViewLabel, Label } from './page.styled'

interface TumblerProps {
  mode: 'categories' | 'achievements'
  onChange: (mode: 'categories' | 'achievements') => void
}

export const Tumbler = ({ mode, onChange }: TumblerProps) => {
  return (
    <TumblerWrapper>
      <Label active={mode === 'categories'} onClick={() => onChange('categories')}>
        <ViewLabel>📂</ViewLabel>
      </Label>
      <TumblerTrack onClick={() => {
        mode === 'categories' ? onChange('achievements') : onChange('categories')
      }
      }>
        <TumblerThumb position={mode === 'categories' ? 0 : 1} />
      </TumblerTrack>
      <Label active={mode === 'achievements'} onClick={() => onChange('achievements')}>
        <ViewLabel>🏆</ViewLabel>
      </Label>
    </TumblerWrapper>
  )
}
