import React from 'react';
import './styles/index.css';
import './styles/App.css';
import { KanbanProvider } from './context/KanbanContext';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskModal } from './components/TaskModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { BoardModal } from './components/BoardModal';

function App() {
  return (
    <KanbanProvider>
      <div className="app-container">
        <Header />
        <FilterBar />
        <KanbanBoard />
        <TaskModal />
        <AnalyticsModal />
        <BoardModal />
      </div>
    </KanbanProvider>
  );
}

export default App;
