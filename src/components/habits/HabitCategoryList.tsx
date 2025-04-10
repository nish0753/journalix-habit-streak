
import React from 'react';
import { habitCategories } from '@/lib/mockData';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HabitCategoryList: React.FC = () => {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Categories</h2>
          <Button variant="outline" size="sm">
            <Plus size={16} className="mr-1" />
            New Category
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {habitCategories.map(category => (
            <div key={category.id} className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                  <Pencil size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitCategoryList;
