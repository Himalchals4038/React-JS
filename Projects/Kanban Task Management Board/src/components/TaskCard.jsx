import React, { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  AlertTriangle,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';

export const TaskCard = ({ task }) => {
  const { setActiveTaskModal, deleteTask, moveTask, activeBoard } = useKanban();
  const [isDragging, setIsDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Subtask progress
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks
    ? task.subtasks.filter(st => st.completed).length
    : 0;
  const subtaskPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Overdue check
  const isOverdue =
    task.dueDate &&
    task.status !== 'completed' &&
    new Date(task.dueDate) < new Date(new Date().toDateString());

  // HTML5 Drag Handlers
  const handleDragStart = e => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => setActiveTaskModal(task)}
    >
      {/* Tags & Priority Header */}
      <div className="card-tags">
        <span className={`priority-badge ${task.priority}`}>
          {task.priority === 'urgent' && '🔴'}
          {task.priority === 'high' && '🟠'}
          {task.priority === 'medium' && '🟡'}
          {task.priority === 'low' && '🔵'}
          {task.priority}
        </span>

        {task.tags &&
          task.tags.map((tag, idx) => (
            <span key={idx} className={`tag-badge ${tag.toLowerCase()}`}>
              {tag}
            </span>
          ))}

        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <button
            className="btn-icon"
            style={{ width: 24, height: 24, padding: 0 }}
            onClick={e => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical size={14} />
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
                width: 130,
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
                  setActiveTaskModal(task);
                }}
              >
                <Edit2 size={12} /> Edit
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
                  deleteTask(task.id);
                }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h4 className="card-title">{task.title}</h4>
      {task.description && <p className="card-desc">{task.description}</p>}

      {/* Subtask Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="subtask-progress-container">
          <div className="subtask-progress-bar">
            <div
              className="subtask-progress-fill"
              style={{ width: `${subtaskPercent}%` }}
            ></div>
          </div>
          <div className="subtask-progress-text">
            <span>
              <CheckSquare size={10} style={{ display: 'inline', marginRight: 2 }} />
              Subtasks
            </span>
            <span>
              {completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)
            </span>
          </div>
        </div>
      )}

      {/* Footer Meta */}
      <div className="card-footer">
        <div className="card-meta">
          {task.dueDate && (
            <span className={`meta-item ${isOverdue ? 'overdue' : ''}`}>
              {isOverdue ? <AlertTriangle size={12} /> : <Calendar size={12} />}
              {task.dueDate}
            </span>
          )}

          {task.comments && task.comments.length > 0 && (
            <span className="meta-item">
              <MessageSquare size={12} />
              {task.comments.length}
            </span>
          )}
        </div>

        {task.assignee && (
          <div className="assignee-avatar" title={task.assignee.name}>
            {task.assignee.avatar || 'U'}
          </div>
        )}
      </div>
    </div>
  );
};
