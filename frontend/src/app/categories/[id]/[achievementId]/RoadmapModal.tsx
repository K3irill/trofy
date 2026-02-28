'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Handle,
  Position,
  useReactFlow,
  ConnectionLineType,
  NodeTypes,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Стили для нод и connection handles
const reactFlowStyles = `
  .react-flow__node-default,
  .react-flow__node-input,
  .react-flow__node-output,
  .react-flow__node-group {
    color: var(--text-primary, #fff) !important;
    text-align: center !important;
    background-color: var(--bg-primary, #1a1a1a);
    border: 2px solid var(--border-color, #2a2a2a);
    border-radius: 12px !important;
    width: auto !important;
    min-width: 150px !important;
    max-width: 300px !important;
    padding: 12px 16px !important;
    font-size: 14px !important;
    cursor: pointer !important;
    box-shadow: var(--shadow-md, rgba(0, 0, 0, 0.3) 0px 2px 8px) !important;
    transition: box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
  .react-flow__node-default.selected,
  .react-flow__node-input.selected,
  .react-flow__node-output.selected,
  .react-flow__node-group.selected {
    background-color: #6366f1 !important;
    border-color: var(--primary-color, #6366f1) ;
    color: var(--text-primary, #fff) !important;
    box-shadow: 0 4px 12px var(--primary-color-alpha, rgba(99, 102, 241, 0.4)) !important;
  }
  @media (max-width: 768px) {
    .react-flow__node-default,
    .react-flow__node-input,
    .react-flow__node-output,
    .react-flow__node-group {
      min-width: 120px !important;
      max-width: 200px !important;
      padding: 10px 12px !important;
      font-size: 12px !important;
      border-radius: 10px !important;
    }
  }
  .react-flow__handle {
    background: var(--primary-color, #6366f1) !important;
    border: 2px solid var(--bg-primary, #1a1a1a) !important;
    width: 16px !important;
    height: 16px !important;
    cursor: crosshair !important;
  }
  @media (max-width: 768px) {
    .react-flow__handle {
      width: 14px !important;
      height: 14px !important;
    }
  }
  .react-flow__handle-top {
    top: -8px !important;
  }
  .react-flow__handle-bottom {
    bottom: -8px !important;
  }
  .react-flow__handle-left {
    left: -8px !important;
  }
  .react-flow__handle-right {
    right: -8px !important;
  }
  @media (max-width: 768px) {
    .react-flow__handle-top {
      top: -7px !important;
    }
    .react-flow__handle-bottom {
      bottom: -7px !important;
    }
    .react-flow__handle-left {
      left: -7px !important;
    }
    .react-flow__handle-right {
      right: -7px !important;
    }
  }
  .react-flow__connection-line {
    stroke: var(--primary-color, #6366f1) !important;
    stroke-width: 2px !important;
  }
  .react-flow__edge-path {
    stroke: var(--primary-color, #6366f1) !important;
    stroke-width: 2px !important;
  }
  @media (max-width: 768px) {
    .react-flow__edge-path {
      stroke-width: 1.5px !important;
    }
  }
  .react-flow__edge.selected .react-flow__edge-path {
    stroke: var(--primary-color, #6366f1) !important;
    stroke-width: 3px !important;
    filter: drop-shadow(0 0 4px var(--primary-color-alpha, rgba(99, 102, 241, 0.6))) !important;
  }
  .react-flow__edge[data-color] .react-flow__edge-path {
    stroke: var(--edge-color) !important;
  }
  @media (max-width: 768px) {
    .react-flow__edge.selected .react-flow__edge-path {
      stroke-width: 2.5px !important;
    }
  }
  .react-flow__edge.selected .react-flow__edge-text {
    fill: var(--primary-color, #6366f1) !important;
    font-weight: 600 !important;
  }
  .react-flow__edge-button {
    fill: var(--primary-color, #6366f1) !important;
  }
  .react-flow__edge-button:hover {
    fill: var(--primary-color-dark, #4f46e5) !important;
  }
  @media (max-width: 1024px) {
    .react-flow__panel {
      width: fit-content !important;
    }
    .react-flow__controls {
      width: fit-content !important;
      bottom: 10px !important;
      right: 10px !important;
    }
  }
  @media (max-width: 768px) {
    .react-flow__minimap {
      display: none !important;
    }
    .react-flow__controls-button {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
    }
  }

  /* Скрываем handles для чужих роадмапов */
  .react-flow[data-is-owner="false"] {
    pointer-events: none !important;
  }   

   .react-flow[data-is-owner="false"] .react-flow__handle{
     opacity: 0 !important;
  }
`

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = reactFlowStyles
  styleElement.id = 'reactflow-custom-styles'
  // Удаляем старый стиль, если он существует
  const existingStyle = document.getElementById('reactflow-custom-styles')
  if (existingStyle) {
    existingStyle.remove()
  }
  document.head.appendChild(styleElement)
}
import styled from 'styled-components'
import { IoClose, IoAdd, IoTrash, IoRefresh } from 'react-icons/io5'
import { useGetRoadmapQuery, useCreateOrUpdateRoadmapMutation } from '@/store/api/achievementDetailApi'
import { useToast } from '@/hooks/useToast'

