/**
 * pages/ReportHistory.jsx
 * Full validation history page — lists all past reports with scores & status.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Plus, ExternalLink, AlertCircle, Clock } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import Card, { CardHeader, CardTitle, CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { ROUTES, SCORE_LABELS_MAP } from '../utils/constants';
import { formatRelativeTime, getScoreInfo } from '../utils/formatters';

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    completed: { label: 'Completed', variant: 'accent' },
    in_progress: { label: 'In Progress', variant: 'warning' },
    failed: { label: 'Failed', variant: 'danger' },
    pending: { label: 'Pending', variant: 'default' },
  };
  const info = map[status] || { label: status, variant: 'default' };
  return <Badge variant={info.variant}>{info.label}</Badge>;
};

// ─── Individual Report Card ───────────────────────────────────────────────────
const ReportCard = ({ report, onView }) => {
  const { scores = {}, status, startupId, createdAt } = report;
  const overallInfo = getScoreInfo(scores.overallScore || 0);
  const isCompleted = status === 'completed';

  return (
    <Card hover className="transition-all duration-300" padding="md">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Title and metadata */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="font-semibold text-white truncate text-lg">
            {startupId?.title || 'Untitled Idea'}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {startupId?.industry && (
              <span className="bg-white/5 px-2 py-0.5 rounded-full">
                {startupId.industry}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(createdAt)}
            </span>
          </div>

          {/* Score grid - only show if completed */}
          {isCompleted && (
            <div className="flex flex-wrap gap-3 mt-3">
              {Object.entries(SCORE_LABELS_MAP)
                .filter(([key]) => key !== 'overallScore')
                .map(([key, label]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-slate-500">{label.split(' ')[0]}</p>
                    <p className="text-sm font-bold" style={{ color: getScoreInfo(scores[key] || 0).color }}>
                      {scores[key] || 0}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right: Score circle + actions */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          {/* Overall Score Circle */}
          {isCompleted ? (
            <div
              className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center border"
              style={{
                backgroundColor: `${overallInfo.color}15`,
                borderColor: `${overallInfo.color}30`,
              }}
            >
              <span className="text-xl font-display font-bold" style={{ color: overallInfo.color }}>
                {scores.overallScore || 0}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <AlertCircle className="w-6 h-6 text-slate-500" />
            </div>
          )}

          <StatusBadge status={status} />

          <Button
            variant={isCompleted ? 'ghost' : 'primary'}
            size="sm"
            onClick={() => onView(startupId?._id)}
            className="text-xs"
          >
            {isCompleted ? (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                View Report
              </>
            ) : status === 'failed' ? (
              'Retry'
            ) : (
              'Run Now'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ReportHistory = () => {
  const navigate = useNavigate();
  const { history, isLoading, error, fetchHistory } = useDashboard();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleViewReport = (startupId) => {
    if (startupId) {
      navigate(ROUTES.VALIDATION.replace(':startupId', startupId));
    }
  };

  if (isLoading && history.length === 0) {
    return <Loader fullScreen text="Loading validation history..." />;
  }

  const completedCount = history.filter((r) => r.status === 'completed').length;
  const avgScore = completedCount > 0
    ? Math.round(history.filter((r) => r.status === 'completed').reduce((sum, r) => sum + (r.scores?.overallScore || 0), 0) / completedCount)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <History className="w-8 h-8 text-primary-400" />
            Validation History
          </h1>
          <p className="text-slate-400 mt-1">
            All past and ongoing validation reports for your startup ideas.
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.SUBMIT)}>
          <Plus className="w-4 h-4" />
          New Submission
        </Button>
      </div>

      {/* Quick Stats Bar */}
      {history.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <Card padding="sm" className="flex items-center gap-3">
            <p className="text-slate-400 text-sm">Total Reports</p>
            <p className="text-xl font-bold text-white">{history.length}</p>
          </Card>
          <Card padding="sm" className="flex items-center gap-3">
            <p className="text-slate-400 text-sm">Completed</p>
            <p className="text-xl font-bold text-accent-400">{completedCount}</p>
          </Card>
          {completedCount > 0 && (
            <Card padding="sm" className="flex items-center gap-3">
              <p className="text-slate-400 text-sm">Avg Score</p>
              <p className="text-xl font-bold text-white">{avgScore}%</p>
            </Card>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-danger-400 text-sm animate-fade-in">
          {error}
        </div>
      )}

      {/* Report List */}
      {history.length === 0 ? (
        <Card padding="lg" className="text-center py-20">
          <History className="w-14 h-14 text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white">No History Yet</h2>
          <p className="text-slate-400 text-sm mt-2 mb-6">
            Submit a startup idea and run your first validation to see reports here.
          </p>
          <Button onClick={() => navigate(ROUTES.SUBMIT)}>
            <Plus className="w-4 h-4" />
            Submit Your First Idea
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onView={handleViewReport}
            />
          ))}
        </div>
      )}

      {/* TODO: V2 — Add pagination, date/score filters, CSV export */}
    </div>
  );
};

export default ReportHistory;
