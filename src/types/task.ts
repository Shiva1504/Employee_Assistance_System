export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  proof: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

  export interface QuickAction {
    id: string;
    title: string;
    icon: string;
    action: () => void;
  }