import React from 'react';
import {
  Users,
  Layers,
  KeyRound,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  FileText,
  Calendar,
  Building
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { useAccessGuard } from '../../context/AccessGuardContext';

export const ExecutiveDashboard: React.FC = () => {
  const {
    metrics,
    campaigns,
    violations,
    auditLogs,
    setActiveTab,
    setSelectedCampaignId,
    setSelectedEmployeeId
  } = useAccessGuard();

  // Data for Risk Distribution Pie Chart
  const riskPieData = [
    { name: 'Critical (70-100)', value: metrics.riskDistribution.critical, color: '#E11D48' },
    { name: 'High (40-69)', value: metrics.riskDistribution.high, color: '#F59E0B' },
    { name: 'Moderate (20-39)', value: metrics.riskDistribution.moderate, color: '#3B82F6' },
    { name: 'Low (0-19)', value: metrics.riskDistribution.low, color: '#10B981' }
  ].filter(d => d.value > 0);

  // Data for Department Risk Comparison
  const deptRiskData = metrics.departmentRiskStats.map(d => ({
    name: d.department.split(' ')[0], // Short name
    fullName: d.department,
    avgRisk: d.avgRiskScore,
    violations: d.violationsCount,
    users: d.totalUsers
  }));

  // Violations grouped by rule
  const violationTypeCount: Record<string, number> = {};
  violations.forEach(v => {
    const key = v.ruleType
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
    violationTypeCount[key] = (violationTypeCount[key] || 0) + 1;
  });

  const violationTypeData = Object.entries(violationTypeCount).map(([name, count]) => ({
    name: name.length > 20 ? name.slice(0, 18) + '...' : name,
    fullName: name,
    count
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner: Tenant Context & Quick Actions */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Building className="w-3.5 h-3.5" />
            Jenaya Financial Services · IGA Command Console
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Executive Identity Governance &amp; Recertification Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Continuous identity compliance monitoring, automated quarterly access reviews, and real-time Segregation of Duties (SoD) risk enforcement across all banking &amp; financial systems.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('recertification')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Recertification Centre
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Risk &amp; SoD Engine
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-300" />
            Compliance Reports
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {/* Total Identities */}
        <div
          onClick={() => setActiveTab('employees')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Identities</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {metrics.totalEmployees}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>{metrics.activeEmployees} active</span>
            <span className="text-rose-600 font-medium font-mono">{metrics.inactiveEmployees} inactive</span>
          </div>
        </div>

        {/* Connected Applications */}
        <div
          onClick={() => setActiveTab('systems')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Connected Systems</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {metrics.totalConnectedApps}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>{metrics.totalAssignedPermissions} active permissions</span>
          </div>
        </div>

        {/* Recertification Rate */}
        <div
          onClick={() => setActiveTab('recertification')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Recertification</span>
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-600">
            {metrics.recertificationCompletionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>{metrics.pendingReviewsCount} pending</span>
            {metrics.overdueReviewsCount > 0 && (
              <span className="text-rose-600 font-semibold font-mono">
                {metrics.overdueReviewsCount} overdue
              </span>
            )}
          </div>
        </div>

        {/* Critical Violations */}
        <div
          onClick={() => setActiveTab('risks')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Critical Threats</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600">
            {metrics.criticalViolationsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span className="text-amber-600 font-semibold font-mono">
              {metrics.highRiskIdentitiesCount} high-risk identities
            </span>
          </div>
        </div>

        {/* Outstanding Remediation */}
        <div
          onClick={() => setActiveTab('actions')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer col-span-2 md:col-span-4 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Remediations</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-600">
            {metrics.outstandingCorrectiveActionsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>Open corrective actions</span>
          </div>
        </div>
      </div>

      {/* Critical Security Alert Strip if Terminated/SoD risks exist */}
      {metrics.criticalViolationsCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-900 text-sm">
                Critical Identity Vulnerabilities Detected ({metrics.criticalViolationsCount})
              </span>
              <p className="text-rose-800 mt-0.5 leading-relaxed text-[11px]">
                The rules engine flagged critical conditions including <strong>former employees retaining active core banking access</strong> and <strong>toxic Segregation of Duties (SoD) entitlement pairs</strong> (e.g., Supplier Creation + Payment Release).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('risks')}
            className="px-3 py-1.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 text-xs shrink-0 cursor-pointer shadow-xs"
          >
            Investigate Violations →
          </button>
        </div>
      )}

      {/* Charts Grid: A. Access Review Progress & B. Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recertification Progress Gauge */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Access Review Progress</h3>
              <p className="text-xs text-slate-500">Quarterly recertification velocity</p>
            </div>
            <button
              onClick={() => setActiveTab('recertification')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              Details <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Completed Reviews</span>
                <span className="font-mono font-bold text-emerald-600">
                  {metrics.recertificationCompletionRate}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.recertificationCompletionRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="text-base font-bold font-mono text-emerald-700">
                  {campaigns.reduce((acc, c) => acc + c.completedReviewItems, 0)}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Completed</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="text-base font-bold font-mono text-blue-700">
                  {metrics.pendingReviewsCount}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Pending</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="text-base font-bold font-mono text-rose-700">
                  {metrics.overdueReviewsCount}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Overdue</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
              <p className="font-medium text-blue-900">Governance Target: 100%</p>
              <p className="text-blue-800/80 mt-0.5">
                Target completion deadline is within 20 days. Department managers receive automated daily escalations for overdue reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Identity Risk Distribution</h3>
              <p className="text-xs text-slate-500">Calculated across 100 employee identities</p>
            </div>
            <button
              onClick={() => setActiveTab('risks')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              Matrix <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} Identities`, name]}
                  contentStyle={{ fontSize: '11px', borderRadius: '6px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
              <span className="text-slate-600 text-[11px]">Critical (70-100):</span>
              <span className="font-bold font-mono text-slate-900">{metrics.riskDistribution.critical}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-600 text-[11px]">High (40-69):</span>
              <span className="font-bold font-mono text-slate-900">{metrics.riskDistribution.high}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-slate-600 text-[11px]">Moderate (20-39):</span>
              <span className="font-bold font-mono text-slate-900">{metrics.riskDistribution.moderate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-600 text-[11px]">Low (0-19):</span>
              <span className="font-bold font-mono text-slate-900">{metrics.riskDistribution.low}</span>
            </div>
          </div>
        </div>

        {/* Violations by Category */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Security Violations by Rule</h3>
              <p className="text-xs text-slate-500">Live detection engine breakdown</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              {violations.length} Active
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={violationTypeData}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Violations`, 'Detected']}
                  contentStyle={{ fontSize: '11px', borderRadius: '6px' }}
                />
                <Bar dataKey="count" fill="#E11D48" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Automated real-time scanner</span>
            <button
              onClick={() => setActiveTab('risks')}
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              View All Rules →
            </button>
          </div>
        </div>
      </div>

      {/* Department Risk Comparison & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Security Risk Overview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Department Risk Overview</h3>
              <p className="text-xs text-slate-500">Comparative average risk score across business units</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {metrics.departmentRiskStats.map(dept => (
              <div key={dept.department} className="py-2.5 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-slate-800 truncate">{dept.department}</div>
                  <div className="text-[11px] text-slate-400">
                    {dept.totalUsers} staff · {dept.violationsCount} open violation(s)
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        dept.avgRiskScore >= 40
                          ? 'bg-rose-500'
                          : dept.avgRiskScore >= 20
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, dept.avgRiskScore * 1.5)}%` }}
                    />
                  </div>
                  <span
                    className={`font-mono font-bold text-xs w-8 text-right ${
                      dept.avgRiskScore >= 40
                        ? 'text-rose-600'
                        : dept.avgRiskScore >= 20
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {dept.avgRiskScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled & Active Recertification Campaigns */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recertification Campaigns</h3>
                <p className="text-xs text-slate-500">Scheduled quarterly compliance reviews</p>
              </div>
              <button
                onClick={() => setActiveTab('recertification')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                + New Campaign
              </button>
            </div>

            <div className="space-y-3">
              {campaigns.map(camp => {
                const completionPct =
                  camp.totalReviewItems > 0
                    ? Math.round((camp.completedReviewItems / camp.totalReviewItems) * 100)
                    : 100;

                return (
                  <div
                    key={camp.id}
                    onClick={() => {
                      setSelectedCampaignId(camp.id);
                      setActiveTab('recertification');
                    }}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          {camp.campaignCode}
                        </span>
                        <span className="font-bold text-slate-900 truncate">{camp.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          camp.status === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-800'
                            : camp.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> Deadline: {camp.deadline}
                      </span>
                      <span className="font-mono">
                        {camp.completedReviewItems} / {camp.totalReviewItems} items ({completionPct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          completionPct === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Automated Manager Notification Engine active</span>
            <span className="font-mono text-[10px] text-slate-400">ISO 27001 A.9.2.5</span>
          </div>
        </div>
      </div>

      {/* Recent Activities & Audit Trail Preview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Governance Activities &amp; Security Events</h3>
            <p className="text-xs text-slate-500">Immutable audit event stream</p>
          </div>
          <button
            onClick={() => setActiveTab('audit')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
          >
            Full Audit Trail ({auditLogs.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    log.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : log.severity === 'WARNING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {log.action}
                </span>
                <div>
                  <p className="text-slate-800 font-medium leading-relaxed">{log.description}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>Actor: <strong>{log.actorName}</strong> ({log.actorRole})</span>
                    <span>·</span>
                    <span className="font-mono">{log.ipAddress}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
