'use client'

import { JournalEntryModal } from './JournalEntryModal'

interface QuickNoteModalProps {
  isOpen: boolean
  onClose: (wasCreated?: boolean) => void
}

export const QuickNoteModal = ({ isOpen, onClose }: QuickNoteModalProps) => {
  return <JournalEntryModal isOpen={isOpen} onClose={onClose} entry={null} />
}
