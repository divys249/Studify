import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/layout/Modal';
import { CircularProgress } from '../../../components/feedback/ProgressBar';
import { Button } from '../../../components/form-controls/Button';
import { Badge } from '../../../components/data-display/Badge';
import { Clock, BookOpen, TrendingUp, CheckCircle2 } from 'lucide-react';

interface AnalysisResult {
  totalPages: number;
  contentDensity: number;
  estimatedHours: number;
  difficulty: 'easy' | 'medium' | 'hard';
  recommendedSessions: { duration: number; type: string }[];
  suggestedTopics: string[];
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  onComplete: (result: AnalysisResult) => void;
}

export function AnalysisModal({ isOpen, onClose, fileName, onComplete }: AnalysisModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Uploading file...');
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep('Uploading file...');
      setIsComplete(false);
      setResult(null);
      return;
    }

    const steps = [
      { label: 'Uploading file...', duration: 500 },
      { label: 'Scanning slides...', duration: 1000 },
      { label: 'Extracting headings...', duration: 800 },
      { label: 'Analyzing content density...', duration: 1200 },
      { label: 'Calculating complexity...', duration: 900 },
      { label: 'Generating estimate...', duration: 600 }
    ];

    let currentProgress = 0;
    let stepIndex = 0;

    const runAnalysis = async () => {
      for (const step of steps) {
        setCurrentStep(step.label);
        const increment = 100 / steps.length;
        
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        currentProgress += increment;
        setProgress(Math.min(currentProgress, 100));
        stepIndex++;
      }

      // Generate mock result
      const mockResult: AnalysisResult = {
        totalPages: Math.floor(Math.random() * 50) + 20,
        contentDensity: Math.floor(Math.random() * 40) + 60,
        estimatedHours: Math.floor(Math.random() * 5) + 3,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
        recommendedSessions: [
          { duration: 90, type: 'Deep focus' },
          { duration: 60, type: 'Review' },
          { duration: 90, type: 'Deep focus' },
          { duration: 30, type: 'Quick recap' }
        ],
        suggestedTopics: [
          'Introduction to concepts',
          'Core principles',
          'Advanced applications',
          'Practice problems'
        ]
      };

      setResult(mockResult);
      setIsComplete(true);
    };

    runAnalysis();
  }, [isOpen]);

  const handleAddToPlan = () => {
    if (result) {
      onComplete(result);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isComplete ? 'Analysis Complete' : 'Analyzing Material'}
      size="lg"
      footer={
        isComplete && result ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleAddToPlan}>
              Add to Study Plan
            </Button>
          </>
        ) : null
      }
    >
      {!isComplete ? (
        <div className="py-8">
          <div className="flex flex-col items-center">
            <CircularProgress value={progress} size={140} />
            <p className="mt-6 text-lg font-medium text-[var(--color-text-primary)]">
              {currentStep}
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Analyzing: {fileName}
            </p>
          </div>
        </div>
      ) : result ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--color-success)]/10 border border-[var(--color-success)]/30">
            <CheckCircle2 className="text-[var(--color-success)]" size={24} />
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">Analysis Successful</p>
              <p className="text-sm text-[var(--color-text-muted)]">{fileName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-text-muted)]">
                <BookOpen size={18} />
                <span className="text-sm">Total Pages</span>
              </div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{result.totalPages}</p>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-text-muted)]">
                <TrendingUp size={18} />
                <span className="text-sm">Content Density</span>
              </div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{result.contentDensity}/100</p>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-text-muted)]">
                <Clock size={18} />
                <span className="text-sm">Estimated Time</span>
              </div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{result.estimatedHours}h</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)] mb-3">
              Recommended Study Sessions
            </h4>
            <div className="space-y-2">
              {result.recommendedSessions.map((session, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/10"
                >
                  <span className="text-[var(--color-text-primary)]">Session {index + 1}</span>
                  <div className="flex items-center gap-3">
                    <Badge size="sm">{session.type}</Badge>
                    <span className="text-sm font-medium text-[var(--color-text-muted)]">
                      {session.duration} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)] mb-3">
              Suggested Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.suggestedTopics.map((topic, index) => (
                <Badge key={index}>{topic}</Badge>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
