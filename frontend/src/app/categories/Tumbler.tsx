import { TumblerWrapper, TumblerTrack, TumblerThumb, ViewLabel, Label } from './page.styled'

interface TumblerProps {
  mode: 'grid' | 'list'
  onChange: (mode: 'grid' | 'list') => void
}

export const Tumbler = ({ mode, onChange }: TumblerProps) => {
  return (
    <TumblerWrapper>
      <Label active={mode === 'grid'} onClick={() => onChange('grid')}>
        <ViewLabel>🗃️</ViewLabel>
      </Label>
      <TumblerTrack onClick={() => {
        mode === 'grid' ? onChange('list') : onChange('grid')
      }
      }>
        <TumblerThumb position={mode === 'grid' ? 0 : 1} />
      </TumblerTrack>
      <Label active={mode === 'list'} onClick={() => onChange('list')}>
        <ViewLabel>📝</ViewLabel>
      </Label>
    </TumblerWrapper>
  )
}
