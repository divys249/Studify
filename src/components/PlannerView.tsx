import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { StudySessionCard, WeeklyGrid, StudySession } from './StudySession';
import { Modal } from './Modal';
import { Sparkles, Calendar as CalendarIcon, Edit3 } from 'lucide-react';
import { Badge } from './Badge';

export function PlannerView() {
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');

  const [formData, setFormData] = useState({
    hoursPerDay: '4',
    studyBlocks: [] as string[],
    examDate: '',
    prioritySubjects: [] as string[]
  });

  const studySessions: StudySession[] = [
    {
      id: '1',
      subject: 'Data Structures',
      title: 'Binary Trees & Graphs',
      duration: 90,
      startTime: '9:00',
      color: '#9B7CFF',
      type: 'Deep focus'
    },
    {
      id: '2',
      subject: 'Algorithms',
      title: 'Dynamic Programming',
      duration: 60,
      startTime: '14:00',
      color: '#5AC8FA',
      type: 'Review'
    },
    {
      id: '3',
      subject: 'Database Systems',
      title: 'SQL Queries',
      duration: 90,
      startTime: '16:00',
      color: '#FFB86B',
      type: 'Deep focus'
    },
    {
      id: '4',
      subject: 'Computer Networks',
      title: 'OSI Model',
      duration: 45,
      startTime: '10:00',
      color: '#FF6B6B',
      type: 'Quick recap'
    }
  ];

  const handleSessionClick = (session: StudySession) => {
    setSelectedSession(session);
    setShowEditModal(true);
  };

  const handleGenerate = () => {
    setShowGenerateForm(false);
    // Logic to generate timetable would go here
  };

  const timeBlocks = ['Morning (6-12)', 'Afternoon (12-18)', 'Evening (18-24)'];
  const subjects = ['Data Structures', 'Algorithms', 'Database', 'Networks', 'Operating Systems'];

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            Study Planner
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Auto-generate and customize your study schedule
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            onClick={() => setViewMode(viewMode === 'week' ? 'list' : 'week')}
          >
            <CalendarIcon size={18} />
            {viewMode === 'week' ? 'List View' : 'Week View'}
          </Button>
          <Button onClick={() => setShowGenerateForm(true)}>
            <Sparkles size={18} />
            Generate Plan
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
        <Card variant="compact">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">This Week</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">24h</p>
        </Card>
        <Card variant="compact">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Sessions</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">16</p>
        </Card>
        <Card variant="compact">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Completed</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">68%</p>
        </Card>
        <Card variant="compact">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Subjects</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">5</p>
        </Card>
      </div>

      {/* Timetable */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
        {viewMode === 'week' ? (
          <Card variant="default">
            <WeeklyGrid 
              sessions={studySessions}
              onSessionClick={handleSessionClick}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {studySessions.map(session => (
              <StudySessionCard
                key={session.id}
                session={session}
                onClick={() => handleSessionClick(session)}
                draggable
              />
            ))}
          </div>
        )}
      </div>

      {/* Generate Form Modal */}
      <Modal
        isOpen={showGenerateForm}
        onClose={() => setShowGenerateForm(false)}
        title="Generate Study Plan"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowGenerateForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate}>
              <Sparkles size={18} />
              Generate Timetable
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <Input
            label="Available hours per day"
            type="number"
            value={formData.hoursPerDay}
            onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
            placeholder="4"
          />

          <div>
            <label className="block mb-3 font-medium text-[var(--color-text-primary)]">
              Preferred study blocks
            </label>
            <div className="flex flex-wrap gap-2">
              {timeBlocks.map(block => (
                <Badge
                  key={block}
                  variant={formData.studyBlocks.includes(block) ? 'info' : 'default'}
                  className="cursor-pointer"
                  onClick={() => setFormData({
                    ...formData,
                    studyBlocks: toggleArrayItem(formData.studyBlocks, block)
                  })}
                >
                  {block}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            label="Exam date (optional)"
            type="date"
            value={formData.examDate}
            onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
          />

          <div>
            <label className="block mb-3 font-medium text-[var(--color-text-primary)]">
              Priority subjects
            </label>
            <div className="flex flex-wrap gap-2">
              {subjects.map(subject => (
                <Badge
                  key={subject}
                  variant={formData.prioritySubjects.includes(subject) ? 'info' : 'default'}
                  className="cursor-pointer"
                  onClick={() => setFormData({
                    ...formData,
                    prioritySubjects: toggleArrayItem(formData.prioritySubjects, subject)
                  })}
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Study Session"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowEditModal(false)}>
              Save Changes
            </Button>
          </>
        }
      >
        {selectedSession && (
          <div className="space-y-4">
            <Input
              label="Title"
              value={selectedSession.title}
              onChange={() => {}}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={selectedSession.duration.toString()}
              onChange={() => {}}
            />
            <Input
              label="Start time"
              type="time"
              value={selectedSession.startTime}
              onChange={() => {}}
            />
            <div>
              <label className="block mb-2 font-medium text-[var(--color-text-primary)]">
                Session type
              </label>
              <div className="flex flex-wrap gap-2">
                {['Deep focus', 'Review', 'Practice', 'Quick recap'].map(type => (
                  <Badge
                    key={type}
                    variant={selectedSession.type === type ? 'info' : 'default'}
                    className="cursor-pointer"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
