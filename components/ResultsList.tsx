'use client';

import { useEffect, useState } from 'react';
import { getCourses } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface Course {
  title: string;
  url: string;
  platform: string;
  description?: string;
}

export default function ResultsList() {
  const [courses, setCourses] = useState<Record<string, Course[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const skills = JSON.parse(localStorage.getItem('selectedSkills') || '[]');
        setDebugInfo(prev => [...prev, `Found skills: ${skills.join(', ')}`]);

        if (skills.length === 0) {
          setError('No skills selected');
          setLoading(false);
          return;
        }

        const courseData: Record<string, Course[]> = {};
        let hasError = false;

        for (const skill of skills) {
          try {
            setDebugInfo(prev => [...prev, `Fetching courses for ${skill}`]);
            const skillCourses = await getCourses(skill);
        
            // Validate that skillCourses is an array before proceeding
            if (!Array.isArray(skillCourses)) {
              throw new Error(`Invalid response for ${skill}`);
            }
        
            setDebugInfo(prev => [...prev, `Received ${skillCourses.length} courses for ${skill}`]);
            courseData[skill] = skillCourses;
          } catch (error) {
            hasError = true;
            if (error instanceof Error) {
              setDebugInfo(prev => [...prev, `Error for ${skill}: ${error.message}`]);
            } else {
              setDebugInfo(prev => [...prev, `Error for ${skill}: ${String(error)}`]);
            }
          }
        }
        

        if (Object.keys(courseData).length === 0 && hasError) {
          setError('Failed to load courses. Please try again.');
        } else {
          setCourses(courseData);
          setDebugInfo(prev => [...prev, `Total skills loaded: ${Object.keys(courseData).length}`]);
        }
      } catch (error) {
        setError('Failed to load courses');
        setDebugInfo(prev => [...prev, `Fatal error: ${error.message}`]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-lg animate-pulse mb-4">Loading your personalized resources...</div>
        <div className="text-sm text-gray-500">
          {debugInfo.map((info, i) => (
            <div key={i}>{info}</div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <div className="text-sm text-gray-500 mb-4">
          {debugInfo.map((info, i) => (
            <div key={i}>{info}</div>
          ))}
        </div>
        <Button onClick={() => window.location.href = '/select-skills'}>
          Select Skills
        </Button>
      </div>
    );
  }

  if (Object.keys(courses).length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">No courses found for your selected skills.</p>
        <Button onClick={() => router.push('/select-skills')}>Select Skills</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(courses).map(([skill, skillCourses]) => (
        <div key={skill} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">{skill}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skillCourses.map((course, index) => (
              <a
                key={index}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg mb-2">{course.title}</h3>
                <p className="text-blue-600 mb-2">{course.platform}</p>
                {course.description && (
                  <p className="text-sm text-gray-500">{course.description}</p>
                )}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

