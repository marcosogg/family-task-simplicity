import { CategoryFilter } from "./CategoryFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPanelProps {
  assignees: string[];
  selectedAssignee: string;
  onAssigneeChange: (value: string) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
}

export const FilterPanel = ({
  assignees,
  selectedAssignee,
  onAssigneeChange,
  categories,
  selectedCategories,
  onCategoryChange,
}: FilterPanelProps) => {
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-2">Assignee</h3>
        <Select value={selectedAssignee} onValueChange={onAssigneeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by assignee..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            {assignees.map(assignee => (
              <SelectItem key={assignee} value={assignee}>
                {assignee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};