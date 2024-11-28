import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface TaskFormProps {
  onSubmit: (task: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const FAMILY_MEMBERS = ["Tommy", "Sarah", "Mom", "Dad"];
const PRIORITIES = ["Low", "Medium", "High"];
const CATEGORIES = ["Homework", "Chores", "Activities", "Other"];

export const TaskForm = ({ onSubmit, onCancel, initialData }: TaskFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [assignee, setAssignee] = useState(initialData?.assignee || "");
  const [priority, setPriority] = useState(initialData?.priority || "Medium");
  const [category, setCategory] = useState(initialData?.category || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!assignee) newErrors.assignee = "Please select an assignee";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const task = {
      id: initialData?.id || Date.now(),
      title,
      description,
      assignee,
      priority,
      category,
      completed: initialData?.completed || false,
    };

    onSubmit(task);
    toast({
      title: initialData ? "Task updated successfully! 🎉" : "Task created successfully! 🎉",
      description: `"${title}" has been ${initialData ? 'updated' : 'assigned'} to ${assignee}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about the task..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assigned To *</Label>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger className={errors.assignee ? "border-destructive" : ""}>
            <SelectValue placeholder="Select family member" />
          </SelectTrigger>
          <SelectContent>
            {FAMILY_MEMBERS.map((member) => (
              <SelectItem key={member} value={member}>
                {member}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.assignee && (
          <p className="text-sm text-destructive">{errors.assignee}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? 'Update' : 'Create'} Task</Button>
      </div>
    </form>
  );
};