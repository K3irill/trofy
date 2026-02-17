import styled from 'styled-components'

export const EditorContainer = styled.div<{ $isFullscreen?: boolean }>`
  ${(props) =>
    props.$isFullscreen
      ? `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 1;
  `
      : ''}
  .ProseMirror {
    /* Task List (чекбоксы) - глобальные стили */
    ul[data-type="taskList"] {
      list-style: none !important;
      padding-left: 0 !important;
      margin: 0.5rem 0 !important;
    }

    /* Task Item - используем селектор для li внутри taskList */
    ul[data-type="taskList"] > li {
      display: flex !important;
      align-items: flex-start !important;
      margin: 0.25rem 0 !important;
      gap: 0.5rem !important;
      line-height: 1.6 !important;
      list-style: none !important;
      
      label {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 auto !important;
        margin-top: 0.125rem !important;
        user-select: none !important;
        cursor: pointer !important;
        width: 1.25rem !important;
        height: 1.25rem !important;
        
        span {
          display: none !important;
        }
        
        input[type="checkbox"] {
          cursor: pointer !important;
          width: 1.25rem !important;
          height: 1.25rem !important;
          margin: 0 !important;
          padding: 0 !important;
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          background: ${(props) => props.theme.colors.dark[700]} !important;
          border: 2px solid ${(props) => props.theme.colors.dark[600]} !important;
          border-radius: 4px !important;
          position: relative !important;
          transition: all 0.2s ease !important;
          flex-shrink: 0 !important;
          
          &:hover {
            border-color: ${(props) => props.theme.colors.primary}80 !important;
            background: ${(props) => props.theme.colors.dark[600]} !important;
          }
          
          &:checked {
            background: ${(props) => props.theme.colors.primary} !important;
            border-color: ${(props) => props.theme.colors.primary} !important;
            
            &::after {
              content: '✓' !important;
              position: absolute !important;
              top: 50% !important;
              left: 50% !important;
              transform: translate(-50%, -50%) !important;
              color: ${(props) => props.theme.colors.dark.bg || props.theme.colors.light[100]} !important;
              font-size: 0.875rem !important;
              font-weight: bold !important;
              line-height: 1 !important;
            }
          }
          
          &:focus {
            outline: none !important;
            box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}40 !important;
          }
        }
      }
      
      > div {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.6 !important;
        
        p {
          margin: 0 !important;
          display: inline !important;
        }
      }
      
      &[data-checked="true"] {
        > div {
          text-decoration: line-through !important;
          opacity: 0.6 !important;
        }
      }
    }
    outline: none;
    min-height: ${(props) => (props.$isFullscreen ? 'calc(100vh - 200px)' : '200px')};
    height: ${(props) => (props.$isFullscreen ? '100%' : 'auto')};
    padding: 1rem;
    background: ${(props) => props.theme.colors.dark[700]};
    border: 2px solid ${(props) => props.theme.colors.dark[600]};
    border-radius: ${(props) => (props.$isFullscreen ? '0' : '0 0 12px 12px')};
    color: ${(props) => props.theme.colors.light[100]};
    font-size: 0.875rem;
    line-height: 1.6;
    flex: 1;
    overflow-y: auto;

    &:focus {
      border-color: ${(props) => props.theme.colors.primary};
      box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary}40;
    }

    p {
      margin: 0.5rem 0;
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 1rem 0 0.5rem 0;
      font-weight: 700;
      color: ${(props) => props.theme.colors.light[100]};
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
    }

    ul, ol {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }

    li {
      margin: 0.25rem 0;
    }
    
    /* Исключаем task items из обычных стилей li */
    li:not([data-type="taskItem"]) {
      margin: 0.25rem 0;
    }

    blockquote {
      border-left: 4px solid ${(props) => props.theme.colors.primary};
      padding-left: 1rem;
      margin: 1rem 0;
      color: ${(props) => props.theme.colors.light[300]};
      font-style: italic;
    }

    code {
      background: ${(props) => props.theme.colors.dark[700]};
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.875em;
    }

    pre {
      background: ${(props) => props.theme.colors.dark[700]};
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;

      code {
        background: none;
        padding: 0;
      }
    }

    strong {
      font-weight: 700;
    }

    em {
      font-style: italic;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: ${(props) => props.theme.colors.light[300]};
      pointer-events: none;
      height: 0;
    }
  }
`

export const Toolbar = styled.div<{ $isFullscreen?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: ${(props) => props.theme.colors.dark[800]};
  border: 2px solid ${(props) => props.theme.colors.dark[600]};
  border-bottom: none;
  border-radius: ${(props) => (props.$isFullscreen ? '0' : '12px 12px 0 0')};
  flex-wrap: wrap;
  flex-shrink: 0;
`

export const ToolbarButton = styled.button<{ $active?: boolean }>`
  background: ${(props) => (props.$active ? props.theme.colors.primary + '40' : props.theme.colors.dark[700])};
  border: 2px solid ${(props) => (props.$active ? props.theme.colors.primary : props.theme.colors.dark[600])};
  color: ${(props) => (props.$active ? props.theme.colors.primary : props.theme.colors.light[200])};
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$active ? 600 : 500)};
  min-width: 2rem;

  &:hover {
    background: ${(props) => props.theme.colors.primary + '40'};
    color: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
  }
`

export const ToolbarDivider = styled.div`
  width: 2px;
  height: 1.5rem;
  background: ${(props) => props.theme.colors.dark[600]};
  margin: 0 0.25rem;
`
