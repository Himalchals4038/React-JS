import React from 'react';
import { useKanban } from '../context/KanbanContext';
import { X, CheckCircle2, Clock, AlertTriangle, Users, Award } from 'lucide-react';

export const AnalyticsModal = () => {
  const { isAnalyticsOpen, setIsAnalyticsOpen, allTasks, activeBoard } = useKanban();

  if (!isAnalyticsOpen) return null;

  const total = allTasks.length;
  const completed = allTasks.filter(t => t.status === 'completed').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const overdue = allTasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < new Date(new Date().toDateString());
  }).length;

  // Status breakdown
  const statusCounts = (activeBoard.columns || []).reduce((acc, col) => {
    acc[col.id] = allTasks.filter(t => t.status === col.id).length;
    return acc;
  }, {});

  // Priority breakdown
  const priorityCounts = {
    urgent: allTasks.filter(t => t.priority === 'urgent').length,
    high: allTasks.filter(t => t.priority === 'high').length,
    medium: allTasks.filter(t => t.priority === 'medium').length,
    low: allTasks.filter(t => t.priority === 'low').length
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAnalyticsOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award size={22} color="var(--accent-primary)" />
            <h2 className="modal-title">Productivity & Analytics</h2>
          </div>
          <button className="btn-icon" onClick={() => setIsAnalyticsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* KPI Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}
        >
          <div
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              COMPLETION RATE
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
              {completionRate}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {completed} of {total} Tasks Done
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              TOTAL TASKS
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
              {total}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Across {activeBoard.name}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--bg-glass-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              OVERDUE TASKS
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: overdue > 0 ? '#ef4444' : '#10b981', marginTop: '0.2rem' }}>
              {overdue}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Requires immediate focus
            </div>
          </div>
        </div>

        {/* Status Distribution Bars */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Status Distribution
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {activeBoard.columns.map(col => {
              const count = statusCounts[col.id] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={col.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600, color: col.color }}>{col.title}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{count} ({pct}%)</span>
                  </div>
                  <div className="subtask-progress-bar">
                    <div
                      className="subtask-progress-fill"
                      style={{ width: `${pct}%`, background: col.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Priority Breakdown
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.6rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>URGENT</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{priorityCounts.urgent}</div>
            </div>
            <div style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)', padding: '0.6rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#f97316', fontWeight: 700 }}>HIGH</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f97316' }}>{priorityCounts.high}</div>
            </div>
            <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', padding: '0.6rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#eab308', fontWeight: 700 }}>MEDIUM</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#eab308' }}>{priorityCounts.medium}</div>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.6rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 700 }}>LOW</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>{priorityCounts.low}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn-secondary" onClick={() => setIsAnalyticsOpen(false)}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
