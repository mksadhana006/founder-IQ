/**
 * pages/ValidationResults.jsx
 * Full validation report page for a startup idea.
 * Displays AI analysis, all scores, competitor table, and actionable insights.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Lightbulb,
  MessageSquareQuote,
  Shield,
  Users,
  Flame,
  Cpu,
  Star,
  Target,
  TrendingUp,
  DollarSign,
  Rocket,
  AlertTriangle,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useValidation } from '../hooks/useValidation';
import Card, { CardHeader, CardTitle, CardBody } from '../components/common/Card';
import ScoreBar from '../components/common/ScoreBar';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { ROUTES, SCORE_LABELS_MAP, SCORE_COLORS } from '../utils/constants';
import { getScoreInfo, formatDate } from '../utils/formatters';

// ─── Helper: Score Label Badge ────────────────────────────────────────────────
const ScoreLabel = ({ score }) => {
  const info = getScoreInfo(score);
  const variantMap = {
    Excellent: 'excellent',
    Good: 'good',
    Average: 'average',
    'Needs Work': 'poor',
  };
  return <Badge variant={variantMap[info.label] || 'default'}>{info.label}</Badge>;
};

// ─── Score Cards Metadata ─────────────────────────────────────────────────────
const SCORE_CARDS = [
  { key: 'problemScore', label: 'Problem Solvability', Icon: Shield },
  { key: 'competitorScore', label: 'Competitor Differentiation', Icon: Users },
  { key: 'urgencyScore', label: 'Market Urgency', Icon: Flame },
  { key: 'mvpScore', label: 'MVP Readiness', Icon: Cpu },
];

// ─── Page Component ───────────────────────────────────────────────────────────
const ValidationResults = () => {
  const { startupId } = useParams();
  const navigate = useNavigate();
  const { report, isLoading, error, fetchReport, runValidation } = useValidation();
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchReport(startupId);
      setHasFetched(true);
    };
    load();
  }, [fetchReport, startupId]);

  // ─── Auto-trigger validation if no report found ───────────────────────────
  useEffect(() => {
    if (hasFetched && !report && !isRunning) {
      handleRunValidation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFetched, report]);

  // ─── Trigger fresh validation ─────────────────────────────────────────────
  const handleRunValidation = async () => {
    setIsRunning(true);
    setRunError(null);
    try {
      await runValidation(startupId);
    } catch (err) {
      setRunError(err.message || 'Validation failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  // ─── Loading / Error states ───────────────────────────────────────────────
  if (isLoading && !report && !isRunning) {
    return <Loader fullScreen text="Fetching validation report..." />;
  }

  // ─── No report — show CTA to run first validation ─────────────────────────
  if (!report && !isLoading && !isRunning) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-primary-600/20 flex items-center justify-center mx-auto">
          <Zap className="w-10 h-10 text-primary-400" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white">No Report Found</h1>
        <p className="text-slate-400">
          This startup idea hasn't been validated yet. Run the AI-powered analysis now.
        </p>
        {(error || runError) && (
          <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-danger-400 text-sm">
            {error || runError}
          </div>
        )}
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleRunValidation} isLoading={isRunning}>
            <Zap className="w-4 h-4" />
            Run Validation
          </Button>
        </div>
      </div>
    );
  }

  const { scores = {}, aiAnalysis = {}, competitors = [], status, createdAt } = report || {};

  // ─── In-progress state ────────────────────────────────────────────────────
  if (status === 'in_progress' || isRunning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
        <Loader size="xl" />
        <h2 className="text-xl font-display font-semibold text-white">AI Analysis in Progress</h2>
        <p className="text-slate-400 text-sm max-w-sm text-center">
          We're analyzing your idea with Gemini AI, searching for competitors, and computing validation scores. This takes about 10–20 seconds.
        </p>
      </div>
    );
  }

  // ─── Failed state ─────────────────────────────────────────────────────────
  if (status === 'failed') {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-5 animate-fade-in">
        <XCircle className="w-16 h-16 text-danger-400 mx-auto" />
        <h1 className="text-2xl font-display font-bold text-white">Validation Failed</h1>
        <p className="text-slate-400">{report?.errorMessage || 'An unexpected error occurred.'}</p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>Back</Button>
          <Button onClick={handleRunValidation} isLoading={isRunning}>
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // ─── Radar chart data ─────────────────────────────────────────────────────
  const radarData = [
    { subject: 'Problem', value: scores.problemScore || 0 },
    { subject: 'Competitor', value: scores.competitorScore || 0 },
    { subject: 'Urgency', value: scores.urgencyScore || 0 },
    { subject: 'MVP', value: scores.mvpScore || 0 },
  ];

  const overallInfo = getScoreInfo(scores.overallScore || 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(ROUTES.HISTORY)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Validation History
          </button>
          <h1 className="text-3xl font-display font-bold text-white">Validation Report</h1>
          {createdAt && (
            <p className="text-slate-400 text-sm mt-1">Generated on {formatDate(createdAt)}</p>
          )}
        </div>
        <Button variant="secondary" onClick={handleRunValidation} isLoading={isRunning}>
          <RefreshCw className="w-4 h-4" />
          Re-run Analysis
        </Button>
      </div>

      {runError && (
        <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/25 text-danger-400 text-sm animate-fade-in">
          {runError}
        </div>
      )}

      {/* Overall Score Hero */}
      <Card className="text-center py-8" glow>
        <div
          className="text-7xl font-display font-bold mb-2"
          style={{ color: overallInfo.color }}
        >
          {scores.overallScore || 0}
        </div>
        <p className="text-slate-300 font-medium text-lg mb-3">Overall Validation Score</p>
        <ScoreLabel score={scores.overallScore || 0} />
        <p className="text-slate-500 text-sm mt-4 max-w-md mx-auto">
          This composite score reflects problem clarity, market urgency, competitor landscape, and MVP feasibility.
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Breakdown Bars */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <CardBody className="space-y-5">
            {SCORE_CARDS.map(({ key, label, Icon }, i) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <ScoreBar
                    label={label}
                    score={scores[key] || 0}
                    color={SCORE_COLORS[key]}
                    delay={i * 150}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Radar Chart */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Score Radar</CardTitle>
          </CardHeader>
          <CardBody className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 12 }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#f8fafc',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning-400" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-slate-300 leading-relaxed">
              {aiAnalysis.summary || 'No summary available.'}
            </p>
          </CardBody>
        </Card>

        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent-400" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardBody>
            {(aiAnalysis.strengths || []).length === 0 ? (
              <p className="text-slate-500 text-sm">No strengths identified.</p>
            ) : (
              <ul className="space-y-3">
                {aiAnalysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-danger-400" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardBody>
            {(aiAnalysis.weaknesses || []).length === 0 ? (
              <p className="text-slate-500 text-sm">No weaknesses identified.</p>
            ) : (
              <ul className="space-y-3">
                {aiAnalysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <XCircle className="w-4 h-4 text-danger-400 mt-0.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning-400" />
              Actionable Suggestions
            </CardTitle>
          </CardHeader>
          <CardBody>
            {(aiAnalysis.suggestions || []).length === 0 ? (
              <p className="text-slate-500 text-sm">No suggestions available.</p>
            ) : (
              <ul className="space-y-3">
                {aiAnalysis.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <Lightbulb className="w-4 h-4 text-warning-400 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Investor Pitch */}
        <Card className="bg-gradient-to-br from-primary-600/10 to-accent-500/5 border-primary-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-primary-400" />
              Investor Pitch
            </CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-slate-200 leading-relaxed italic">
              &ldquo;{aiAnalysis.pitch || 'No pitch generated.'}&rdquo;
            </p>
          </CardBody>
        </Card>
      </div>

      {/* ─── SWOT Analysis 2x2 Grid ─────────────────────────────────────────── */}
      {aiAnalysis.swotAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-400" />
              SWOT Analysis
            </CardTitle>
            <p className="text-slate-400 text-sm mt-1">
              Strategic assessment of internal strengths/weaknesses and external opportunities/threats.
            </p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 rounded-xl bg-accent-500/5 border border-accent-500/15">
                <h4 className="text-sm font-semibold text-accent-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Strengths
                </h4>
                <ul className="space-y-2">
                  {(aiAnalysis.swotAnalysis.strengths || []).map((s, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-accent-400 mt-0.5">•</span> {s}
                    </li>
                  ))}
                  {(!aiAnalysis.swotAnalysis.strengths || aiAnalysis.swotAnalysis.strengths.length === 0) && (
                    <li className="text-sm text-slate-500">No data available</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 rounded-xl bg-danger-500/5 border border-danger-500/15">
                <h4 className="text-sm font-semibold text-danger-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Weaknesses
                </h4>
                <ul className="space-y-2">
                  {(aiAnalysis.swotAnalysis.weaknesses || []).map((w, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-danger-400 mt-0.5">•</span> {w}
                    </li>
                  ))}
                  {(!aiAnalysis.swotAnalysis.weaknesses || aiAnalysis.swotAnalysis.weaknesses.length === 0) && (
                    <li className="text-sm text-slate-500">No data available</li>
                  )}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/15">
                <h4 className="text-sm font-semibold text-primary-400 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Opportunities
                </h4>
                <ul className="space-y-2">
                  {(aiAnalysis.swotAnalysis.opportunities || []).map((o, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-primary-400 mt-0.5">•</span> {o}
                    </li>
                  ))}
                  {(!aiAnalysis.swotAnalysis.opportunities || aiAnalysis.swotAnalysis.opportunities.length === 0) && (
                    <li className="text-sm text-slate-500">No data available</li>
                  )}
                </ul>
              </div>

              {/* Threats */}
              <div className="p-4 rounded-xl bg-warning-500/5 border border-warning-500/15">
                <h4 className="text-sm font-semibold text-warning-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Threats
                </h4>
                <ul className="space-y-2">
                  {(aiAnalysis.swotAnalysis.threats || []).map((t, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-warning-400 mt-0.5">•</span> {t}
                    </li>
                  ))}
                  {(!aiAnalysis.swotAnalysis.threats || aiAnalysis.swotAnalysis.threats.length === 0) && (
                    <li className="text-sm text-slate-500">No data available</li>
                  )}
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ─── Market Opportunity, Risk, Revenue, Go-to-Market ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Opportunity */}
        {aiAnalysis.marketOpportunity && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-400" />
                Market Opportunity
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-slate-300 leading-relaxed">{aiAnalysis.marketOpportunity}</p>
            </CardBody>
          </Card>
        )}

        {/* Risk Analysis */}
        {(aiAnalysis.riskAnalysis || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger-400" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {aiAnalysis.riskAnalysis.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <AlertTriangle className="w-4 h-4 text-danger-400 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        {/* Revenue Models */}
        {(aiAnalysis.revenueModels || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent-400" />
                Revenue Model Suggestions
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {aiAnalysis.revenueModels.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <DollarSign className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        {/* Go-to-Market Strategy */}
        {(aiAnalysis.goToMarketStrategy || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary-400" />
                Go-to-Market Strategy
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ol className="space-y-3">
                {aiAnalysis.goToMarketStrategy.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        )}
      </div>

      {/* ─── Competitors Table ────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-400" />
            Discovered Competitors
            <Badge variant="primary" size="xs">{competitors.length}</Badge>
          </CardTitle>
          <p className="text-slate-400 text-sm mt-1">
            Companies found via web search that may be operating in a similar space.
          </p>
        </CardHeader>
        <CardBody>
          {competitors.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">No competitors found — this could mean an untapped market or a very niche idea.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-white/5">
                    <th className="pb-3 font-semibold">Company</th>
                    <th className="pb-3 font-semibold hidden sm:table-cell">Website</th>
                    <th className="pb-3 font-semibold hidden md:table-cell">Pricing</th>
                    <th className="pb-3 font-semibold hidden lg:table-cell">Target Audience</th>
                    <th className="pb-3 font-semibold hidden xl:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {competitors.map((c) => (
                    <tr key={c._id} className="hover:bg-white/3 transition-all">
                      <td className="py-3 pr-4 font-medium text-white">{c.name}</td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        {c.website ? (
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-all"
                          >
                            {c.website.replace(/https?:\/\/(www\.)?/, '')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-slate-400 hidden md:table-cell">
                        {c.pricing || '—'}
                      </td>
                      <td className="py-3 pr-4 text-slate-400 hidden lg:table-cell">
                        {c.targetAudience || '—'}
                      </td>
                      <td className="py-3 text-slate-400 hidden xl:table-cell max-w-xs truncate">
                        {c.description || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* TODO: V2 — Add PDF export button and investor readiness score */}
      <div className="text-center py-4 text-slate-600 text-xs">
        V2 Features: PDF Export · Investor Readiness Score · Financial Projections
      </div>
    </div>
  );
};

export default ValidationResults;
