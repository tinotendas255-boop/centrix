import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  MessageSquare,
  UserCheck,
  Send
} from 'lucide-react';
import { useAccessGuard } from '../../context/AccessGuardContext';
import { ApprovalWorkflow } from '../../types';

export const ApprovalWorkflows: React.FC = () => {
  const { approvalWorkflows, approveWorkflowStep, rejectWorkflowStep, currentUser } = useAccessGuard();

  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [commentText, setCommentText] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <GitPullRequest className="w-6 h-6 text-amber-400" />
          Multi-Level Enterprise Approval Workflows
          <span className="text-xs font-mono font-medium text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
            {approvalWorkflows.length} Workflows
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Hierarchical multi-stage signoff pipeline: Department Manager → Application Owner → IT Administrator.
        </p>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {approvalWorkflows.map(wf => {
          const currentStepObj = wf.steps.find(s => s.stepNumber === wf.currentStep);
          const isPending = wf.status === 'PENDING';

          return (
            <div
              key={wf.id}
              className="bg-[#0B101D] rounded-xl border border-slate-800 p-5 shadow-lg space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      {wf.workflowCode}
                    </span>
                    <span className="text-xs font-bold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                      {wf.requestType.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        wf.status === 'APPROVED'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : wf.status === 'REJECTED'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {wf.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm mt-2">
                    Target Identity: <span className="text-slate-100">{wf.employeeName}</span> · System: <span className="text-amber-400">{wf.applicationName}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Requested Level: <strong className="font-mono text-slate-200">{wf.requestedLevel}</strong> ({wf.requestedRole}) · Initiated by: {wf.requesterName} on {wf.submittedDate}
                  </p>
                </div>

                {wf.riskAssessment && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Risk Score</span>
                    <span className={`text-base font-bold font-mono ${
                      wf.riskAssessment.level === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {wf.riskAssessment.score} / 100 ({wf.riskAssessment.level})
                    </span>
                  </div>
                )}
              </div>

              {/* Justification quote */}
              <div className="p-3 bg-[#070B12] border border-slate-800 rounded-lg text-xs text-slate-300 italic">
                &quot;{wf.justification}&quot;
              </div>

              {/* Multi-Step Pipeline Visualizer */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Approval Hierarchy Pipeline (Step {wf.currentStep} of {wf.totalSteps})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {wf.steps.map(step => {
                    const isStepApproved = step.status === 'APPROVED';
                    const isStepCurrent = wf.status === 'PENDING' && step.stepNumber === wf.currentStep;

                    return (
                      <div
                        key={step.stepNumber}
                        className={`p-3 rounded-lg border text-xs transition-colors ${
                          isStepApproved
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                            : isStepCurrent
                            ? 'bg-amber-950/30 border-amber-500/60 ring-2 ring-amber-500/20 text-amber-200'
                            : 'bg-[#070B12] border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            Stage 0{step.stepNumber}
                          </span>
                          <span className="font-semibold text-[10px] uppercase">
                            {step.status}
                          </span>
                        </div>
                        <div className="font-bold text-white text-xs">{step.stepName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {step.approverName} ({step.approverRole})
                        </div>
                        {step.comments && (
                          <div className="mt-2 text-[10px] text-slate-300 italic bg-[#0B101D] p-1.5 rounded border border-slate-700">
                            &quot;{step.comments}&quot;
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Controls if step is pending */}
              {isPending && currentStepObj && (
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-[#070B12] p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-300">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>
                      Active Stage: <strong className="text-white">{currentStepObj.stepName}</strong> (Approver: {currentStepObj.approverName})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Optional approver comment..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#0B101D] border border-slate-700 rounded text-xs text-white placeholder-slate-500 focus:outline-none flex-1 sm:w-60 focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => {
                        rejectWorkflowStep(wf.id, wf.currentStep, commentText || 'Rejected during workflow review');
                        setCommentText('');
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        approveWorkflowStep(wf.id, wf.currentStep, commentText || 'Approved verified role authorization');
                        setCommentText('');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      Approve Stage
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
