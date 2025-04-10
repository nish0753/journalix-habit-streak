
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const fetchQuote = async () => {
  try {
    const response = await fetch('https://api.quotable.io/random?tags=inspirational,motivation');
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};

const MotivationalQuote: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['motivationalQuote'],
    queryFn: fetchQuote,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading quote...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        "Believe you can and you're halfway there." - Theodore Roosevelt
      </div>
    );
  }

  return (
    <div className="p-4 text-sm italic text-muted-foreground">
      "{data.content}" - {data.author}
    </div>
  );
};

export default MotivationalQuote;
