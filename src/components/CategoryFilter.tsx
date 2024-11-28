import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategories,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm text-muted-foreground mb-2">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={`category-${category}`}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => onCategoryChange(category)}
            />
            <Label
              htmlFor={`category-${category}`}
              className="text-sm font-normal cursor-pointer"
            >
              {category}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};