import React from 'react';
import TaskPageTemplate from './TaskPageTemplate';

export default function CompletedTasksPage() {
  return <TaskPageTemplate 
    title="Completed Tasks" 
    filterFn={(task) => task.completed} 
  />;
}
