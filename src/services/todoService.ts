
import { supabase } from '@/lib/supabase';
import { Todo } from '@/types';

export const fetchUserTodos = async (userId: string, limit?: number): Promise<Todo[]> => {
  let query = supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error('Error fetching todos:', error);
    throw new Error('Failed to fetch todos');
  }
  
  return data.map(todo => ({
    ...todo,
    id: todo.id,
    createdAt: new Date(todo.created_at),
    dueDate: todo.due_date ? new Date(todo.due_date) : undefined
  }));
};

export const createTodo = async (
  todo: Omit<Todo, 'id' | 'createdAt'> & { userId: string }
): Promise<Todo> => {
  const { data, error } = await supabase
    .from('todos')
    .insert({
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      due_date: todo.dueDate?.toISOString(),
      priority: todo.priority,
      category: todo.category,
      user_id: todo.userId
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating todo:', error);
    throw new Error('Failed to create todo');
  }
  
  return {
    ...data,
    id: data.id,
    createdAt: new Date(data.created_at),
    dueDate: data.due_date ? new Date(data.due_date) : undefined
  };
};

export const updateTodo = async (
  todo: Partial<Todo> & { id: string }
): Promise<Todo> => {
  const updates: any = { ...todo };
  
  // Convert Date objects to ISO strings for the database
  if (updates.dueDate) {
    updates.due_date = updates.dueDate.toISOString();
    delete updates.dueDate;
  }
  
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', todo.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating todo:', error);
    throw new Error('Failed to update todo');
  }
  
  return {
    ...data,
    id: data.id,
    createdAt: new Date(data.created_at),
    dueDate: data.due_date ? new Date(data.due_date) : undefined
  };
};

export const toggleTodoCompletion = async (todoId: string): Promise<Todo> => {
  // First, get the current todo data
  const { data: todo, error: fetchError } = await supabase
    .from('todos')
    .select('*')
    .eq('id', todoId)
    .single();
    
  if (fetchError) {
    console.error('Error fetching todo:', fetchError);
    throw new Error('Failed to fetch todo for completion toggle');
  }
  
  // Toggle the completed state
  const { data: updatedTodo, error: updateError } = await supabase
    .from('todos')
    .update({
      completed: !todo.completed
    })
    .eq('id', todoId)
    .select()
    .single();
    
  if (updateError) {
    console.error('Error toggling todo completion:', updateError);
    throw new Error('Failed to toggle todo completion');
  }
  
  return {
    ...updatedTodo,
    id: updatedTodo.id,
    createdAt: new Date(updatedTodo.created_at),
    dueDate: updatedTodo.due_date ? new Date(updatedTodo.due_date) : undefined
  };
};

export const deleteTodo = async (todoId: string): Promise<void> => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId);
    
  if (error) {
    console.error('Error deleting todo:', error);
    throw new Error('Failed to delete todo');
  }
};
