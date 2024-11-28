import { Check, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { TaskPriority } from "@/types";

interface TaskCardProps {
  title: string;
  assignee: string;
  priority: TaskPriority;
  category: string;
  completed: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

export const TaskCard = ({ 
  title, 
  assignee, 
  priority, 
  category,
  completed, 
  onToggle, 
  onEdit 
}: TaskCardProps) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div 
      className={cn(
        "p-4 rounded-lg shadow-sm border transition-all duration-300 animate-scale-in group",
        completed ? 'bg-secondary/50 border-secondary opacity-75' : 'bg-white border-gray-100 hover:border-primary/20 opacity-100'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className={cn(
            "font-medium transition-all duration-300",
            completed ? 'text-muted-foreground line-through' : 'text-gray-900'
          )}>
            {title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              Assigned to: {assignee}
            </span>
            <span className={cn(
              "text-sm px-2 py-0.5 rounded-full",
              getPriorityColor(priority)
            )}>
              {priority} Priority
            </span>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {category}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 transition-colors duration-300",
              completed ? 'bg-primary text-white' : 'bg-secondary text-primary hover:bg-primary hover:text-white'
            )}
          >
            <Check className={cn(
              "h-4 w-4 transition-transform duration-300",
              completed ? 'scale-110' : 'scale-100'
            )} />
          </Button>
        </div>
      </div>
    </div>
  );
};