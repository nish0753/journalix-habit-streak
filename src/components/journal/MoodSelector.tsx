
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Smile, Frown, Angry, Meh, Heart, Sun, Moon, Cloud, CloudRain, CloudLightning } from 'lucide-react';

type Mood = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited' | 'peaceful' | 'tired' | 'anxious' | 'grateful' | 'motivated';

interface MoodSelectorProps {
  selectedMood: Mood | undefined;
  onChange: (mood: Mood) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onChange }) => {
  const moods: { value: Mood; icon: React.ReactNode; label: string; color: string }[] = [
    { value: 'happy', icon: <Smile className="h-5 w-5" />, label: 'Happy', color: 'bg-yellow-400 hover:bg-yellow-500' },
    { value: 'sad', icon: <Frown className="h-5 w-5" />, label: 'Sad', color: 'bg-blue-400 hover:bg-blue-500' },
    { value: 'angry', icon: <Angry className="h-5 w-5" />, label: 'Angry', color: 'bg-red-400 hover:bg-red-500' },
    { value: 'neutral', icon: <Meh className="h-5 w-5" />, label: 'Neutral', color: 'bg-gray-400 hover:bg-gray-500' },
    { value: 'excited', icon: <Heart className="h-5 w-5" />, label: 'Excited', color: 'bg-pink-400 hover:bg-pink-500' },
    { value: 'peaceful', icon: <Sun className="h-5 w-5" />, label: 'Peaceful', color: 'bg-orange-300 hover:bg-orange-400' },
    { value: 'tired', icon: <Moon className="h-5 w-5" />, label: 'Tired', color: 'bg-indigo-300 hover:bg-indigo-400' },
    { value: 'anxious', icon: <CloudLightning className="h-5 w-5" />, label: 'Anxious', color: 'bg-purple-300 hover:bg-purple-400' },
    { value: 'grateful', icon: <Cloud className="h-5 w-5" />, label: 'Grateful', color: 'bg-cyan-300 hover:bg-cyan-400' },
    { value: 'motivated', icon: <Sun className="h-5 w-5" />, label: 'Motivated', color: 'bg-lime-300 hover:bg-lime-400' },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-lg font-medium">How are you feeling today?</Label>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <Button
            key={mood.value}
            type="button"
            variant={selectedMood === mood.value ? "default" : "outline"}
            className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 transform hover:scale-105 ${selectedMood === mood.value ? mood.color : ''}`}
            onClick={() => onChange(mood.value)}
          >
            {mood.icon}
            <span>{mood.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
