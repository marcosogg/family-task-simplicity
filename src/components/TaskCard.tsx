import { Check, Clock } from "lucide-react";

interface TaskCardProps {
  title: string;
  assignee: string;
  dueDate: string;
  priority?: string;
  completed: boolean;
  onToggle: () => void;
}

export const TaskCard = ({ title, assignee, dueDate, priority, completed, onToggle }: TaskCardProps) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg shadow-sm border transition-all duration-200 animate-scale-in
        ${completed ? 'bg-secondary border-secondary' : 'bg-white border-gray-100 hover:border-primary/20'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`font-medium ${completed ? 'text-muted-foreground line-through' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Assigned to: {assignee}</p>
          {priority && (
            <p className={`text-sm mt-1 ${getPriorityColor(priority)}`}>
              Priority: {priority}
            </p>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`p-2 rounded-full transition-colors
            ${completed ? 'bg-primary text-white' : 'bg-secondary text-primary hover:bg-primary hover:text-white'}`}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center mt-3 text-sm text-muted-foreground">
        <Clock className="w-4 h-4 mr-1" />
        <span>Due: {dueDate}</span>
      </div>
    </div>
  );
};