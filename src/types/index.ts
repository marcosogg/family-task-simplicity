export interface Task {
  id: number;
  title: string;
  description?: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  completed: boolean;
}

export type TaskPriority = Task['priority'];