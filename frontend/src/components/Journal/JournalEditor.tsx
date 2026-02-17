'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { styled } from 'styled-components'
import { useEffect } from 'react'
import { IoList, IoCode, IoCheckmarkCircle } from 'react-icons/io5'
import {
  EditorContainer,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
} from './JournalEditor.styled'

interface JournalEditorProps {
  content?: any
  placeholder?: string
  onChange?: (content: any) => void
  showToolbar?: boolean
  editable?: boolean
  isFullscreen?: boolean
}

export const JournalEditor = ({ content, placeholder = 'Начните писать...', onChange, showToolbar = true, editable = true, isFullscreen = false }: JournalEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content ?? '',
    editable,
    onUpdate: ({ editor }) => {
      if (onChange && editable) {
        onChange(editor.getJSON())
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none',
      },
    },
    immediatelyRender: false,
  })

  // Обновляем контент редактора при изменении prop content
  useEffect(() => {
    if (!editor) return

    const currentContent = editor.getJSON()
    const newContent = content ?? ''

    // Сравниваем только если контент действительно изменился
    const currentStr = JSON.stringify(currentContent)
    const newStr = JSON.stringify(newContent)

    if (currentStr !== newStr) {
      editor.commands.setContent(newContent)
    }
  }, [editor, content])

  if (!editor) {
    return null
  }

  return (
    <EditorContainer $isFullscreen={isFullscreen}>
      {showToolbar && (
        <Toolbar $isFullscreen={isFullscreen}>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            $active={editor.isActive('bold')}
            title="Жирный (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            $active={editor.isActive('italic')}
            title="Курсив (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            $active={editor.isActive('heading', { level: 1 })}
            title="Заголовок 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            $active={editor.isActive('heading', { level: 2 })}
            title="Заголовок 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            $active={editor.isActive('heading', { level: 3 })}
            title="Заголовок 3"
          >
            H3
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            $active={editor.isActive('bulletList')}
            title="Маркированный список"
          >
            <IoList />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            $active={editor.isActive('orderedList')}
            title="Нумерованный список"
          >
            1.
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            $active={editor.isActive('taskList')}
            title="Список задач (чекбоксы)"
          >
            <IoCheckmarkCircle />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            $active={editor.isActive('blockquote')}
            title="Цитата"
          >
            "
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            $active={editor.isActive('codeBlock')}
            title="Блок кода"
          >
            <IoCode />
          </ToolbarButton>
        </Toolbar>
      )}
      <EditorContent editor={editor} />
    </EditorContainer>
  )
}
