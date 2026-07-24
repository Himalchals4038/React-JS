import React, { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import { TaskCard } from './TaskCard';
import { Plus, MoreHorizontal, AlertCircle, Trash2, Edit3 } from 'lucide-react';

export const KanbanColumn = ({ column, tasks }) => {
  const {
    moveTask,
    setIsCreateModalOpen,
    setCreateInitialColumn,
    deleteColumn,
    updateColumnWip,
    addTask
  } = useKanban();

  const [isDragOver, setIsDragOver] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [showQuickInput, setShowQuickInput] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const columnTasks = tasks.filter(t => t.status === column.id);
  const isWipExceeded = column.wipLimit > 0 && columnTasks.length > column.wipLimit;

  // Drop Handlers
  const handleDragOver = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, column.id);
    }
  };

  const handleQuickAdd = e => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle.trim(),
      status: column.id,
      priority: 'medium',
      tags: ['feature']
    });
    setQuickTitle('');
    setShowQuickInput(false);
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="column-header">
        <div className="column-title-group">
          <span
            className="column-dot"
            style={{ backgroundColor: column.color || '#6366f1' }}
          ></span>
          <h3 className="column-title">{column.title}</h3>
          <span
            className={`task-count-badge ${isWipExceeded ? 'wip-warning' : ''}`}
            title={
              column.wipLimit > 0
                ? `WIP Limit: ${columnTasks.length}/${column.wipLimit}`
                : 'No WIP Limit'
            }
          >
            {columnTasks.length} {column.wipLimit > 0 ? `/ ${column.wipLimit}` : ''}
          </span>
          {isWipExceeded && (
            <AlertCircle size={14} color="#ef4444" title="WIP Limit Exceeded!" />
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            style={{ width: 28, height: 28 }}
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem',
                zIndex: 50,
                width: 150,
                boxShadow: 'var(--shadow-md)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.5rem',
                  width: '100%',
                  fontSize: '0.78rem',
                  color: 'var(--text-primary)'
                }}
                onClick={() => {
                  setShowMenu(false);
                  const newLimit = prompt(
                    `Set WIP Limit for "${column.title}" (0 for unlimited):`,
                    column.wipLimit
                  );
                  if (newLimit !== null) updateColumnWip(column.id, newLimit);
                }}
              >
                <Edit3 size={12} /> Change WIP Limit
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.5rem',
                  width: '100%',
                  fontSize: '0.78rem',
                  color: '#ef4444'
                }}
                onClick={() => {
                  setShowMenu(false);
                  if (confirm(`Delete column "${column.title}"?`)) {
                    deleteColumn(column.id);
                  }
                }}
              >
                <Trash2 size={12} /> Delete Column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Cards Container */}
      <div className="column-tasks">
        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        {columnTasks.length === 0 && (
          <div
            style={{
              padding: '1.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              border: '1px dashed var(--bg-glass-border)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            Drop tasks here
          </div>
        )}
      </div>

      {/* Quick Add Task */}
      <div style={{ padding: '0.75rem 0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
        {showQuickInput ? (
          <form onSubmit={handleQuickAdd}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter task title..."
              value={quickTitle}
              onChange={e => setQuickTitle(e.target.value)}
              autoFocus
              style={{ marginBottom: '0.5rem', fontSize: '0.82rem' }}
            />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}>
                Add
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                onClick={() => setShowQuickInput(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              width: '100%',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.35rem 0.5rem',
              borderRadius: 'var(--radius-md)'
            }}
            onClick={() => {
              setCreateInitialColumn(column.id);
              setIsCreateModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        )}
      </div>
    </div>
  );
};
