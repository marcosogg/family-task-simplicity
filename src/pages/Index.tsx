import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Users, Folder } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: number;
  title: string;
  description?: string;
  assignee: string;
  priority: string;
  category: string;
  completed: boolean;
}

type GroupBy = "category" | "assignee";

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
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>("category");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

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

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  // Get unique assignees for filter dropdown
  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee)));

  // Filter tasks based on selected assignee
  const filteredTasks = selectedAssignee
    ? tasks.filter(task => task.assignee === selectedAssignee)
    : tasks;

  // Group tasks by category or assignee
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const groupKey = groupBy === "category" ? task.category : task.assignee;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

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

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Select
              value={groupBy}
              onValueChange={(value: GroupBy) => setGroupBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Group by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">
                  <div className="flex items-center">
                    <Folder className="w-4 h-4 mr-2" />
                    Group by Category
                  </div>
                </SelectItem>
                <SelectItem value="assignee">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Group by Assignee
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedAssignee}
              onValueChange={setSelectedAssignee}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by assignee..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Members</SelectItem>
                {uniqueAssignees.map(assignee => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([group, groupTasks]) => (
            <div key={group} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleGroup(group)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {groupBy === "category" ? group : `Assigned to: ${group}`}
                </h2>
                {expandedGroups.includes(group) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedGroups.includes(group) && (
                <div className="p-4 space-y-4 border-t border-gray-200">
                  {groupTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      assignee={task.assignee}
                      priority={task.priority}
                      category={task.category}
                      completed={task.completed}
                      onToggle={() => toggleTask(task.id)}
                      onEdit={() => handleEditTask(task)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;