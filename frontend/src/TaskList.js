import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks.length) return <div style={{ textAlign: "center" }}>No tasks!</div>;
  return (
    <ul style={{ padding:0, listStyle:"none" }}>
      {tasks.map(task =>
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      )}
    </ul>
  );
}
