/**
 * pages/Dashboard.jsx
 * Authenticated user dashboard.
 */

import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Lightbulb, FileCheck2, Percent, Trophy, ArrowRight, Activity } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import Card, { CardBody, CardHeader, CardTitle } from '../components/common/Card';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { ROUTES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { dashboardData, isLoading, error, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !dashboardData) {
    return <Loader fullScreen text="Loading dashboard statistics..." />;
  }

  const { stats, recentStartups = [], recentReports = [] } = dashboardData || {};

  // Formats data for Recharts Bar Chart
  const chartData = recentReports
    .map((r) => ({
      name: r.startupId?.title?.length > 15 ? `${r.startupId.title.substring(0, 15)}...` : r.startupId?.title || 'Idea',
      score: r.scores?.overallScore || 0,
    }))
    .reverse(); // chronological order for display

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Founder Dashboard</h1>
          <p className="text-slate-400 mt-1">Submit, analyze, and refine your startup concepts in real-time.</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.SUBMIT)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          New Startup Idea
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-danger-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="relative overflow-hidden">
          <div className="absolute right-4 top-4 text-primary-500/25">
            <Lightbulb className="w-10 h-10" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Submitted</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalStartups || 0}</p>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute right-4 top-4 text-accent-500/25">
            <FileCheck2 className="w-10 h-10" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Validated Ideas</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalValidations || 0}</p>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute right-4 top-4 text-warning-500/25">
            <Percent className="w-10 h-10" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Validation Score</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.avgScore || 0}%</p>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute right-4 top-4 text-teal-500/25">
            <Trophy className="w-10 h-10" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Performing</p>
          <p className="text-xl font-bold text-white mt-2 truncate max-w-[80%]">{stats?.bestStartup || 'None'}</p>
          {stats?.bestScore > 0 && (
            <span className="text-xs text-accent-400 font-medium">Score: {stats.bestScore}%</span>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ideas List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-400" />
              Recent Startup Ideas
            </CardTitle>
            <Link to={ROUTES.HISTORY} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-all">
              View all history
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardBody className="divide-y divide-white/5 space-y-4">
            {recentStartups.length === 0 ? (
              <div className="text-center py-10">
                <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No startup ideas submitted yet.</p>
                <button
                  onClick={() => navigate(ROUTES.SUBMIT)}
                  className="btn-secondary btn-sm mt-3"
                >
                  Submit Your First Idea
                </button>
              </div>
            ) : (
              recentStartups.map((startup, idx) => (
                <div key={startup._id} className={`flex items-center justify-between py-3 ${idx > 0 ? 'pt-4' : ''}`}>
                  <div className="space-y-1 pr-4 truncate">
                    <p className="font-semibold text-white truncate">{startup.title}</p>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500">
                      <span>{startup.industry || 'General'}</span>
                      <span>•</span>
                      <span>{formatDate(startup.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {startup.status === 'validated' ? (
                      <Link
                        to={ROUTES.VALIDATION.replace(':startupId', startup._id)}
                        className="btn-secondary sm:px-4 py-2 !text-xs"
                      >
                        View Report
                      </Link>
                    ) : (
                      <Link
                        to={ROUTES.VALIDATION.replace(':startupId', startup._id)}
                        className="btn-primary sm:px-4 py-2 !text-xs !shadow-none"
                      >
                        Validate Now
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Charts & Visual Performance Overview */}
        <Card className="flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4 mb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardBody className="flex-1 min-h-[240px] flex items-center justify-center">
            {chartData.length === 0 ? (
              <p className="text-slate-500 text-sm text-center">Complete validation reports to view performance analytics.</p>
            ) : (
              <div className="w-full h-full min-h-[220px]">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
