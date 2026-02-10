export type ViewMode = 'grid' | 'tree';

export interface Planet {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  radius: number;
  total: number;
  unlocked: number;
  color: string;
  connections: number[];
}

export interface TreeNode extends Planet {
  achievements: Array<{
    id: string;
    icon: string;
    unlocked: boolean;
  }>;
  expanded: boolean;
}

export interface CosmosState {
  scale: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  lastX: number;
  lastY: number;
  hoveredNode: string | null;
}
