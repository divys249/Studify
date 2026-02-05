import React, { useState, useEffect } from 'react';
import { UploadZone } from '../../components/data-display/ResourceCard';
import { AnalysisModal } from './components/AnalysisModal';
import { Card } from '../../components/data-display/Card';
import { FileText, CheckCircle2 } from 'lucide-react';
import { useToast, Toast } from '../../components/feedback/Toast';
import { getAllSubjects } from '../../services/subjectService';
import { uploadFile, UploadProgress } from '../../services/fileUploadService';
import { Subject } from '../../types';
import { Button } from '../../components/form-controls/Button';

export function AnalyzeView() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analyzingFile, setAnalyzingFile] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const loadedSubjects = getAllSubjects();
    setSubjects(loadedSubjects);
    if (loadedSubjects.length > 0) {
      setSelectedSubjectId(loadedSubjects[0].id);
    }
  }, []);

  const handleUpload = async (files: FileList) => {
    if (!selectedSubjectId) {
      showToast('Please select a subject first', 'error');
      return;
    }

    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload files to storage
    for (const file of newFiles) {
      try {
        await uploadFile(file, selectedSubjectId, (progress) => {
          setUploadProgress(prev => new Map(prev.set(progress.fileId, progress)));
        });
        showToast(`${file.name} uploaded successfully`, 'success');
      } catch (error: any) {
        showToast(error.message || 'Upload failed', 'error');
      }
    }
    
    // Auto-analyze first file
    if (newFiles.length > 0) {
      setTimeout(() => {
        setAnalyzingFile(newFiles[0].name);
      }, 1000);
    }
  };

  const handleAnalysisComplete = (result: any) => {
    showToast('Analysis complete! Material added to your library.', 'success');
    setAnalyzingFile(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
          Upload & Analyze
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Upload your study materials to get AI-powered insights and time estimates
        </p>
      </div>

      {/* Subject Selection */}
      {subjects.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
          <Card variant="compact">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">
                Select Subject:
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedSubjectId === subject.id
                        ? 'text-white shadow-lg'
                        : 'bg-white/5 text-[var(--color-text-muted)] hover:bg-white/10'
                    }`}
                    style={{
                      backgroundColor: selectedSubjectId === subject.id ? subject.color : undefined,
                    }}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {subjects.length === 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
          <Card variant="compact">
            <div className="text-center py-6">
              <p className="text-[var(--color-text-muted)] mb-4">
                No subjects found. Create subjects first in the Library.
              </p>
              <Button onClick={() => window.location.hash = '#library'}>
                Go to Library
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Upload Zone */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
        <UploadZone onUpload={handleUpload} />
      </div>

      {/* How It Works */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="compact">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-violet)]/20 flex items-center justify-center text-[var(--color-primary-violet)] font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                  Upload Files
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Drag & drop or select your study materials
                </p>
              </div>
            </div>
          </Card>

          <Card variant="compact">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-violet)]/20 flex items-center justify-center text-[var(--color-primary-violet)] font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                  AI Analysis
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Get content density, difficulty, and time estimates
                </p>
              </div>
            </div>
          </Card>

          <Card variant="compact">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-violet)]/20 flex items-center justify-center text-[var(--color-primary-violet)] font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                  Add to Plan
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Integrate into your personalized study schedule
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
            Recently Uploaded
          </h2>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <Card key={index} variant="compact">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-violet)]/20 flex items-center justify-center">
                      <FileText size={20} className="text-[var(--color-primary-violet)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">{file.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--color-success)]">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-medium">Uploaded</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={analyzingFile !== null}
        onClose={() => setAnalyzingFile(null)}
        fileName={analyzingFile || ''}
        onComplete={handleAnalysisComplete}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
