"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSkills } from '@/lib/api';
import { Button } from "@/components/ui/button";

const AVAILABLE_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
  'Java', 'C++', 'AWS', 'Docker', 'Git'
];

export default function SkillSelector() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await saveSkills(selectedSkills);
      localStorage.setItem('selectedSkills', JSON.stringify(selectedSkills));
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save skills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {AVAILABLE_SKILLS.map(skill => (
          <button
            key={skill}
            type="button"
            onClick={() => toggleSkill(skill)}
            className={`p-4 rounded-lg border transition-colors ${
              selectedSkills.includes(skill)
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {error && <div className="text-red-500">{error}</div>}
      
      <Button 
        onClick={handleSubmit}
        disabled={selectedSkills.length === 0 || loading}
        className="w-full"
      >
        {loading ? 'Saving...' : 'Continue to Resources'}
      </Button>
    </div>
  );
}

