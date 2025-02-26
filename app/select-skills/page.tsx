'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSkills } from '../utils/api';
import { Button } from "@/components/ui/button";

const AVAILABLE_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
  'Java', 'C++', 'AWS', 'Docker', 'Git'
];

export default function SelectSkillsPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState('');
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
      await saveSkills(selectedSkills);
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save skills');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Select Your Skills</h1>
      <p className="mb-8 text-gray-600">Choose the skills you want to learn:</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {AVAILABLE_SKILLS.map(skill => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`p-4 rounded-lg border ${
              selectedSkills.includes(skill)
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <Button 
        onClick={handleSubmit}
        disabled={selectedSkills.length === 0}
        className="w-full"
      >
        Continue to Resources
      </Button>
    </div>
  );
}

