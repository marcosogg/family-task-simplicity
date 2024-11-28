import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskList } from "@/components/TaskList";
import { FilterPanel } from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task } from "@/types";
import { TaskForm } from "@/components/TaskForm";

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete homework",
      assignee: "Tommy",
      priority: "High",
      category: "School",
      completed: false,
    },
    {
      id: 2,
      title: "Clean room",
      assignee: "Sarah",
      priority: "Medium",
      category: "Chores",
      completed: true,
    },
    {
      id: 3,
      title: "Family game night",
      assignee: "Everyone",
      priority: "Low",
      category: "Activities",
      completed: false,
    },
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee)));
  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)));

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
      toast({
        title: "Task updated",
        description: "The task has been successfully updated.",
      });
    } else {
      setTasks([updatedTask, ...tasks]);
      toast({
        title: "Task created",
        description: "New task has been added successfully.",
      });
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterPanel
              assignees={uniqueAssignees}
              selectedAssignee={selectedAssignee}
              onAssigneeChange={setSelectedAssignee}
              categories={uniqueCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          <div className="md:col-span-3">
            <TaskList
              tasks={tasks}
              selectedAssignee={selectedAssignee}
              selectedCategories={selectedCategories}
              onToggleTask={toggleTask}
              onEditTask={handleEditTask}
            />
          </div>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={handleSaveTask}
              onCancel={() => setIsFormOpen(false)}
              initialData={editingTask}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;