// API Service for Kanban Task Management Board
// Integrates with REST API (https://dummyjson.com/todos) and handles fallback/local sync.

const API_BASE_URL = 'https://dummyjson.com/todos';

// Sample categories & assignees for transforming simple API items into rich Kanban tasks
const TAG_POOL = ['frontend', 'backend', 'design', 'bug', 'feature', 'devops'];
const PRIORITIES = ['urgent', 'high', 'medium', 'low'];
const ASSIGNEES = [
  { name: 'Alex Rivera', avatar: 'AR' },
  { name: 'Sarah Chen', avatar: 'SC' },
  { name: 'Devon Vance', avatar: 'DV' },
  { name: 'Elena Rostova', avatar: 'ER' },
  { name: 'Marcus Brody', avatar: 'MB' }
];

/**
 * Maps raw API todos into rich Kanban task format
 */
const mapApiTodoToKanbanTask = (todo, index) => {
  // Distribute tasks across 4 columns: todo, in_progress, review, completed
  let status = 'todo';
  if (todo.completed) {
    status = 'completed';
  } else if (index % 4 === 1) {
    status = 'in_progress';
  } else if (index % 4 === 2) {
    status = 'review';
  }

  const priority = PRIORITIES[index % PRIORITIES.length];
  const tag = TAG_POOL[index % TAG_POOL.length];
  const assignee = ASSIGNEES[index % ASSIGNEES.length];

  // Due date generator: between today and +7 days
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (index % 5) - 1);

  return {
    id: `task-${todo.id || index + 1}`,
    apiId: todo.id,
    title: todo.todo || `Task Item ${index + 1}`,
    description: `Task imported via DummyJSON API. Optimize implementation and review test coverage for #${todo.id}.`,
    status,
    priority,
    tags: [tag, index % 2 === 0 ? 'feature' : 'bug'],
    assignee,
    dueDate: dueDate.toISOString().split('T')[0],
    subtasks: [
      { id: `st-${todo.id}-1`, title: 'Initial architectural review', completed: true },
      { id: `st-${todo.id}-2`, title: 'Implement logic & unit tests', completed: todo.completed },
      { id: `st-${todo.id}-3`, title: 'Deploy to staging & verify', completed: false }
    ],
    comments: [
      { id: `c-${todo.id}-1`, author: assignee.name, text: 'Working on initial draft for this ticket.', timestamp: '2 hours ago' }
    ],
    activityLog: [
      { id: `a-${todo.id}-1`, action: 'Task created via REST API sync', timestamp: new Date().toLocaleTimeString() }
    ],
    createdAt: new Date().toISOString()
  };
};

/**
 * Fetch initial tasks from REST API
 */
export const fetchApiTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}?limit=12`);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const data = await response.json();
    if (data && data.todos && Array.isArray(data.todos)) {
      return data.todos.map((todo, idx) => mapApiTodoToKanbanTask(todo, idx));
    }
    return getFallbackTasks();
  } catch (error) {
    console.warn('API Fetch failed, using default task set:', error);
    return getFallbackTasks();
  }
};

/**
 * Create Task API call (Simulated POST)
 */
export const createTaskAPI = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: taskData.title,
        completed: taskData.status === 'completed',
        userId: 5
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('API Task Creation fallback:', error);
    return { id: Date.now(), todo: taskData.title };
  }
};

/**
 * Update Task API call (Simulated PUT)
 */
export const updateTaskAPI = async (taskId, updates) => {
  try {
    const numericId = typeof taskId === 'number' ? taskId : 1;
    const response = await fetch(`${API_BASE_URL}/${numericId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: updates.title,
        completed: updates.status === 'completed'
      })
    });
    return await response.json();
  } catch (error) {
    console.warn('API Task Update fallback:', error);
    return { success: true };
  }
};

/**
 * Delete Task API call (Simulated DELETE)
 */
export const deleteTaskAPI = async (taskId) => {
  try {
    const numericId = typeof taskId === 'number' ? taskId : 1;
    const response = await fetch(`${API_BASE_URL}/${numericId}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.warn('API Task Delete fallback:', error);
    return { isDeleted: true };
  }
};

/**
 * Fallback static tasks if network is unavailable
 */
export const getFallbackTasks = () => [
  {
    id: 'task-101',
    title: 'Design System Glassmorphic Polish',
    description: 'Refine color tokens, dark mode contrast, and hover micro-animations.',
    status: 'todo',
    priority: 'high',
    tags: ['design', 'frontend'],
    assignee: ASSIGNEES[0],
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'st-1', title: 'Define HSL color variables', completed: true },
      { id: 'st-2', title: 'Add dark/light theme switchers', completed: true },
      { id: 'st-3', title: 'Test responsive viewports', completed: false }
    ],
    comments: [
      { id: 'c-1', author: 'Alex Rivera', text: 'Color tokens looking sharp!', timestamp: '10:30 AM' }
    ],
    activityLog: [
      { id: 'a-1', action: 'Task initialized', timestamp: '10:00 AM' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-102',
    title: 'Integrate REST API Synchronization',
    description: 'Connect task management actions to DummyJSON REST endpoints with sync status indicator.',
    status: 'in_progress',
    priority: 'urgent',
    tags: ['backend', 'feature'],
    assignee: ASSIGNEES[1],
    dueDate: new Date().toISOString().split('T')[0],
    subtasks: [
      { id: 'st-4', title: 'Setup fetchApiTasks endpoint', completed: true },
      { id: 'st-5', title: 'Handle POST & PUT mutations', completed: true },
      { id: 'st-6', title: 'Add offline localStorage fallback', completed: true }
    ],
    comments: [
      { id: 'c-2', author: 'Sarah Chen', text: 'Endpoints tested and active.', timestamp: '11:15 AM' }
    ],
    activityLog: [
      { id: 'a-2', action: 'Moved to In Progress', timestamp: '11:00 AM' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-103',
    title: 'HTML5 Drag and Drop Reordering',
    description: 'Implement column drop zones and instant state updates with visual drop feedback.',
    status: 'review',
    priority: 'medium',
    tags: ['frontend', 'feature'],
    assignee: ASSIGNEES[2],
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    subtasks: [
      { id: 'st-7', title: 'Add dragStart and dragOver handlers', completed: true },
      { id: 'st-8', title: 'Highlight column drop target', completed: true }
    ],
    comments: [],
    activityLog: [
      { id: 'a-3', action: 'Moved to Review', timestamp: '12:00 PM' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-104',
    title: 'Analytics & Productivity Visualizer',
    description: 'Create metrics modal showing total tasks, completion rates, and priority charts.',
    status: 'completed',
    priority: 'low',
    tags: ['feature'],
    assignee: ASSIGNEES[3],
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'st-9', title: 'Build status breakdown graph', completed: true },
      { id: 'st-10', title: 'Calculate velocity metric', completed: true }
    ],
    comments: [],
    activityLog: [
      { id: 'a-4', action: 'Task completed', timestamp: '01:00 PM' }
    ],
    createdAt: new Date().toISOString()
  }
];
