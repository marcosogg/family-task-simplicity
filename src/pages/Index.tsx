import { useState, useEffect } from "react";
import { TaskList } from "@/components/TaskList";
import { FilterPanel } from "@/components/FilterPanel";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task } from "@/types";
import { TaskForm } from "@/components/TaskForm";
import { TaskHeader } from "@/components/TaskHeader";
import { useTasks } from "@/hooks/useTasks";

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { tasks, isLoading: isTasksLoading, toggleTask, saveTask } = useTasks();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/login");
    }
  }, [session, isSessionLoading, navigate]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSaveTask = async (updatedTask: any) => {
    await saveTask(updatedTask);
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee)));
  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)));

  if (isSessionLoading || isTasksLoading) {
    return <div className="min-h-screen bg-muted flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="container py-8 animate-fade-in">
        <TaskHeader onNewTask={() => setIsFormOpen(true)} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <FilterPanel
              assignees={uniqueAssignees}
              selectedAssignee={selectedAssignee}
              onAssigneeChange={setSelectedAssignee}
              categories={uniqueCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={(category) => {
                setSelectedCategories(prev =>
                  prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
                );
              }}
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
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
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