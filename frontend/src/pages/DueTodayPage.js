import React from 'react';
import TaskPageTemplate from './TaskPageTemplate';

export default function DueTodayPage() {
  const todayStr = new Date().toISOString().split('T')[0];
  return <TaskPageTemplate
    title="Tasks Due Today"
    filterFn={(task) => task.dueDate === todayStr}
  />;
}
