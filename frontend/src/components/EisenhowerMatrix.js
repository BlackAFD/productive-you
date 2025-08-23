import React from "react";
import TaskItem from "./TaskItem";

export default function EisenhowerMatrix({ sections, theme }) {
  let quadrants = {
    "Urgent & Important": [],
    "Not Urgent & Important": [],
    "Urgent & Not Important": [],
    "Not Urgent & Not Important": [],
  };

  sections.forEach((section) => {
    section.tasks.forEach((task) => {
      const title = task.title.toLowerCase();
      if (title.includes("urgent") && title.includes("important")) {
        quadrants["Urgent & Important"].push(task);
      } else if (title.includes("important")) {
        quadrants["Not Urgent & Important"].push(task);
      } else if (title.includes("urgent")) {
        quadrants["Urgent & Not Important"].push(task);
      } else {
        quadrants["Not Urgent & Not Important"].push(task);
      }
    });
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}
    >
      {Object.entries(quadrants).map(([name, tasks]) => (
        <section
          key={name}
          style={{
            backgroundColor: theme === "dark" ? "#222" : "#fff",
            padding: 15,
            borderRadius: 12,
            boxShadow: theme === "dark"
              ? "none"
              : "0 2px 8px rgba(0,0,0,0.1)",
            minHeight: 180,
          }}
        >
          <h4 style={{ marginBottom: 12 }}>{name}</h4>
          {tasks.length ? (
            <ul style={{ padding: 0, margin: 0 }}>
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} theme={theme} />
              ))}
            </ul>
          ) : (
            <p style={{ color: theme === "dark" ? "#888" : "#aaa" }}>
              No tasks here.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
