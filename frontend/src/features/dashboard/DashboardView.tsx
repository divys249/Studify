import React from 'react';
import { Clock, BookOpen, TrendingUp, Bell } from 'lucide-react';
import { StatsCard, Card } from '../../components/data-display/Card';
import { StudySessionCard, StudySession } from '../planner/components/StudySession';
import { Badge } from '../../components/data-display/Badge';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const upcomingSessions: StudySession[] = [
    {
      id: '1',
      subject: 'Data Structures',
      title: 'Binary Trees & Graphs',
      duration: 90,
      startTime: '14:00',
      color: '#9B7CFF',
      type: 'Deep focus'
    },
    {
      id: '2',
      subject: 'Algorithms',
      title: 'Dynamic Programming',
      duration: 60,
      startTime: '16:00',
      color: '#5AC8FA',
      type: 'Review'
    },
    {
      id: '3',
      subject: 'Database Systems',
      title: 'SQL Queries Practice',
      duration: 45,
      startTime: '18:00',
      color: '#FFB86B',
      type: 'Practice'
    }
  ];

  const recentAnalyses = [
    {
      id: '1',
      subject: 'Computer Networks',
      title: 'OSI Model & TCP/IP',
      estimatedHours: 4.5,
      difficulty: 'medium' as const,
      date: 'Today'
    },
    {
      id: '2',
      subject: 'Operating Systems',
      title: 'Process Scheduling',
      estimatedHours: 3,
      difficulty: 'hard' as const,
      date: 'Yesterday'
    }
  ];

  const notifications = [
    {
      id: '1',
      message: 'Exam in 5 days: Data Structures',
      type: 'warning' as const
    },
    {
      id: '2',
      message: 'Study session starting in 2 hours',
      type: 'info' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Here's your study overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
        <StatsCard
          title="Today's Workload"
          value="6.5h"
          subtitle="3 sessions scheduled"
          icon={<Clock size={20} />}
          trend={{ value: 12, label: 'vs yesterday' }}
        />
        <StatsCard
          title="This Week's Hours"
          value="24h"
          subtitle="68% of weekly goal"
          icon={<TrendingUp size={20} />}
          trend={{ value: 8, label: 'vs last week' }}
        />
        <StatsCard
          title="Materials Analyzed"
          value="12"
          subtitle="2 pending analysis"
          icon={<BookOpen size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <div className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Today's Sessions
              </h2>
              <button 
                onClick={() => onNavigate('planner')}
                className="text-sm font-medium text-[var(--color-primary-violet)] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {upcomingSessions.map(session => (
                <StudySessionCard
                  key={session.id}
                  session={session}
                  onClick={() => onNavigate('planner')}
                />
              ))}
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Recent Analyses
              </h2>
              <button 
                onClick={() => onNavigate('library')}
                className="text-sm font-medium text-[var(--color-primary-violet)] hover:underline"
              >
                View Library
              </button>
            </div>
            <div className="space-y-3">
              {recentAnalyses.map(analysis => (
                <Card key={analysis.id} variant="compact" hoverable onClick={() => onNavigate('library')}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge size="sm">{analysis.subject}</Badge>
                        <Badge variant={
                          analysis.difficulty === 'easy' ? 'success' : 
                          analysis.difficulty === 'medium' ? 'warning' : 'error'
                        } size="sm">
                          {analysis.difficulty}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-[var(--color-text-primary)] mb-1">
                        {analysis.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Estimated: {analysis.estimatedHours}h • {analysis.date}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </h2>
            <Card variant="default">
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`
                      p-3 rounded-lg border
                      ${notification.type === 'warning' 
                        ? 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/30' 
                        : 'bg-[var(--color-accent-blue)]/10 border-[var(--color-accent-blue)]/30'
                      }
                    `}
                  >
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Quick Actions
            </h2>
            <Card variant="default">
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate('analyze')}
                  className="w-full p-3 text-left rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <p className="font-medium text-[var(--color-text-primary)]">Upload & Analyze</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Add new materials</p>
                </button>
                <button 
                  onClick={() => onNavigate('planner')}
                  className="w-full p-3 text-left rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <p className="font-medium text-[var(--color-text-primary)]">Generate Plan</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Create study schedule</p>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
