import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface TaskHeaderProps {
  onNewTask: () => void;
}

export const TaskHeader = ({ onNewTask }: TaskHeaderProps) => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Family Tasks</h1>
        <p className="text-muted-foreground mt-1">Manage your family's daily activities</p>
      </div>
      <div className="flex gap-4">
        <Button onClick={onNewTask}>
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
  );
};