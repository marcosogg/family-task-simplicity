import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { Task } from "@/types";

export const useTasks = () => {
  const { session } = useSessionContext();
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
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
        throw error;
      }

      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", taskId);

      if (error) throw error;
      return taskId;
    },
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', session?.user?.id] });
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        toast({
          title: !task.completed ? "Task completed! 🎉" : "Task reopened",
          description: task.title,
        });
      }
    },
  });

  const saveTaskMutation = useMutation({
    mutationFn: async (updatedTask: Partial<Task>) => {
      if (!session?.user?.id) {
        throw new Error("No user session found");
      }

      // If updating an existing task
      if (updatedTask.id) {
        const { id, ...updateData } = updatedTask;
        const { error } = await supabase
          .from("tasks")
          .update(updateData)
          .eq("id", id);
        if (error) throw error;
      } else {
        // For new tasks
        const { error } = await supabase
          .from("tasks")
          .insert({
            ...updatedTask,
            user_id: session.user.id,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', session?.user?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    tasks,
    isLoading,
    toggleTask: toggleTaskMutation.mutate,
    saveTask: saveTaskMutation.mutate,
  };
};