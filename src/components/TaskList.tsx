import { Task } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  selectedAssignee: string;
  onToggleTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
}

export const TaskList = ({ tasks, selectedAssignee, onToggleTask, onEditTask }: TaskListProps) => {
  const filteredTasks = selectedAssignee === "all" 
    ? tasks 
    : tasks.filter(task => task.assignee === selectedAssignee);

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onEdit={() => onEditTask(task)}
        />
      ))}
    </div>
  );
};