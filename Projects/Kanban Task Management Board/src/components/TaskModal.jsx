import React, { useState, useEffect } from 'react';
import { useKanban } from '../context/KanbanContext';
import {
  X,
  Plus,
  Trash2,
  CheckSquare,
  MessageSquare,
  History,
  Tag,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';

const TAG_OPTIONS = ['frontend', 'backend', 'design', 'bug', 'feature', 'devops'];
const ASSIGNEE_OPTIONS = [
  { name: 'Alex Rivera', avatar: 'AR' },
  { name: 'Sarah Chen', avatar: 'SC' },
  { name: 'Devon Vance', avatar: 'DV' },
  { name: 'Elena Rostova', avatar: 'ER' },
  { name: 'Marcus Brody', avatar: 'MB' }
];

export const TaskModal = () => {
  const {
    activeTaskModal,
    setActiveTaskModal,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createInitialColumn,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    addComment,
    activeBoard
  } = useKanban();

  const isEditing = Boolean(activeTaskModal);
  const isOpen = isEditing || isCreateModalOpen;

  // Local Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [selectedTags, setSelectedTags] = useState(['feature']);
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState(ASSIGNEE_OPTIONS[0]);

  // Subtask & Comment input states
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Sync form state when editing task opens
  useEffect(() => {
    if (activeTaskModal) {
      setTitle(activeTaskModal.title || '');
      setDescription(activeTaskModal.description || '');
      setStatus(activeTaskModal.status || 'todo');
      setPriority(activeTaskModal.priority || 'medium');
      setSelectedTags(activeTaskModal.tags || ['feature']);
      setDueDate(activeTaskModal.dueDate || '');
      setAssignee(activeTaskModal.assignee || ASSIGNEE_OPTIONS[0]);
    } else {
      setTitle('');
      setDescription('');
      setStatus(createInitialColumn || 'todo');
      setPriority('medium');
      setSelectedTags(['feature']);
      setDueDate(new Date().toISOString().split('T')[0]);
      setAssignee(ASSIGNEE_OPTIONS[0]);
    }
  }, [activeTaskModal, isCreateModalOpen, createInitialColumn]);

  if (!isOpen) return null;

  const closeModal = () => {
    setActiveTaskModal(null);
    setIsCreateModalOpen(false);
  };

  const handleSave = e => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing) {
      updateTask(activeTaskModal.id, {
        title,
        description,
        status,
        priority,
        tags: selectedTags,
        dueDate,
        assignee
      });
    } else {
      addTask({
        title,
        description,
        status,
        priority,
        tags: selectedTags,
        dueDate,
        assignee
      });
    }
    closeModal();
  };

  const toggleTag = tag => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddSubtaskSubmit = e => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    if (isEditing) {
      addSubtask(activeTaskModal.id, newSubtaskTitle);
    }
    setNewSubtaskTitle('');
  };

  const handleAddCommentSubmit = e => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (isEditing) {
      addComment(activeTaskModal.id, newCommentText);
    }
    setNewCommentText('');
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Task Details' : 'Create New Task'}
          </h2>
          <button className="btn-icon" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Title Input */}
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Implement OAuth Authentication flow"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Add detailed task instructions or requirements..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Column Status & Priority Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Column Status</label>
              <select
                className="form-select"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                {activeBoard &&
                  activeBoard.columns.map(col => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>
          </div>

          {/* Due Date & Assignee Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-select"
                value={assignee.name}
                onChange={e => {
                  const selected = ASSIGNEE_OPTIONS.find(
                    a => a.name === e.target.value
                  );
                  if (selected) setAssignee(selected);
                }}
              >
                {ASSIGNEE_OPTIONS.map((a, idx) => (
                  <option key={idx} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tags */}
          <div className="form-group">
            <label className="form-label">Category Tags</label>
            <div className="card-tags" style={{ marginTop: '0.4rem' }}>
              {TAG_OPTIONS.map((tag, idx) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`tag-badge ${tag}`}
                    style={{
                      opacity: active ? 1 : 0.4,
                      border: active ? '1.5px solid currentColor' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks Checklist Section (for editing mode) */}
          {isEditing && (
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckSquare size={14} /> Subtask Checklist
              </label>

              <div className="subtasks-list">
                {activeTaskModal.subtasks &&
                  activeTaskModal.subtasks.map(st => (
                    <div key={st.id} className="subtask-item">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => toggleSubtask(activeTaskModal.id, st.id)}
                      />
                      <span className={st.completed ? 'completed' : ''}>
                        {st.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteSubtask(activeTaskModal.id, st.id)}
                        style={{ color: '#ef4444' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
              </div>

              {/* Add Subtask Input */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add new subtask..."
                  value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.7rem' }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddSubtaskSubmit}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          )}

          {/* Comments Section (Editing mode) */}
          {isEditing && (
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={14} /> Discussion & Comments
              </label>

              <div className="comments-list">
                {activeTaskModal.comments &&
                  activeTaskModal.comments.map(c => (
                    <div key={c.id} className="comment-bubble">
                      <div className="comment-author">
                        {c.author} • <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{c.timestamp}</span>
                      </div>
                      <div className="comment-text">{c.text}</div>
                    </div>
                  ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Write a comment..."
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.7rem' }}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddCommentSubmit}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                >
                  Comment
                </button>
              </div>
            </div>
          )}

          {/* Activity Log Audit Trail */}
          {isEditing && activeTaskModal.activityLog && (
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <History size={14} /> Activity Log
              </label>
              <div className="activity-log">
                {activeTaskModal.activityLog.map(act => (
                  <div key={act.id} className="activity-item">
                    <span>{act.action}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            {isEditing ? (
              <button
                type="button"
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(activeTaskModal.id);
                  }
                }}
              >
                <Trash2 size={16} /> Delete Task
              </button>
            ) : (
              <div></div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
