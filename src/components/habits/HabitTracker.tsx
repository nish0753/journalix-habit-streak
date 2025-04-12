import React, { useState, useEffect } from 'react';
import { PlusCircle, Clock as ClockIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Habit, supabase } from '@/lib/supabase';
import { habitCategories } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';

interface HabitTrackerProps {
  limit?: number;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ limit }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching habits:", error);
          toast({
            title: "Error",
            description: "Failed to load habits.",
            variant: "destructive",
          });
        }

        if (data) {
          setHabits(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [user, toast]);

  const displayedHabits = limit ? habits.slice(0, limit) : habits;

  if (loading) {
    return <p>Loading habits...</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Habit Tracker</CardTitle>
        <Link to="/habits">
          <Button variant="ghost" size="sm">
            View All <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedHabits.length > 0 ? (
            displayedHabits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon size={16} className="text-muted-foreground" />
                  <span>{habit.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {habitCategories.find(cat => cat.name === habit.category)?.name || 'No Category'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No habits tracked yet.</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/habits">
          <Button variant="secondary" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Habit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
