import React from "react";
import TaskItem from "./TaskItem";

// Helper to categorize tasks into matrix quadrants
function getQuadrant(tasks, urgent, important) {
  return tasks.filter(task =>
    (task.categories.includes(urgent ? "urgent" : "not urgent")) &&
    (task.categories.includes(important ? "important" : "not important"))
  );
}

export default function EisenhowerMatrix({ tasks, onToggle, onDelete }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
      <div style={boxStyle}><h3>Urgent & Important</h3>
        <TaskListColumn ts={getQuadrant(tasks, true, true)} onToggle={onToggle} onDelete={onDelete} />
      </div>
      <div style={boxStyle}><h3>Not Urgent & Important</h3>
        <TaskListColumn ts={getQuadrant(tasks, false, true)} onToggle={onToggle} onDelete={onDelete} />
      </div>
      <div style={boxStyle}><h3>Urgent & Not Important</h3>
        <TaskListColumn ts={getQuadrant(tasks, true, false)} onToggle={onToggle} onDelete={onDelete} />
      </div>
      <div style={boxStyle}><h3>Not Urgent & Not Important</h3>
        <TaskListColumn ts={getQuadrant(tasks, false, false)} onToggle={onToggle} onDelete={onDelete} />
      </div>
    </div>
  );
}

function TaskListColumn({ ts, onToggle, onDelete }) {
  return ts.length
    ? <ul style={{ listStyle: "none", padding:0 }}>{ts.map(t => <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />)}</ul>
    : <div style={{ fontSize:13, color:"#888" }}>No tasks</div>;
}

const boxStyle = {
  border: "1px solid #aaa",
  borderRadius: 6,
  minHeight: 120,
  background: "#f0f6f7",
  padding: 10,
};
