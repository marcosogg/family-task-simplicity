import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Task {
  id: number;
  title: string;
  description?: string;
  assignee: string;
  priority: string;
  category?: string;
  completed: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete homework",
      assignee: "Tommy",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Clean room",
      assignee: "Sarah",
      priority: "Medium",
      completed: true,
    },
    {
      id: 3,
      title: "Family game night",
      assignee: "Everyone",
      priority: "Low",
      completed: false,
    },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    } else {
      setTasks([updatedTask, ...tasks]);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="container py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Family Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage your family's daily activities</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={handleSaveTask}
              onCancel={handleCloseForm}
              initialData={editingTask}
            />
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              assignee={task.assignee}
              priority={task.priority}
              completed={task.completed}
              onToggle={() => toggleTask(task.id)}
              onEdit={() => handleEditTask(task)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;