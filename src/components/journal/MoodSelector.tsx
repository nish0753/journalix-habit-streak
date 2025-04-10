
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Smile, Frown, Angry, Meh, Heart } from 'lucide-react';

type Mood = 'happy' | 'sad' | 'angry' | 'neutral' | 'excited';

interface MoodSelectorProps {
  selectedMood: Mood | undefined;
  onChange: (mood: Mood) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onChange }) => {
  const moods: { value: Mood; icon: React.ReactNode; label: string }[] = [
    { value: 'happy', icon: <Smile className="h-5 w-5" />, label: 'Happy' },
    { value: 'sad', icon: <Frown className="h-5 w-5" />, label: 'Sad' },
    { value: 'angry', icon: <Angry className="h-5 w-5" />, label: 'Angry' },
    { value: 'neutral', icon: <Meh className="h-5 w-5" />, label: 'Neutral' },
    { value: 'excited', icon: <Heart className="h-5 w-5" />, label: 'Excited' },
  ];

  return (
    <div className="space-y-3">
      <Label>How are you feeling today?</Label>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <Button
            key={mood.value}
            type="button"
            variant={selectedMood === mood.value ? "default" : "outline"}
            className="flex items-center gap-2 px-3 py-2"
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
