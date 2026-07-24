import React from 'react';
import { useKanban } from '../context/KanbanContext';
import { Search, Filter, ArrowUpDown, XCircle } from 'lucide-react';

export const FilterBar = () => {
  const {
    tasks,
    allTasks,
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy
  } = useKanban();

  const isFiltered =
    searchQuery !== '' || selectedPriority !== 'all' || selectedTag !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPriority('all');
    setSelectedTag('all');
  };

  const completedCount = allTasks.filter(t => t.status === 'completed').length;
  const overdueCount = allTasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < new Date(new Date().toDateString());
  }).length;

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <div className="search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ display: 'flex' }}>
            <XCircle size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="filters-group">
        <select
          className="filter-select"
          value={selectedPriority}
          onChange={e => setSelectedPriority(e.target.value)}
        >
          <option value="all">Priority: All</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🔵 Low</option>
        </select>

        <select
          className="filter-select"
          value={selectedTag}
          onChange={e => setSelectedTag(e.target.value)}
        >
          <option value="all">Category: All</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="design">Design</option>
          <option value="bug">Bug Fix</option>
          <option value="feature">Feature</option>
          <option value="devops">DevOps</option>
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="createdAt">Sort: Created Date</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority Level</option>
          <option value="title">Sort: Alphabetical</option>
        </select>

        {isFiltered && (
          <button className="btn-secondary" onClick={clearFilters} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Metrics Pill */}
      <div className="metrics-pill">
        <span>{tasks.length} Tasks</span>
        <span>•</span>
        <span style={{ color: '#10b981' }}>{completedCount} Completed</span>
        {overdueCount > 0 && (
          <>
            <span>•</span>
            <span style={{ color: '#ef4444' }}>{overdueCount} Overdue</span>
          </>
        )}
      </div>
    </div>
  );
};
