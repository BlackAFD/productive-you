import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ sections, theme }) {
  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          style={{
            marginBottom: 28,
            background: theme === "dark" ? "#222" : "#fff",
            padding: 15,
            borderRadius: 12,
            boxShadow: theme === "dark"
              ? "none"
              : "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3>{section.name}</h3>
          <ul style={{ padding: 0, marginTop: 12 }}>
            {section.tasks.map((task) => (
              <TaskItem key={task.id} task={task} theme={theme} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