// Палитра из 6 основных цветов
const COLOR_PALETTE = [
  { name: 'Синий', value: '#3b82f6', id: 'blue' },
  { name: 'Зеленый', value: '#10b981', id: 'green' },
  { name: 'Желтый', value: '#f59e0b', id: 'yellow' },
  { name: 'Красный', value: '#ef4444', id: 'red' },
  { name: 'Фиолетовый', value: '#8b5cf6', id: 'purple' },
  { name: 'Розовый', value: '#ec4899', id: 'pink' },
]

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay-bg, rgba(0, 0, 0, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-start;
  }
`

const ModalContent = styled.div`
  background: var(--bg-primary, #1a1a1a);
  border-radius: 16px;
  width: 100%;
  max-width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color, #2a2a2a);
  box-shadow: var(--shadow-xl, 0 20px 60px rgba(0, 0, 0, 0.5));

  @media (max-width: 768px) {
    max-width: 100vw;
    height: calc(100vh - 70px - env(safe-area-inset-bottom, 0px));
    height: calc(100dvh - 70px - env(safe-area-inset-bottom, 0px));
    border-radius: 0;
    border: none;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    max-width: 95vw;
    height: 95vh;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, #2a2a2a);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary, #fff);

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary, #999);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-secondary, #2a2a2a);
    color: var(--text-primary, #fff);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`

const FlowContainer = styled.div`
  flex: 1;
  position: relative;
  background: var(--bg-secondary, #1a1a1a);
`

const Toolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-primary, #1a1a1a);
  border-bottom: 1px solid var(--border-color, #2a2a2a);
  position: relative;
  z-index: 10;
  flex-wrap: wrap;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.375rem;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 0.875rem;
  }
`

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary, #2a2a2a);
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 8px;
  color: var(--text-primary, #fff);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: var(--bg-tertiary, #3a3a3a);
    border-color: var(--primary-color, #6366f1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    gap: 0.375rem;
    min-width: auto;
    min-height: 44px;

    .button-label {
      display: none;
    }

    .button-label-mobile {
      display: inline;
      font-size: 0.7rem;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
`

const ButtonLabel = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`

const ButtonLabelMobile = styled.span`
  display: none;
  
  @media (max-width: 768px) {
    display: inline;
    font-size: 0.7rem;
  }
`

const SaveButton = styled(ToolbarButton)`
  background: linear-gradient(135deg, var(--primary-color, #6366f1) 0%, var(--primary-color-dark, #4f46e5) 100%);
  border-color: var(--primary-color, #6366f1);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--primary-color-dark, #4f46e5) 0%, var(--primary-color, #6366f1) 100%);
  }
`

const ToolbarHint = styled.div`
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary, #999);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    margin-left: 0.5rem;
    padding: 0.5rem;
    font-size: 0.75rem;
    gap: 0.375rem;
  }
`

const ColorPalette = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  background: var(--bg-secondary, #2a2a2a);
  border-radius: 8px;
  border: 1px solid var(--border-color, #3a3a3a);

  @media (max-width: 768px) {
    gap: 0.375rem;
    padding: 0.375rem;
  }
`

const ColorButton = styled.button<{ $color: string; $isActive?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid ${(props) => (props.$isActive ? '#fff' : 'transparent')};
  background: ${(props) => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 8px ${(props) => props.$color}80;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`

const ColorPickerLabel = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary, #999);
  margin-right: 0.25rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`

interface RoadmapModalProps {
  userAchievementId: string
  achievementId: string
  isOwner: boolean
  onClose: () => void
}

// Кастомный тип ноды для роадмапа с возможностью редактирования
const CustomNode = ({ 
  data, 
  id, 
  updateNodeData,
  isOwner,
}: { 
  data: { label: string; color?: string }
  id: string
  selected?: boolean
  updateNodeData?: (nodeId: string, newData: { label?: string; color?: string }) => void
  isOwner?: boolean
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.label)

  const handleDoubleClick = () => {
    if (isOwner) {
      setIsEditing(true)
      setEditValue(data.label)
    }
  }

  const handleBlur = () => {
    if (updateNodeData && editValue.trim()) {
      updateNodeData(id, { label: editValue.trim() })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setEditValue(data.label)
      setIsEditing(false)
    }
  }

  const handleColor = data.color || 'var(--primary-color, #6366f1)'

  return (
    <>
      {/* Рендерим handles всегда, чтобы edges могли отображаться для всех пользователей */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{
          background: handleColor,
          border: '2px solid var(--bg-primary, #1a1a1a)',
          width: '16px',
          height: '16px',
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{
          background: handleColor,
          border: '2px solid var(--bg-primary, #1a1a1a)',
          width: '16px',
          height: '16px',
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={{
          background: handleColor,
          border: '2px solid var(--bg-primary, #1a1a1a)',
          width: '16px',
          height: '16px',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{
          background: handleColor,
          border: '2px solid var(--bg-primary, #1a1a1a)',
          width: '16px',
          height: '16px',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{
          background: handleColor,
          border: '2px solid var(--bg-primary, #1a1a1a)',
          width: '16px',
          height: '16px',
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          background: handleColor,
          border: '2px solid var(--bg-primary, #1a1a1a)',
          width: '16px',
          height: '16px',
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          background: handleColor,
          border: '2px solid var(--bg-primary, #1a1a1a)',
          width: '16px',
          height: '16px',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          background: handleColor,
          border: '2px solid var(--bg-primary, #1a1a1a)',
          width: '16px',
          height: '16px',
        }}
      />
      <div
        onDoubleClick={handleDoubleClick}
        style={{
          wordBreak: 'break-word',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {isEditing && isOwner ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'inherit',
              width: '100%',
              fontSize: 'inherit',
              fontFamily: 'inherit',
            }}
          />
        ) : (
          data.label
        )}
      </div>
    </>
  )
}

// Внутренний компонент для работы с ReactFlow
const RoadmapFlowInner = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
  isOwner,
  isMobile,
  setEdges,
  addNodeRef,
  nodesLength,
  setNodes,
}: {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  nodeTypes: NodeTypes
  isOwner: boolean
  isMobile: boolean
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  addNodeRef: React.MutableRefObject<(() => void) | null>
  nodesLength: number
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
}) => {
  const { screenToFlowPosition, fitView } = useReactFlow()

  // Вызываем fitView при изменении nodes или edges
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ duration: 300, padding: 0.2 })
    }, 100)
    return () => clearTimeout(timer)
  }, [fitView, nodes.length, edges.length])

  const addNode = useCallback(() => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const flowPosition = screenToFlowPosition({ x: centerX, y: centerY })
    
    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'default',
      position: {
        x: flowPosition.x - 75,
        y: flowPosition.y - 20,
      },
      data: { label: `Шаг ${nodesLength + 1}` },
    }
    
    setNodes((nds: Node[]) => [...nds, newNode])
  }, [screenToFlowPosition, nodesLength, setNodes])

  useEffect(() => {
    addNodeRef.current = addNode
  }, [addNode, addNodeRef])

  // Логируем edges перед рендером для отладки
  useEffect(() => {
    console.log('RoadmapFlowInner render:', { 
      edgesCount: edges.length, 
      edges: edges.map(e => ({ 
        id: e.id, 
        source: e.source, 
        target: e.target, 
        type: e.type,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        style: e.style,
        data: e.data
      })),
      nodesCount: nodes.length,
      nodesIds: nodes.map(n => String(n.id)),
      isOwner,
      // Проверяем соответствие source/target узлам
      edgesWithNodeCheck: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceNodeExists: nodes.some(n => String(n.id) === String(e.source)),
        targetNodeExists: nodes.some(n => String(n.id) === String(e.target))
      }))
    })
  }, [edges, nodes, isOwner])

  return (
    <ReactFlow
      data-is-owner={isOwner ? 'true' : 'false'}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={isOwner ? onConnect : undefined}
      edgesUpdatable={isOwner}
      nodeTypes={nodeTypes}
      nodesDraggable={isOwner}
      nodesConnectable={isOwner}
      elementsSelectable={true}
      deleteKeyCode={isOwner ? 'Delete' : null}
      connectionLineStyle={{ stroke: 'var(--primary-color, #6366f1)', strokeWidth: 2 }}
      connectionLineType={ConnectionLineType.SmoothStep}
      defaultEdgeOptions={{
        style: { stroke: 'var(--primary-color, #6366f1)', strokeWidth: 2 },
        type: 'smoothstep',
        deletable: isOwner,
      }}
      onEdgeUpdate={(oldEdge, newConnection) => {
        if (newConnection.source && newConnection.target) {
          const sourceNode = nodes.find((n) => n.id === newConnection.source)
          const edgeColor = sourceNode?.data?.color || 'var(--primary-color, #6366f1)'
          setEdges((eds: Edge[]) =>
            eds.map((edge: Edge) =>
              edge.id === oldEdge.id
                ? {
                    ...edge,
                    source: newConnection.source!,
                    target: newConnection.target!,
                    style: { stroke: edgeColor, strokeWidth: 2 },
                    data: { color: edgeColor },
                  }
                : edge
            )
          )
        }
      }}
      onEdgesDelete={isOwner ? (deletedEdges) => {
        const edgeIds = deletedEdges.map((edge) => edge.id)
        setEdges((eds: Edge[]) => {
          const filtered = eds.filter((edge) => !edgeIds.includes(edge.id))
          return filtered
        })
      } : undefined}
      style={{
        background: 'var(--bg-secondary, #1a1a1a)',
      }}
    >
      <Background />
      <Controls />
      {!isMobile && <MiniMap />}
    </ReactFlow>
  )
}

