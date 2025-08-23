import React from "react";

export default function TaskItem({ task, theme }) {
  return (
    <li
      style={{
        listStyle: "none",
        padding: "10px 12px",
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: task.completed
          ? theme === "dark"
            ? "#444"
            : "#d3d3d3"
          : "transparent",
        textDecoration: task.completed ? "line-through" : "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px"
      }}
    >
      <span style={{ fontWeight: "bold" }}>{task.title}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {task.categories?.map((cat) => (
          <span
            key={cat}
            style={{
              background: theme === "dark" ? "#555" : "#eee",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 12,
              color: theme === "dark" ? "#eee" : "#444",
              userSelect: "none"
            }}
          >
            {cat}
          </span>
        ))}
        {task.due && (
          <span style={{ fontSize: 12, color: theme === "dark" ? "#aaa" : "#666" }} title={`Due: ${task.due}`}>
            📅 {task.due}
          </span>
        )}
      </div>
    </li>
  );
}
