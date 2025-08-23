import React from "react";
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li style={{
      background: task.completed ? "#cde4d8" : "#e7e8ef", marginBottom:10, padding:"10px 10px", borderRadius:6, display:"flex", justifyContent:"space-between"
    }}>
      <div>
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
        <span style={{ marginLeft:8, textDecoration: task.completed ? "line-through" : "none", fontWeight:500 }}>{task.title}</span>
        {task.due && <span style={{ marginLeft: 16, fontSize:12, color:"#666" }}>Due: {task.due}</span>}
        {task.categories && task.categories.length > 0 && (
          <span style={{ marginLeft:16, fontSize:12, color:"#4d789b" }}>
            [{task.categories.join(", ")}]
          </span>
        )}
        <div style={{ fontSize:13, color:"#333", marginLeft:24 }}>{task.description}</div>
      </div>
      <button onClick={() => onDelete(task.id)} style={{color:"#b92b27", border:"none", background:"none", fontSize:20}}>✖</button>
    </li>
  );
}
