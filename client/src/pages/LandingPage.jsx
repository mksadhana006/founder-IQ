/**
 * pages/LandingPage.jsx
 * Public-facing landing page for Founder-IQ.
 */

import { useNavigate, Link } from "react-router-dom";
import {
  Zap, Brain, TrendingUp, Users, Shield, ChevronRight,
  Star, CheckCircle2, ArrowRight, Cpu, Flame, BarChart3, Lightbulb,
} from "lucide-react";
import { ROUTES } from "../utils/constants";

const FEATURES = [
  { icon: Brain, title: "Gemini AI Analysis", description: "Google Gemini AI dissects your idea and returns a detailed executive summary, strengths, weaknesses, and actionable suggestions.", color: "#6366f1" },
  { icon: Users, title: "Competitor Discovery", description: "Tavily web search automatically finds real competing companies and maps the competitive landscape for your idea.", color: "#8b5cf6" },
  { icon: BarChart3, title: "Multi-Dimensional Scoring", description: "Four independent scores combined into an overall validation score — Problem Solvability, Market Urgency, Competitor Differentiation, and MVP Readiness.", color: "#10b981" },
  { icon: Lightbulb, title: "Investor Pitch Generation", description: "AI crafts a compelling investor pitch tailored specifically to your startup idea and target market.", color: "#f59e0b" },
  { icon: TrendingUp, title: "Performance Dashboard", description: "Track all your validated ideas in one place with charts, score trends, and a full validation history.", color: "#06b6d4" },
  { icon: Shield, title: "Secure & Private", description: "JWT-authenticated, per-user data isolation. Your startup ideas are always private and secure.", color: "#ef4444" },
];

const STEPS = [
  { number: "01", title: "Submit Your Idea", description: "Describe your startup — problem statement, target users, key features, and industry.", icon: Lightbulb },
  { number: "02", title: "AI + Web Analysis", description: "Gemini AI analyzes your concept while Tavily searches for real competitors simultaneously.", icon: Brain },
  { number: "03", title: "Get Your Report", description: "Receive a full validation report with scores, AI insights, competitor data, and an investor pitch.", icon: BarChart3 },
  { number: "04", title: "Refine & Iterate", description: "Act on the suggestions, improve your idea, and re-run validation to track score improvements.", icon: TrendingUp },
];

const SCORE_PREVIEW = [
  { label: "Problem Solvability", score: 82, color: "#6366f1", icon: Shield },
  { label: "Market Urgency", score: 74, color: "#f59e0b", icon: Flame },
  { label: "Competitor Differentiation", score: 68, color: "#8b5cf6", icon: Users },
  { label: "MVP Readiness", score: 79, color: "#10b981", icon: Cpu },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-900 overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-6 border-b border-white/5 bg-surface-900/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Founder-IQ</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to={ROUTES.LOGIN} className="text-sm text-slate-400 hover:text-white transition-all px-4 py-2">Sign In</Link>
          <Link to={ROUTES.REGISTER} className="btn-primary !px-5 !py-2 !text-sm">Get Started Free</Link>
        </div>
      </nav>

      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary-600/8 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-accent-500/6 blur-[80px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-[80px]" />
        </div>
        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/25 text-primary-400 text-sm font-medium mb-8">
            <Star className="w-3.5 h-3.5" />
            AI-Powered Startup Validation Platform
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
            Validate Your <span className="gradient-text">Startup Idea</span><br />in Seconds
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Founder-IQ uses <strong className="text-white">Google Gemini AI</strong> and real web data to score your startup across problem solvability, market urgency, competitor differentiation, and MVP readiness.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate(ROUTES.REGISTER)} className="btn-primary text-base px-8 py-4">
              <Zap className="w-5 h-5" />Start Validating Free<ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate(ROUTES.LOGIN)} className="btn-secondary text-base px-8 py-4">
              Sign In to Dashboard
            </button>
          </div>
          <p className="text-sm text-slate-600 mt-5">No credit card required · Free to use</p>
        </div>

        <div className="relative max-w-2xl mx-auto mt-16 animate-slide-up">
          <div className="glass-card p-6 shadow-card text-left">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Validation Report</p>
                <p className="font-display font-semibold text-white">AI Health Coach App</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-primary-400">76</div>
                <div className="text-xs text-slate-500">Overall Score</div>
              </div>
            </div>
            <div className="space-y-3">
              {SCORE_PREVIEW.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                        <span className="text-xs text-slate-400">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: item.color }}>{item.score}/100</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute -top-3 -right-6 glass-card px-3 py-1.5 text-xs font-semibold text-accent-400 shadow-card animate-bounce-gentle hidden sm:flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />AI Analysis Complete
          </div>
          <div className="absolute -bottom-3 -left-6 glass-card px-3 py-1.5 text-xs font-semibold text-primary-400 shadow-card animate-bounce-gentle hidden sm:flex items-center gap-1" style={{ animationDelay: "0.5s" }}>
            <Users className="w-3.5 h-3.5" />5 competitors found
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Everything You Need to <span className="gradient-text">Validate Faster</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              The full toolkit for founders — from AI analysis to competitor mapping to investor pitch generation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card-hover p-6 group">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}25` }}>
                    <Icon className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2 text-lg">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">How It <span className="gradient-text">Works</span></h2>
            <p className="text-slate-400 text-lg">From idea to full validation report in under 30 seconds.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative text-center group">
                  {idx < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-3rem)] h-px bg-gradient-to-r from-primary-500/30 to-transparent" />
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-primary-600/15 border border-primary-500/25 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600/25 transition-all duration-300">
                    <Icon className="w-7 h-7 text-primary-400" />
                  </div>
                  <div className="text-xs font-bold text-primary-500 mb-2 font-display tracking-widest">STEP {step.number}</div>
                  <h3 className="font-display font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-accent-500/5 pointer-events-none" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary-400" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                Ready to Validate Your <span className="gradient-text">Next Big Idea?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join founders using Founder-IQ to stress-test their startup ideas before writing a single line of code.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate(ROUTES.REGISTER)} className="btn-primary text-base px-8 py-4">
                  <Zap className="w-5 h-5" />Create Free Account<ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate(ROUTES.LOGIN)} className="btn-secondary text-base px-8 py-4">
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-semibold gradient-text">Founder-IQ</span>
        </div>
        <p className="text-slate-600 text-sm">AI-powered startup validation · Built with Google Gemini AI & Tavily Search</p>
      </footer>
    </div>
  );
};

export default LandingPage;
