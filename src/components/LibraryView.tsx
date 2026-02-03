import React, { useState } from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { SearchInput } from './Input';
import { Chip } from './Chip';
import { Button } from './Button';
import { ResourceCard, Resource } from './ResourceCard';

interface LibraryViewProps {
  onAnalyze: (id: string) => void;
  onAddToPlan: (id: string) => void;
}

export function LibraryView({ onAnalyze, onAddToPlan }: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Database',
    'Algorithms',
    'Networks'
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Introduction to Data Structures',
      type: 'ppt',
      subject: 'Computer Science',
      estimatedTime: '4h 30m',
      difficulty: 'medium',
      pages: 85,
      progress: 65
    },
    {
      id: '2',
      title: 'Database Management Systems',
      type: 'pdf',
      subject: 'Database',
      estimatedTime: '6h 15m',
      difficulty: 'hard',
      pages: 120,
      progress: 30
    },
    {
      id: '3',
      title: 'Algorithm Analysis Tutorial',
      type: 'video',
      subject: 'Algorithms',
      estimatedTime: '2h 45m',
      difficulty: 'easy',
      progress: 100
    },
    {
      id: '4',
      title: 'Computer Networks Fundamentals',
      type: 'ppt',
      subject: 'Networks',
      estimatedTime: '5h 00m',
      difficulty: 'medium',
      pages: 95,
      progress: 0
    },
    {
      id: '5',
      title: 'Linear Algebra Concepts',
      type: 'pdf',
      subject: 'Mathematics',
      estimatedTime: '7h 30m',
      difficulty: 'hard',
      pages: 150,
      progress: 45
    },
    {
      id: '6',
      title: 'Quantum Mechanics Basics',
      type: 'video',
      subject: 'Physics',
      estimatedTime: '3h 20m',
      difficulty: 'medium',
      progress: 20
    }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.includes(resource.subject);
    return matchesSearch && matchesTags;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
          Materials Library
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Manage and organize your study resources
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search materials..."
              onClear={() => setSearchQuery('')}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="md"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid size={20} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="md"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={20} />
            </Button>
            <Button variant="ghost" size="md">
              <SlidersHorizontal size={20} />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-[var(--color-text-muted)] animate-in fade-in duration-500" style={{ animationDelay: '200ms' }}>
        Showing {filteredResources.length} of {resources.length} materials
      </div>

      {/* Resources Grid/List */}
      <div className={`
        animate-in fade-in slide-in-from-bottom-4 duration-500
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' 
          : 'space-y-3'
        }
      `} style={{ animationDelay: '300ms' }}>
        {filteredResources.length > 0 ? (
          filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onAnalyze={onAnalyze}
              onAddToPlan={onAddToPlan}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="glass-card rounded-[var(--radius-lg)] p-12 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <List size={32} className="text-[var(--color-text-muted)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                No materials found
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
