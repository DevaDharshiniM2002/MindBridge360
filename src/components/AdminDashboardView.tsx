import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle,
  EyeOff,
  Filter,
  Calendar,
  Lock,
  Flag,
  UserCheck,
} from 'lucide-react';
import { MOCK_ADMIN_DEPARTMENT_TRENDS } from '../data/mockData';
import { PeerPost } from '../types';

interface AdminDashboardViewProps {
  flaggedPosts: PeerPost[];
  onReviewFlaggedPost: (postId: string, action: 'dismiss' | 'assign-counsellor') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  flaggedPosts,
  onReviewFlaggedPost,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Campus aggregated weekly burnout trajectory
  const weeklyAggregates = [
    { week: 'W1 (Orientation)', Burnout: 22, RestScore: 82, StressSpike: 15 },
    { week: 'W2', Burnout: 28, RestScore: 78, StressSpike: 20 },
    { week: 'W3', Burnout: 35, RestScore: 71, StressSpike: 30 },
    { week: 'W4 (Unit Tests)', Burnout: 58, RestScore: 54, StressSpike: 62 },
    { week: 'W5', Burnout: 42, RestScore: 66, StressSpike: 45 },
    { week: 'W6 (Midterms)', Burnout: 74, RestScore: 41, StressSpike: 85 },
    { week: 'W7 (Current)', Burnout: 68, RestScore: 49, StressSpike: 76 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Privacy Guarantee Header Banner */}
      <div className="bg-[#2D2D2B] text-white p-6 sm:p-8 rounded-[36px] shadow-sm space-y-4 border border-[#3D3A35]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-[#D1E5E6]/20 text-[#D1E5E6] rounded-[20px] border border-[#D1E5E6]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif italic text-2xl font-normal text-white">
                  Counsellor & Institutional Insights
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#D1E5E6]/20 text-[#D1E5E6] border border-[#D1E5E6]/30 rounded-full">
                  k-Anonymity Enforced
                </span>
              </div>
              <p className="text-xs text-[#E8E4D9]/80 mt-1 max-w-xl leading-relaxed">
                Aggregated student wellbeing metrics. No student names, emails, roll numbers, or individual check-in logs exist in this interface.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#3D3A35] rounded-[20px] border border-[#4A4640] text-xs text-[#E8E4D9] space-y-1">
            <div className="text-xs text-[#D1E5E6] font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D1E5E6]" /> Privacy Shield Active
            </div>
            <div className="text-[11px] text-[#E8E4D9]/70">Groups &lt; 15 students auto-suppressed</div>
          </div>
        </div>
      </div>

      {/* 1. Campus-wide Weekly Burnout & Exam Pulse Trend */}
      <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-[#E8E4D9] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D1E5E6]/40 text-[#4A8B8D] rounded-[18px]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif italic font-normal text-xl sm:text-2xl text-[#2D2D2B]">
                Campus-Wide Burnout Trajectory
              </h3>
              <p className="text-xs text-[#7A756D]">
                Aggregated over 1,240 enrolled students across 6 academic departments
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#A84832] bg-[#F5D5CB] px-3.5 py-1 rounded-full border border-[#E98A72]/30 self-start sm:self-auto">
            Week 7: +18% Burnout vs Baseline
          </span>
        </div>

        <div className="h-56 sm:h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyAggregates} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <XAxis dataKey="week" stroke="#7A756D" fontSize={10} tickLine={false} />
              <YAxis stroke="#7A756D" fontSize={10} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #E8E4D9',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Burnout" stroke="#E98A72" strokeWidth={2.5} />
              <Line type="monotone" dataKey="StressSpike" stroke="#D97962" strokeWidth={2} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="RestScore" stroke="#4A8B8D" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Department-Level Early Warning Radar (With k-anonymity suppression) */}
      <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-[#E8E4D9] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D1E5E6]/40 text-[#4A8B8D] rounded-[18px]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif italic font-normal text-xl sm:text-2xl text-[#2D2D2B]">
                Department Early Warning Heatmap
              </h3>
              <p className="text-xs text-[#7A756D]">
                Identifies academic clusters experiencing high friction without dean-level surveillance
              </p>
            </div>
          </div>
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_ADMIN_DEPARTMENT_TRENDS.map((dept, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-[28px] border transition-all ${
                dept.isSuppressed
                  ? 'bg-[#F9F7F2] border-dashed border-[#E8E4D9]'
                  : dept.burnoutIndex > 70
                  ? 'bg-[#F5D5CB]/30 border-[#E98A72]/40'
                  : 'bg-white border-[#E8E4D9]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#2D2D2B]">{dept.department}</h4>
                  <span className="text-xs text-[#7A756D] font-medium">{dept.year}</span>
                </div>

                {dept.isSuppressed ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F0EDE4] text-[#7A756D] rounded-full flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> N &lt; 15 Suppressed
                  </span>
                ) : (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      dept.burnoutIndex > 70
                        ? 'bg-[#F5D5CB] text-[#A84832]'
                        : 'bg-[#D1E5E6] text-[#1F4647]'
                    }`}
                  >
                    Burnout Index: {dept.burnoutIndex}%
                  </span>
                )}
              </div>

              {dept.isSuppressed ? (
                <p className="text-xs text-[#7A756D] mt-2.5 italic">
                  Data suppressed to prevent dean or faculty re-identification (cohort size is only {dept.totalActiveStudents} students).
                </p>
              ) : (
                <div className="mt-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#7A756D]">
                    <span>Active Cohort: {dept.totalActiveStudents} students</span>
                    <span className="font-semibold text-[#A84832]">
                      Spike: +{Math.round((dept.stressSpikeRatio - 1) * 100)}% vs baseline
                    </span>
                  </div>

                  <div className="text-xs text-[#7A756D]">
                    <span className="font-semibold text-[#2D2D2B]">Primary Stressors: </span>
                    {dept.primaryStressors.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Human Counsellor Moderation & Flagged Escalation Queue */}
      <div className="bg-white p-6 sm:p-8 rounded-[36px] border border-[#E8E4D9] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F5D5CB]/50 text-[#A84832] rounded-[18px]">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif italic font-normal text-xl sm:text-2xl text-[#2D2D2B]">
                Human-Reviewed Moderation & Escalation Queue
              </h3>
              <p className="text-xs text-[#7A756D]">
                Posts flagged by verified peer volunteers for clinical counsellor triage.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-[#F5D5CB] text-[#A84832] rounded-full">
            {flaggedPosts.length} in Queue
          </span>
        </div>

        {flaggedPosts.length === 0 ? (
          <div className="p-6 text-center bg-[#F9F7F2] rounded-[24px] text-xs text-[#7A756D] border border-[#E8E4D9]">
            ✅ Escalation queue is clear. No flagged items require review at this moment.
          </div>
        ) : (
          <div className="space-y-3.5">
            {flaggedPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 bg-[#F9F7F2] rounded-[28px] border border-[#E8E4D9] space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2D2D2B]">
                    Anonymous Ticket #{post.id.slice(-5)} (Room: {post.room})
                  </span>
                  <span className="text-[10px] text-[#7A756D]">{post.createdAt}</span>
                </div>

                <p className="text-[#2D2D2B] font-serif font-bold text-sm">"{post.title}"</p>
                <p className="text-[#7A756D] text-xs leading-relaxed line-clamp-2">
                  {post.content}
                </p>

                <div className="pt-2.5 border-t border-[#E8E4D9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs text-[#A84832] font-semibold">
                    Flagged: {post.flagReason || 'High distress signal'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReviewFlaggedPost(post.id, 'dismiss')}
                      className="px-3.5 py-1.5 bg-white hover:bg-[#F0EDE4] text-[#3D3A35] border border-[#E8E4D9] rounded-full text-xs font-medium cursor-pointer"
                    >
                      Dismiss (Safe)
                    </button>
                    <button
                      onClick={() => onReviewFlaggedPost(post.id, 'assign-counsellor')}
                      className="px-3.5 py-1.5 bg-[#4A8B8D] hover:bg-[#376F71] text-white rounded-full text-xs font-bold cursor-pointer"
                    >
                      Assign Campus Counsellor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