export const RoadmapModal = ({ userAchievementId, achievementId, isOwner, onClose }: RoadmapModalProps) => {
  const { data: roadmap, isLoading } = useGetRoadmapQuery({ userAchievementId }, { skip: !userAchievementId })
  const [createOrUpdateRoadmap, { isLoading: isSaving }] = useCreateOrUpdateRoadmapMutation()
  const { showToast } = useToast()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Вычисляем начальные nodes и edges на основе roadmap
  const initialNodes: Node[] = useMemo(() => {
    if (roadmap?.data?.nodes) {
      return (roadmap.data.nodes as Node[]).map((node) => {
        const nodeColor = node.data?.color
        if (nodeColor) {
          return {
            ...node,
            style: {
              backgroundColor: `${nodeColor}20`,
              borderColor: nodeColor,
            },
          }
        }
        return node
      })
    }
    return [
      {
        id: '1',
        type: 'default',
        position: { x: 250, y: 100 },
        data: { label: 'Начало' },
      },
    ]
  }, [roadmap?.data?.nodes])

  const initialEdges: Edge[] = useMemo(() => {
    if (roadmap?.data?.edges && roadmap?.data?.nodes) {
      const nodeIds = new Set((roadmap.data.nodes as Node[]).map(n => String(n.id)))
      const validEdges: Edge[] = []
      for (const edge of roadmap.data.edges as Edge[]) {
        const sourceId = String(edge.source)
        const targetId = String(edge.target)
        // Проверяем, что source и target существуют в nodes
        if (!nodeIds.has(sourceId) || !nodeIds.has(targetId)) {
          console.warn('Edge references non-existent node, skipping:', {
            edgeId: edge.id,
            sourceId,
            targetId,
            availableNodeIds: Array.from(nodeIds)
          })
          continue
        }
        // Сохраняем sourceHandle и targetHandle, так как теперь handles рендерятся всегда
        validEdges.push({
          ...edge,
          id: edge.id || `edge-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: edge.type || 'smoothstep',
          style: edge.style || { stroke: edge.data?.color || 'var(--primary-color, #6366f1)', strokeWidth: 2 },
          data: edge.data || {},
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          animated: false,
        } as Edge)
      }
      return validEdges
    }
    return []
  }, [roadmap?.data?.edges, roadmap?.data?.nodes])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedNodes, setSavedNodes] = useState<Node[]>(initialNodes)
  const [savedEdges, setSavedEdges] = useState<Edge[]>(initialEdges)

  // Кастомный обработчик изменений edges для правильной обработки удаления
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Для не-владельцев всегда используем стандартный обработчик
    if (!isOwner) {
      onEdgesChange(changes)
      return
    }
    // Для владельца обрабатываем удаление edges
    const removeChanges = changes.filter((change) => change.type === 'remove')
    if (removeChanges.length > 0) {
      const edgeIds = removeChanges.map((change) => change.id)
      setEdges((eds) => eds.filter((edge) => !edgeIds.includes(edge.id)))
    } else {
      // Для остальных изменений используем стандартный обработчик
      onEdgesChange(changes)
    }
  }, [isOwner, setEdges, onEdgesChange])

  // Принудительно синхронизируем edges при изменении initialEdges
  useEffect(() => {
    if (initialEdges.length > 0) {
      setEdges((currentEdges) => {
        const currentEdgeIds = new Set(currentEdges.map(e => e.id))
        const initialEdgeIds = new Set(initialEdges.map(e => e.id))
        const edgesMatch = initialEdges.length === currentEdges.length && 
          initialEdges.every(e => currentEdgeIds.has(e.id)) &&
          currentEdges.every(e => initialEdgeIds.has(e.id))
        
        if (!edgesMatch) {
          console.log('Force syncing edges:', { 
            initialEdgesCount: initialEdges.length, 
            currentEdgesCount: currentEdges.length,
            initialEdges: initialEdges.map(e => ({ id: e.id, source: e.source, target: e.target })),
            currentEdges: currentEdges.map(e => ({ id: e.id, source: e.source, target: e.target }))
          })
          return initialEdges
        }
        return currentEdges
      })
    }
  }, [initialEdges, setEdges])

  // Функция для обновления данных ноды
  const updateNodeData = useCallback((nodeId: string, newData: { label?: string; color?: string }) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, data: { ...node.data, ...newData } }
          // Применяем цвет к внешнему wrapper div
          const nodeColor = updatedNode.data?.color
          if (nodeColor) {
            updatedNode.style = {
              backgroundColor: `${nodeColor}20`,
              borderColor: nodeColor,
            }
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { style, ...rest } = updatedNode
            return rest
          }
          return updatedNode
        }
        return node
      })
    )
  }, [setNodes])

  // Обновляем цвета связей при изменении цветов нод
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source)
        const edgeColor = sourceNode?.data?.color || 'var(--primary-color, #6366f1)'
        return {
          ...edge,
          style: { stroke: edgeColor, strokeWidth: 2 },
          data: { color: edgeColor },
        }
      })
    )
  }, [nodes, setEdges])

  // Создаем nodeTypes с передачей необходимых пропсов
  const nodeTypes = useMemo<NodeTypes>(() => ({
    default: (props) => (
      <CustomNode 
        {...props} 
        updateNodeData={updateNodeData}
        isOwner={isOwner}
      />
    ),
  }), [updateNodeData, isOwner])

  // Обновляем nodes и edges при изменении roadmap
  useEffect(() => {
    if (roadmap?.data) {
      console.log('Updating roadmap state:', { 
        nodesCount: initialNodes.length, 
        edgesCount: initialEdges.length, 
        edges: initialEdges, 
        isOwner,
        edgesDetails: initialEdges.map(e => ({ id: e.id, source: e.source, target: e.target, type: e.type })),
        nodesIds: initialNodes.map(n => String(n.id))
      })
      // Устанавливаем nodes и edges из вычисленных значений
      setNodes(initialNodes)
      setEdges(initialEdges)
      setSavedNodes(initialNodes)
      setSavedEdges(initialEdges)
      setHasUnsavedChanges(false)
    }
  }, [roadmap, initialNodes, initialEdges, setNodes, setEdges, isOwner])

  // Отслеживаем изменения для определения несохраненных изменений
  // Используем useMemo для оптимизации сравнения
  const hasChanges = useMemo(() => {
    if (nodes.length !== savedNodes.length || edges.length !== savedEdges.length) {
      return true
    }
    // Сравниваем только позиции и данные, чтобы избежать лишних ререндеров
    const nodesChanged = nodes.some((node, index) => {
      const saved = savedNodes[index]
      return !saved || 
        node.position.x !== saved.position.x || 
        node.position.y !== saved.position.y ||
        node.data.label !== saved.data.label ||
        node.data.color !== saved.data.color
    })
    const edgesChanged = edges.some((edge, index) => {
      const saved = savedEdges[index]
      return !saved || 
        edge.source !== saved.source || 
        edge.target !== saved.target ||
        edge.data?.color !== saved.data?.color
    })
    return nodesChanged || edgesChanged
  }, [nodes, edges, savedNodes, savedEdges])

  useEffect(() => {
    setHasUnsavedChanges(hasChanges)
  }, [hasChanges])

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) {
        return
      }
      // Находим цвет исходной ноды
      const sourceNode = nodes.find((n) => n.id === params.source)
      const edgeColor = sourceNode?.data?.color || 'var(--primary-color, #6366f1)'
      
      const newEdge: Edge = {
        id: `edge-${params.source}-${params.target}-${Date.now()}-${Math.random()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        style: { stroke: edgeColor, strokeWidth: 2 },
        data: { color: edgeColor },
      }
      setEdges((eds) => {
        // Проверяем, нет ли уже такой связи с таким же id
        const exists = eds.some((e) => e.id === newEdge.id)
        if (exists) {
          return eds
        }
        return [...eds, newEdge]
      })
    },
    [setEdges, nodes]
  )

  const addNodeRef = useRef<(() => void) | null>(null)

  // Проверяем, есть ли выбранные ноды
  const hasSelectedNodes = nodes.some((node) => node.selected)
  
  // Проверяем, есть ли выбранные связи
  const hasSelectedEdges = edges.some((edge) => edge.selected)

  const deleteSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected)
    if (selectedNodes.length === 0) {
      showToast('Выберите узлы для удаления', 'info')
      return
    }
    const nodeIds = selectedNodes.map((node) => node.id)
    setNodes((nds) => nds.filter((node) => !nodeIds.includes(node.id)))
    setEdges((eds) => eds.filter((edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)))
    showToast('Узлы удалены', 'success')
  }, [nodes, setNodes, setEdges, showToast])

  const deleteSelectedEdges = useCallback(() => {
    const selectedEdges = edges.filter((edge) => edge.selected)
    if (selectedEdges.length === 0) {
      showToast('Выберите связи для удаления', 'info')
      return
    }
    const edgeIds = selectedEdges.map((edge) => edge.id)
    setEdges((eds) => {
      const filtered = eds.filter((edge) => !edgeIds.includes(edge.id))
      return filtered
    })
    showToast(`Удалено связей: ${selectedEdges.length}`, 'success')
  }, [edges, setEdges, showToast])

  const handleSave = async () => {
    try {
      const roadmapData = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type || 'default',
          position: node.position,
          data: node.data,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          style: edge.style,
          data: edge.data,
        })),
      }
      console.log('Saving roadmap:', { nodesCount: roadmapData.nodes.length, edgesCount: roadmapData.edges.length, edges: roadmapData.edges })
      await createOrUpdateRoadmap({
        userAchievementId,
        data: roadmapData,
      }).unwrap()
      setSavedNodes([...nodes])
      setSavedEdges([...edges])
      setHasUnsavedChanges(false)
      showToast('Роадмап сохранен', 'success')
      onClose()
    } catch (error: unknown) {
      console.error('Error saving roadmap:', error)
      showToast((error as { data?: { message?: string } })?.data?.message || 'Ошибка при сохранении роадмапа', 'error')
    }
  }

  const handleClearAll = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите очистить весь роадмап? Все ноды и связи будут удалены. Изменения сохранятся только после нажатия на "Сохранить".')) {
      setNodes([])
      setEdges([])
      showToast('Роадмап очищен. Не забудьте сохранить изменения.', 'info')
    }
  }, [setNodes, setEdges, showToast])

  const handleClose = useCallback(() => {
    if (isOwner && hasUnsavedChanges) {
      if (window.confirm('У вас есть несохраненные изменения. Вы уверены, что хотите закрыть роадмап без сохранения?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }, [isOwner, hasUnsavedChanges, onClose])

  if (isLoading) {
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary, #999)' }}>
            Загрузка...
          </div>
        </ModalContent>
      </ModalOverlay>
    )
  }

  return (
    <ReactFlowProvider>
      <ModalOverlay onClick={handleClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              Роадмап достижения
              {isOwner && hasUnsavedChanges && (
                <span style={{ 
                  marginLeft: '0.5rem', 
                  fontSize: '0.875rem', 
                  color: 'var(--warning-color, #f59e0b)',
                  fontWeight: 'normal'
                }}>
                  (несохраненные изменения)
                </span>
              )}
            </ModalTitle>
            <CloseButton onClick={handleClose}>
              <IoClose size={24} />
            </CloseButton>
          </ModalHeader>
          {isOwner && (
            <Toolbar>
              <ToolbarButton onClick={() => addNodeRef.current?.()}>
                <IoAdd size={18} />
                <span>Добавить шаг</span>
              </ToolbarButton>
              <ToolbarButton onClick={deleteSelectedNodes} disabled={!hasSelectedNodes}>
                <IoTrash size={18} />
                <ButtonLabel>
                  {hasSelectedNodes 
                    ? (nodes.filter((n) => n.selected).length === 1 ? 'Удалить ноду' : 'Удалить ноды')
                    : 'Удалить ноду'}
                </ButtonLabel>
                <ButtonLabelMobile>ноду</ButtonLabelMobile>
              </ToolbarButton>
              <ToolbarButton onClick={deleteSelectedEdges} disabled={!hasSelectedEdges}>
                <IoTrash size={18} />
                <ButtonLabel>
                  {hasSelectedEdges 
                    ? (edges.filter((e) => e.selected).length === 1 ? 'Удалить связь' : 'Удалить связи')
                    : 'Удалить связь'}
                </ButtonLabel>
                <ButtonLabelMobile>связь</ButtonLabelMobile>
              </ToolbarButton>
              <ToolbarButton 
                onClick={handleClearAll} 
                style={{ background: 'var(--error-color, #ef4444)', borderColor: 'var(--error-color, #ef4444)' }}
              >
                <IoRefresh size={18} />
                <span>Очистить все</span>
              </ToolbarButton>
              <SaveButton onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </SaveButton>
              {hasSelectedNodes && (
                <ColorPalette>
                  <ColorPickerLabel>Цвет:</ColorPickerLabel>
                  {COLOR_PALETTE.map((color) => {
                    const selectedNode = nodes.find((n) => n.selected)
                    const isActive = selectedNode?.data?.color === color.value
                    return (
                      <ColorButton
                        key={color.id}
                        $color={color.value}
                        $isActive={isActive}
                        onClick={() => {
                          const selectedNodes = nodes.filter((n) => n.selected)
                          selectedNodes.forEach((node) => {
                            updateNodeData(node.id, { color: isActive ? undefined : color.value })
                          })
                        }}
                        title={color.name}
                      />
                    )
                  })}
                </ColorPalette>
              )}
              <ToolbarHint>
                <span>💡 Двойной клик по ноде для редактирования</span>
                <span>•</span>
                <span>Выберите ноду и используйте палитру для изменения цвета</span>
                <span>•</span>
                <span>Перетащите от края ноды для соединения</span>
              </ToolbarHint>
            </Toolbar>
          )}
          <FlowContainer>
            <RoadmapFlowInner
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={isOwner ? handleEdgesChange : onEdgesChange}
              onConnect={isOwner ? onConnect : () => {}}
              nodeTypes={nodeTypes}
              isOwner={isOwner}
              isMobile={isMobile}
              setEdges={setEdges}
              addNodeRef={addNodeRef}
              nodesLength={nodes.length}
              setNodes={setNodes}
            />
          </FlowContainer>
        </ModalContent>
      </ModalOverlay>
    </ReactFlowProvider>
  )
}
