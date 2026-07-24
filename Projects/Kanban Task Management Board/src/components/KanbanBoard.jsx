import React from 'react';
import { useKanban } from '../context/KanbanContext';
import { KanbanColumn } from './KanbanColumn';
import { Plus } from 'lucide-react';

export const KanbanBoard = () => {
  const { activeBoard, tasks, addColumn } = useKanban();

  const handleAddColumn = () => {
    const title = prompt('Enter new column name:');
    if (title) {
      const color = prompt('Column accent color hex (e.g. #6366f1, #ec4899, #06b6d4):', '#6366f1');
      const wip = prompt('WIP Limit (0 for unlimited):', '5');
      addColumn(title, color || '#6366f1', wip || 5);
    }
  };

  return (
    <main className="board-main">
      {activeBoard &&
        activeBoard.columns &&
        activeBoard.columns.map(column => (
          <KanbanColumn key={column.id} column={column} tasks={tasks} />
        ))}

      <button className="add-column-btn" onClick={handleAddColumn}>
        <Plus size={20} />
        <span>Add Column</span>
      </button>
    </main>
  );
};
