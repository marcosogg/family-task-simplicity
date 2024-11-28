import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: number;
  title: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete homework",
      assignee: "Tommy",
      dueDate: "Today",
      completed: false,
    },
    {
      id: 2,
      title: "Clean room",
      assignee: "Sarah",
      dueDate: "Tomorrow",
      completed: true,
    },
    {
      id: 3,
      title: "Family game night",
      assignee: "Everyone",
      dueDate: "Friday",
      completed: false,
    },
  ]);

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = !task.completed;
        toast({
          title: newStatus ? "Task completed! 🎉" : "Task reopened",
          description: task.title,
        });
        return { ...task, completed: newStatus };
      }
      return task;
    }));
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="container py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Family Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage your family's daily activities</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              assignee={task.assignee}
              dueDate={task.dueDate}
              completed={task.completed}
              onToggle={() => toggleTask(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;