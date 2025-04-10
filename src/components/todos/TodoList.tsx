
import React, { useState } from 'react';
import { todos } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, ChevronRight, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo } from '@/types';
import { Link } from 'react-router-dom';

interface TodoListProps {
  limit?: number;
}

const TodoList: React.FC<TodoListProps> = ({ limit }) => {
  const [userTodos, setUserTodos] = useState<Todo[]>(limit ? todos.slice(0, limit) : todos);

  const toggleTodo = (id: string) => {
    setUserTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }
    
    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUp className="h-3 w-3 text-destructive" />;
      case 'medium':
        return <ArrowRight className="h-3 w-3 text-yellow-500" />;
      case 'low':
        return <ArrowDown className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Todo List</h2>
          <div className="flex items-center gap-2">
            <Link to="/tasks">
              <Button variant="outline" size="sm" className="gap-1">
                View All
                <ChevronRight size={16} />
              </Button>
            </Link>
            <Button size="sm" className="gap-1">
              <Plus size={16} />
              Add Task
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-2">
          {userTodos.map(todo => (
            <div 
              key={todo.id} 
              className={cn(
                "p-3 rounded-lg border border-border hover:border-primary/50 transition-all group",
                todo.completed && "bg-muted/50"
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox 
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <label 
                      htmlFor={`todo-${todo.id}`}
                      className={cn(
                        "font-medium cursor-pointer",
                        todo.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {todo.title}
                    </label>
                    <div className="flex items-center gap-1">
                      {todo.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>{formatDate(todo.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {todo.description && (
                    <p className={cn(
                      "text-sm text-muted-foreground mt-1",
                      todo.completed && "line-through"
                    )}>
                      {todo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {todo.category && (
                      <span className="text-xs text-muted-foreground py-0.5 px-1.5 bg-secondary rounded">
                        {todo.category}
                      </span>
                    )}
                    <span className="text-xs flex items-center gap-0.5">
                      {getPriorityIcon(todo.priority)}
                      <span className="capitalize text-muted-foreground">{todo.priority}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
