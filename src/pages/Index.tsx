import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { TaskList } from "@/components/TaskList";
import { FilterPanel } from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
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
  const navigate = useNavigate();
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/login");
    }
  }, [session, isLoading, navigate]);

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setTasks(data || []);
  };

  const toggleTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", taskId);

    if (error) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newStatus = !t.completed;
        toast({
          title: newStatus ? "Task completed! 🎉" : "Task reopened",
          description: t.title,
        });
        return { ...t, completed: newStatus };
      }
      return t;
    }));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSaveTask = async (updatedTask: any) => {
    if (editingTask) {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          assignee: updatedTask.assignee,
          priority: updatedTask.priority,
          category: updatedTask.category,
        })
        .eq("id", editingTask.id);

      if (error) {
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from("tasks")
        .insert({
          ...updatedTask,
          user_id: session?.user?.id,
        });

      if (error) {
        toast({
          title: "Error creating task",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
    }

    await fetchTasks();
    setIsFormOpen(false);
    setEditingTask(null);
    toast({
      title: editingTask ? "Task updated successfully! 🎉" : "Task created successfully! 🎉",
      description: `"${updatedTask.title}" has been ${editingTask ? "updated" : "assigned"} to ${updatedTask.assignee}`,
    });
  };

  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee)));
  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)));

  if (isLoading) {
    return <div className="min-h-screen bg-muted flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="container py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Family Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage your family's daily activities</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button 
              variant="outline" 
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>

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