'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateProfile } from '@/lib/api';
import { Button } from "@/components/ui/button";
import SkillSelector from '@/components/SkillSelector';

interface Profile {
  username: string;
  email: string;
  selectedSkills: string[];
}

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (_err) {
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updates: Partial<Profile> = { username, email };
      if (password) updates.password = password;
      
      await updateProfile(updates);
      setSuccess('Profile updated successfully');
      setPassword('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      setSuccess('');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Skills</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditingSkills(!isEditingSkills)}
          >
            {isEditingSkills ? 'Cancel' : 'Edit Skills'}
          </Button>
        </div>
        
        {isEditingSkills ? (
          <SkillSelector initialSkills={profile.selectedSkills} />
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.selectedSkills.map(skill => (
              <div key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 