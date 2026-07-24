import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchApiTasks,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  getFallbackTasks
} from '../services/api';

const KanbanContext = createContext();

const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#6366f1', wipLimit: 6 },
  { id: 'in_progress', title: 'In Progress', color: '#eab308', wipLimit: 4 },
  { id: 'review', title: 'Under Review', color: '#a855f7', wipLimit: 4 },
  { id: 'completed', title: 'Completed', color: '#10b981', wipLimit: 0 }
];

const DEFAULT_BOARDS = [
  { id: 'board-1', name: '⚡ Main Project Sprint', columns: DEFAULT_COLUMNS },
  { id: 'board-2', name: '🚀 Marketing Launch', columns: DEFAULT_COLUMNS },
  { id: 'board-3', name: '🎯 Product Roadmap', columns: DEFAULT_COLUMNS }
];

export const KanbanProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('kanban_theme') || 'dark');

  // Multi-Board State
  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem('kanban_boards');
    return saved ? JSON.parse(saved) : DEFAULT_BOARDS;
  });
  const [activeBoardId, setActiveBoardId] = useState(() => {
    return localStorage.getItem('kanban_active_board_id') || 'board-1';
  });

  // Task & API Sync State
  const [tasks, setTasks] = useState([]);
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'offline'

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  // Modal States
  const [activeTaskModal, setActiveTaskModal] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [createInitialColumn, setCreateInitialColumn] = useState('todo');

  // Sync theme attribute with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kanban_theme', theme);
  }, [theme]);

  // Persist boards & active board id
  useEffect(() => {
    localStorage.setItem('kanban_boards', JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem('kanban_active_board_id', activeBoardId);
  }, [activeBoardId]);

  // Persist tasks in localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Initial Load from REST API or LocalStorage
  useEffect(() => {
    const initializeData = async () => {
      setSyncStatus('syncing');
      const savedTasks = localStorage.getItem('kanban_tasks');
      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
          setSyncStatus('synced');
          return;
        } catch (e) {
          console.warn('Failed parsing stored tasks:', e);
        }
      }

      // Fetch from API
      const apiTasks = await fetchApiTasks();
      setTasks(apiTasks);
      setSyncStatus('synced');
    };

    initializeData();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Manual API Refresh
  const refreshFromAPI = async () => {
    setSyncStatus('syncing');
    const apiTasks = await fetchApiTasks();
    setTasks(apiTasks);
    setSyncStatus('synced');
  };

  // Move task (Drag and Drop or Manual Status change)
  const moveTask = async (taskId, targetStatus) => {
    setSyncStatus('syncing');
    setTasks(prevTasks =>
      prevTasks.map(t => {
        if (t.id === taskId) {
          const updatedLog = [
            {
              id: `act-${Date.now()}`,
              action: `Status moved to ${targetStatus.replace('_', ' ').toUpperCase()}`,
              timestamp: new Date().toLocaleTimeString()
            },
            ...(t.activityLog || [])
          ];
          return { ...t, status: targetStatus, activityLog: updatedLog };
        }
        return t;
      })
    );

    // Call API endpoint
    await updateTaskAPI(taskId, { status: targetStatus });
    setSyncStatus('synced');
  };

  // Add Task
  const addTask = async (newTaskData) => {
    setSyncStatus('syncing');
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskData.title,
      description: newTaskData.description || '',
      status: newTaskData.status || createInitialColumn || 'todo',
      priority: newTaskData.priority || 'medium',
      tags: newTaskData.tags || ['feature'],
      assignee: newTaskData.assignee || { name: 'Alex Rivera', avatar: 'AR' },
      dueDate: newTaskData.dueDate || new Date().toISOString().split('T')[0],
      subtasks: newTaskData.subtasks || [],
      comments: [],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          action: 'Task created',
          timestamp: new Date().toLocaleTimeString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    await createTaskAPI(newTask);
    setSyncStatus('synced');
  };

  // Update Task
  const updateTask = async (taskId, updates) => {
    setSyncStatus('syncing');
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates };
          return updated;
        }
        return t;
      })
    );

    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal(prev => ({ ...prev, ...updates }));
    }

    await updateTaskAPI(taskId, updates);
    setSyncStatus('synced');
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    setSyncStatus('syncing');
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal(null);
    }
    await deleteTaskAPI(taskId);
    setSyncStatus('synced');
  };

  // Subtask Handlers
  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );

    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
      }));
    }
  };

  const addSubtask = (taskId, subtaskTitle) => {
    if (!subtaskTitle.trim()) return;
    const newSt = {
      id: `st-${Date.now()}`,
      title: subtaskTitle.trim(),
      completed: false
    };

    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, subtasks: [...t.subtasks, newSt] };
        }
        return t;
      })
    );

    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, newSt]
      }));
    }
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, subtasks: t.subtasks.filter(st => st.id !== subtaskId) };
        }
        return t;
      })
    );

    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal(prev => ({
        ...prev,
        subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
      }));
    }
  };

  // Comment Handler
  const addComment = (taskId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, comments: [...(t.comments || []), newComment] };
        }
        return t;
      })
    );

    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
    }
  };

  // Column Handlers
  const addColumn = (title, color = '#6366f1', wipLimit = 5) => {
    if (!title.trim()) return;
    const colId = `col-${Date.now()}`;
    const newCol = { id: colId, title: title.trim(), color, wipLimit: Number(wipLimit) };

    setBoards(prev =>
      prev.map(b => (b.id === activeBoardId ? { ...b, columns: [...b.columns, newCol] } : b))
    );
  };

  const deleteColumn = (colId) => {
    setBoards(prev =>
      prev.map(b => {
        if (b.id === activeBoardId) {
          return { ...b, columns: b.columns.filter(c => c.id !== colId) };
        }
        return b;
      })
    );
    // Move tasks in deleted column to first remaining column
    const remainingCols = activeBoard.columns.filter(c => c.id !== colId);
    const fallbackColId = remainingCols.length > 0 ? remainingCols[0].id : 'todo';

    setTasks(prev =>
      prev.map(t => (t.status === colId ? { ...t, status: fallbackColId } : t))
    );
  };

  const updateColumnWip = (colId, newLimit) => {
    setBoards(prev =>
      prev.map(b => {
        if (b.id === activeBoardId) {
          return {
            ...b,
            columns: b.columns.map(c => (c.id === colId ? { ...c, wipLimit: Number(newLimit) } : c))
          };
        }
        return b;
      })
    );
  };

  // Board Handlers
  const addBoard = (name) => {
    if (!name.trim()) return;
    const newBoard = {
      id: `board-${Date.now()}`,
      name: name.trim(),
      columns: DEFAULT_COLUMNS
    };
    setBoards(prev => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
  };

  // Active Board Helper
  const activeBoard = boards.find(b => b.id === activeBoardId) || boards[0];

  // Export / Import
  const exportBoardJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ boards, tasks }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kanban_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBoardJSON = (importedData) => {
    if (importedData.boards && importedData.tasks) {
      setBoards(importedData.boards);
      setTasks(importedData.tasks);
    }
  };

  const resetToDefaultData = () => {
    localStorage.removeItem('kanban_tasks');
    localStorage.removeItem('kanban_boards');
    setBoards(DEFAULT_BOARDS);
    setTasks(getFallbackTasks());
  };

  // Filtered & Sorted Tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    const matchesTag = selectedTag === 'all' || (t.tags && t.tags.includes(selectedTag));
    const matchesAssignee =
      selectedAssignee === 'all' || (t.assignee && t.assignee.name === selectedAssignee);

    return matchesSearch && matchesPriority && matchesTag && matchesAssignee;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const pMap = { urgent: 4, high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <KanbanContext.Provider
      value={{
        theme,
        toggleTheme,
        boards,
        activeBoard,
        activeBoardId,
        setActiveBoardId,
        addBoard,
        tasks: filteredTasks,
        allTasks: tasks,
        syncStatus,
        refreshFromAPI,
        moveTask,
        addTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        addComment,
        addColumn,
        deleteColumn,
        updateColumnWip,
        searchQuery,
        setSearchQuery,
        selectedPriority,
        setSelectedPriority,
        selectedTag,
        setSelectedTag,
        selectedAssignee,
        setSelectedAssignee,
        sortBy,
        setSortBy,
        activeTaskModal,
        setActiveTaskModal,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isAnalyticsOpen,
        setIsAnalyticsOpen,
        isBoardModalOpen,
        setIsBoardModalOpen,
        createInitialColumn,
        setCreateInitialColumn,
        exportBoardJSON,
        importBoardJSON,
        resetToDefaultData
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => useContext(KanbanContext);
