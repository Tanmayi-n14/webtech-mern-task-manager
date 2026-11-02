import React from 'react';
import TaskPageTemplate from './TaskPageTemplate';

export default function PendingTasksPage() {
  return <TaskPageTemplate 
    title="Pending Tasks" 
    filterFn={(task) => !task.completed}
  />;
}
