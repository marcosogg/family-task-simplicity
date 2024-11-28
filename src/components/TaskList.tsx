import { Task } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  selectedAssignee: string;
  selectedCategories: string[];
  onToggleTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
}

export const TaskList = ({ 
  tasks, 
  selectedAssignee, 
  selectedCategories,
  onToggleTask, 
  onEditTask 
}: TaskListProps) => {
  const filteredTasks = tasks.filter(task => {
    const matchesAssignee = selectedAssignee === "all" || task.assignee === selectedAssignee;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(task.category);
    return matchesAssignee && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          assignee={task.assignee}
          priority={task.priority}
          category={task.category}
          completed={task.completed}
          onToggle={() => onToggleTask(task.id)}
          onEdit={() => onEditTask(task)}
        />
      ))}
    </div>
  );
};