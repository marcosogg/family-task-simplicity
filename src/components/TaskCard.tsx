import { Check, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  title: string;
  assignee: string;
  priority?: string;
  category: string;
  completed: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

export const TaskCard = ({ 
  title, 
  assignee, 
  priority, 
  completed, 
  onToggle, 
  onEdit 
}: TaskCardProps) => {
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
      className={cn(
        "p-4 rounded-lg shadow-sm border transition-all duration-300 animate-scale-in group",
        completed ? 'bg-secondary/50 border-secondary' : 'bg-white border-gray-100 hover:border-primary/20',
        completed ? 'opacity-75' : 'opacity-100'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={cn(
            "font-medium transition-all duration-300",
            completed ? 'text-muted-foreground line-through' : 'text-gray-900'
          )}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Assigned to: {assignee}</p>
          {priority && (
            <p className={`text-sm mt-1 ${getPriorityColor(priority)}`}>
              Priority: {priority}
            </p>
          )}
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