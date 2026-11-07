import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Layers,
  RotateCcw,
  Play,
  Calendar,
  FileText,
  BarChart3,
  Zap,
  Activity,
  ArrowRight,
  ChevronDown,
  ShieldAlert,
  Lock,
  ExternalLink,
  CheckCircle2,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { NewCampaignModal } from '../recertification/NewCampaignModal';

export const CentrixDashboard: React.FC = () => {
  const {
    metrics,
    campaigns,
    violations,
    auditLogs,
    setActiveTab,
    setSelectedCampaignId,
    currentUser,
    employees
  } = useAccessGuard();

  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleRunRiskScan = () => {
    setIsScanning(true);
    setScanMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanMessage('Risk scan complete: Evaluated 1,000 identities across 25 connected applications.');
      setTimeout(() => setScanMessage(null), 4000);
    }, 1200);
  };

  // Sparkline curve path generator
  const goldenSparkline = "M0,28 C20,24 40,32 60,18 C80,8 100,26 120,14 C140,4 160,20 180,10 C200,6 220,18 240,8";
  const greenSparkline = "M0,26 C20,30 40,20 60,24 C80,12 100,16 120,6 C140,18 160,8 180,14 C200,8 220,12 240,4";
  const redSparkline = "M0,28 C20,22 40,28 60,16 C80,24 100,10 120,20 C140,8 160,18 180,6 C200,14 220,10 240,4";
  const blueSparkline = "M0,24 C20,18 40,26 60,14 C80,20 100,8 120,14 C140,22 160,10 180,16 C200,6 220,14 240,6";

  return (
    <div className="space-y-6 pb-12">
      {/* Risk scan toast notification */}
      {scanMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#0E1726] border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-[#070B14] via-[#0A101D] to-[#070B14] shadow-2xl">
        {/* Ambient background glow & cityscape overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#070B14_0%,transparent_30%,transparent_70%,#070B14_100%)] pointer-events-none z-1" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Welcome Copy */}
          <div className="max-w-xl space-y-3 text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-amber-400">{currentUser.name.split(' ')[0]}</span>.
            </h1>
            <div className="text-sm font-semibold text-slate-400 tracking-wider">
              Secure. Monitor. Control.
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Your organisation&apos;s access security is in safe hands with Centrix. Continuous real-time privilege auditing and identity governance.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('security-overview');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-102 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>View Security Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center: 3D Holographic Podium Shield Visual */}
          <div className="relative flex items-center justify-center w-64 h-56 shrink-0">
            {/* Glowing rings and pedestal */}
            <div className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-2xl animate-pulse" />
            <div className="absolute w-48 h-12 bottom-2 rounded-[100%] border border-amber-500/40 bg-gradient-to-t from-amber-500/20 to-transparent shadow-[0_0_25px_rgba(245,158,11,0.3)]" />
            <div className="absolute w-36 h-8 bottom-4 rounded-[100%] border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]" />

            {/* Glowing 3D Shield */}
            <div className="relative z-10 w-24 h-28 rounded-b-[40px] rounded-t-lg bg-gradient-to-b from-amber-400/30 via-slate-900/90 to-amber-500/40 p-[2px] shadow-[0_0_35px_rgba(245,158,11,0.4)] backdrop-blur-md flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-b-[38px] rounded-t-md bg-[#0C1220]/90 flex flex-col items-center justify-center gap-1 border border-amber-400/30">
                <Shield className="w-10 h-10 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-amber-300">CENTRIX</span>
              </div>
            </div>

            {/* Floating Glass Widgets */}
            <div className="absolute -top-1 -left-4 p-2 rounded-xl bg-[#0D1526]/80 border border-slate-700/80 shadow-lg backdrop-blur-md">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="absolute top-2 -right-4 p-2 rounded-xl bg-[#0D1526]/80 border border-slate-700/80 shadow-lg backdrop-blur-md">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="absolute -bottom-2 -left-2 p-2 rounded-xl bg-[#0D1526]/80 border border-slate-700/80 shadow-lg backdrop-blur-md">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Right: System Status Card */}
          <div className="w-full sm:w-64 bg-[#0B101D]/90 border border-slate-800 p-4 rounded-xl shadow-xl flex flex-col justify-between shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white text-xs">System Status</span>
            </div>

            {/* Green operational pill */}
            <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 py-1 px-3 rounded-full text-center text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            {/* Neon green sparkline */}
            <div className="py-2">
              <svg viewBox="0 0 240 40" className="w-full h-10 overflow-visible">
                <defs>
                  <linearGradient id="neonGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,28 C30,30 60,18 90,24 C120,12 150,22 180,8 C210,14 225,2 240,4"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
                <path
                  d="M0,28 C30,30 60,18 90,24 C120,12 150,22 180,8 C210,14 225,2 240,4 L240,40 L0,40 Z"
                  fill="url(#neonGreen)"
                />
              </svg>
            </div>

            <div className="text-[10px] text-slate-400 font-mono text-center">
              Last Check: 10 Nov 2026 · 14:30
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STAT CARDS ROW (5 metrics with sparkline curves)          */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Employees */}
        <div
          onClick={() => setActiveTab('employees')}
          className="bg-[#0B101D] border border-slate-800 hover:border-amber-500/50 p-4 rounded-xl shadow-lg relative overflow-hidden group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-white tabular-nums">
                1,000
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Total Employees</div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5">↑ +2%</div>
            </div>
          </div>
          {/* Golden Sparkline */}
          <div className="mt-2 h-7 w-full overflow-hidden">
            <svg viewBox="0 0 240 36" className="w-full h-full">
              <path
                d={goldenSparkline}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                className="drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
              />
            </svg>
          </div>
        </div>

        {/* 2. Active Users */}
        <div
          onClick={() => setActiveTab('employees')}
          className="bg-[#0B101D] border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl shadow-lg relative overflow-hidden group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-white tabular-nums">
                950
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Active Users</div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5">↑ +1%</div>
            </div>
          </div>
          {/* Green Sparkline */}
          <div className="mt-2 h-7 w-full overflow-hidden">
            <svg viewBox="0 0 240 36" className="w-full h-full">
              <path
                d={greenSparkline}
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                className="drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]"
              />
            </svg>
          </div>
        </div>

        {/* 3. High-Risk Identities */}
        <div
          onClick={() => setActiveTab('risks')}
          className="bg-[#0B101D] border border-slate-800 hover:border-rose-500/50 p-4 rounded-xl shadow-lg relative overflow-hidden group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/30 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-white tabular-nums">
                12
              </div>
              <div className="text-[11px] text-slate-400 font-medium">High-Risk Identities</div>
              <div className="text-[10px] font-mono text-rose-400 font-bold mt-0.5">↑ +3%</div>
            </div>
          </div>
          {/* Red Sparkline */}
          <div className="mt-2 h-7 w-full overflow-hidden">
            <svg viewBox="0 0 240 36" className="w-full h-full">
              <path
                d={redSparkline}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                className="drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
              />
            </svg>
          </div>
        </div>

        {/* 4. Connected Applications */}
        <div
          onClick={() => setActiveTab('systems')}
          className="bg-[#0B101D] border border-slate-800 hover:border-blue-500/50 p-4 rounded-xl shadow-lg relative overflow-hidden group transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black font-mono text-white tabular-nums">
                25
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Applications</div>
              <div className="text-[10px] font-mono text-slate-400 font-bold mt-0.5">↑ 0%</div>
            </div>
          </div>
          {/* Blue Sparkline */}
          <div className="mt-2 h-7 w-full overflow-hidden">
            <svg viewBox="0 0 240 36" className="w-full h-full">
              <path
                d={blueSparkline}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                className="drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]"
              />
            </svg>
          </div>
        </div>

        {/* 5. Recertification Completion */}
        <div
          onClick={() => setActiveTab('recertification')}
          className="bg-[#0B101D] border border-slate-800 hover:border-amber-500/50 p-4 rounded-xl shadow-lg relative overflow-hidden group transition-all cursor-pointer col-span-2 md:col-span-1"
        >
          <div className="flex items-center gap-3">
            {/* Donut progress ring icon */}
            <div className="w-10 h-10 rounded-full border-3 border-amber-500/30 border-t-amber-400 border-r-amber-400 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-mono font-bold text-amber-400">78%</span>
            </div>
            <div>
              <div className="text-xl font-black font-mono text-white tabular-nums">
                78%
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Recertification Completion</div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold mt-0.5">↑ +5%</div>
            </div>
          </div>
          {/* Golden Sparkline */}
          <div className="mt-2 h-7 w-full overflow-hidden">
            <svg viewBox="0 0 240 36" className="w-full h-full">
              <path
                d={goldenSparkline}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                className="drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CORE ANALYTICS GRID (4 CARDS)                             */}
      {/* ============================================================ */}
      <div id="security-overview" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* CARD 1: Access Health Overview */}
        <div className="bg-[#0B101D] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs">Access Health Overview</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                <span>{timeRange}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Circular Gauge and Legend */}
            <div className="flex items-center justify-between gap-4 py-2">
              {/* Radial Donut Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1E293B"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - 0.78)}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black font-mono text-white">78%</span>
                  <span className="text-[9px] text-slate-400 leading-tight">Overall<br/>Security Score</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                    Compliant
                  </span>
                  <span className="font-mono font-bold text-white">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
                    At Risk
                  </span>
                  <span className="font-mono font-bold text-white">14%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#EF4444]" />
                    Non-Compliant
                  </span>
                  <span className="font-mono font-bold text-white">8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Baseline Wave */}
          <div className="pt-2">
            <svg viewBox="0 0 200 24" className="w-full h-5">
              <path
                d="M0,18 Q50,4 100,16 T200,6"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.5"
                className="opacity-70 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]"
              />
            </svg>
          </div>
        </div>

        {/* CARD 2: Risk Intelligence */}
        <div className="bg-[#0B101D] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs">Risk Intelligence</h3>
              </div>
              <button
                onClick={() => setActiveTab('risks')}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
              >
                View Details <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Donut and Risk Breakdown */}
            <div className="flex items-center justify-between gap-4 py-2">
              {/* Multi-tier Donut ring */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10B981" strokeWidth="9" strokeDasharray="238.7" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="9" strokeDasharray="238.7" strokeDashoffset={238.7 * 0.25} />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F97316" strokeWidth="9" strokeDasharray="238.7" strokeDashoffset={238.7 * 0.55} />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#EF4444" strokeWidth="9" strokeDasharray="238.7" strokeDashoffset={238.7 * 0.85} className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black font-mono text-white">72</span>
                  <span className="text-[9px] text-slate-400">Total Risks</span>
                </div>
              </div>

              {/* Counts */}
              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#EF4444]" />
                    Critical
                  </span>
                  <span className="font-mono font-bold text-white">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_#F97316]" />
                    High
                  </span>
                  <span className="font-mono font-bold text-white">14</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
                    Medium
                  </span>
                  <span className="font-mono font-bold text-white">32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                    Low
                  </span>
                  <span className="font-mono font-bold text-white">20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Red Alert Banner */}
          <div
            onClick={() => setActiveTab('risks')}
            className="mt-2 bg-gradient-to-r from-rose-950/80 to-rose-900/60 border border-rose-500/40 p-2 rounded-lg flex items-center justify-center gap-2 text-rose-300 text-xs font-bold shadow-lg hover:border-rose-400 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>6 Critical Risks Require Action</span>
          </div>
        </div>

        {/* CARD 3: Upcoming Reviews */}
        <div className="bg-[#0B101D] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs">Upcoming Reviews</h3>
              </div>
              <button
                onClick={() => setActiveTab('recertification')}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* List of 3 reviews */}
            <div className="space-y-2.5">
              {/* Review 1 */}
              <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="px-2 py-1 rounded bg-slate-800 text-center font-mono text-[10px] leading-tight text-slate-300 border border-slate-700">
                    <span className="block text-[8px] text-slate-400">NOV</span>
                    <strong className="text-white text-xs">15</strong>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Q4 2026 Access Review</div>
                    <div className="text-[10px] text-slate-400">Finance Department</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  5 days
                </span>
              </div>

              {/* Review 2 */}
              <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="px-2 py-1 rounded bg-slate-800 text-center font-mono text-[10px] leading-tight text-slate-300 border border-slate-700">
                    <span className="block text-[8px] text-slate-400">NOV</span>
                    <strong className="text-white text-xs">20</strong>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Q4 2026 Access Review</div>
                    <div className="text-[10px] text-slate-400">IT Department</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  10 days
                </span>
              </div>

              {/* Review 3 */}
              <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="px-2 py-1 rounded bg-slate-800 text-center font-mono text-[10px] leading-tight text-slate-300 border border-slate-700">
                    <span className="block text-[8px] text-slate-400">NOV</span>
                    <strong className="text-white text-xs">25</strong>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Q4 2026 Access Review</div>
                    <div className="text-[10px] text-slate-400">Sales &amp; Marketing</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  15 days
                </span>
              </div>
            </div>
          </div>

          {/* Button: Start New Review */}
          <button
            onClick={() => setIsNewCampaignOpen(true)}
            className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Start New Review</span>
          </button>
        </div>

        {/* CARD 4: Quick Actions */}
        <div className="bg-[#0B101D] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h3 className="font-bold text-white text-xs">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleRunRiskScan}
                disabled={isScanning}
                className="w-full p-2.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Play className={`w-3.5 h-3.5 fill-amber-400 ${isScanning ? 'animate-spin' : ''}`} />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                  {isScanning ? 'Running Scan...' : 'Run Risk Scan'}
                </span>
              </button>

              <button
                onClick={() => setIsNewCampaignOpen(true)}
                className="w-full p-2.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                  Start Recertification
                </span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className="w-full p-2.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                  View Audit Logs
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="w-full p-2.5 rounded-lg bg-[#0E1526] hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-left flex items-center gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                  Generate Report
                </span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <svg viewBox="0 0 200 24" className="w-full h-4">
              <path
                d="M0,16 Q50,4 100,14 T200,8"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.5"
                className="opacity-60 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM FULL-WIDTH STRIP: RECENT ACTIVITY & QUOTE CARD     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity Bar */}
        <div className="lg:col-span-2 bg-[#0B101D] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-xs">Recent Activity</h3>
            </div>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              View All Activities <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 text-xs">
            {/* Activity 1 */}
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Mary Chikadzi</div>
                <div className="text-[11px] text-slate-400">Access approved</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">2 min ago</div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Suspicious permissions</div>
                <div className="text-[11px] text-rose-400">detected</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">5 min ago</div>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Recertification campaign</div>
                <div className="text-[11px] text-slate-400">Q4 2026 started</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">10 min ago</div>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">Permissions updated</div>
                <div className="text-[11px] text-slate-400">for John Moyo</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">12 min ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Mindset Quote Card */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0B101D] p-5 shadow-xl flex flex-col justify-center">
          {/* Subtle atmospheric backdrop gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-slate-900/60 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-start gap-3">
            <span className="text-3xl font-serif text-amber-400 leading-none select-none">“</span>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed italic">
                Security is not a product, but a mindset.
              </p>
              <div className="mt-2 text-[11px] text-amber-400/90 font-mono font-semibold">
                — Centrix
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Campaign Modal */}
      {isNewCampaignOpen && (
        <NewCampaignModal onClose={() => setIsNewCampaignOpen(false)} />
      )}
    </div>
  );
};
