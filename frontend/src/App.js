import React, { useState, useEffect } from "react";

// Stylish color palette (feel free to customize)
const COLORS = {
  light: {
    bg: "#f9fbfc",
    card: "#ffffff",
    text: "#22223b",
    accent: "#0097b2",
    border: "#e0e4ea",
    faded: "#898a92",
    complete: "#bfe6ec",
  },
  dark: {
    bg: "#171922",
    card: "#24273a",
    text: "#f7f7ff",
    accent: "#62e6e8",
    border: "#2c2f43",
    faded: "#bbbcd1",
    complete: "#273b47",
  }
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("list");
  const [theme, setTheme] = useState("light");

  const colors = COLORS[theme];

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  useEffect(() => {
    document.body.style.background = colors.bg;
    document.body.style.color = colors.text;
  }, [theme, colors.bg, colors.text]);

  // --- Backend API Methods ---
  const api = "http://127.0.0.1:5000/api/tasks";

  const addTask = async (task) => {
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    const res = await fetch(`${api}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`${api}/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // --- UI Components ---
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: colors.bg,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "24px 0 12px",
          textAlign: "center",
          background: colors.card,
          boxShadow: `0 2px 8px ${colors.border}`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2.2rem",
            letterSpacing: 1,
            color: colors.accent,
            fontWeight: 800,
          }}
        >
          🚀 Productive You
        </h1>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => setView("list")}
            style={navBtnStyle(view === "list", colors)}
          >
            List View
          </button>
          <button
            onClick={() => setView("matrix")}
            style={navBtnStyle(view === "matrix", colors)}
          >
            Eisenhower Matrix
          </button>
        </div>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            position: "absolute",
            right: 24,
            top: 24,
            background: colors.accent,
            color: colors.card,
            border: "none",
            borderRadius: 16,
            fontSize: 17,
            fontWeight: "bold",
            cursor: "pointer",
            padding: "6px 16px"
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      {/* Main content */}
      <main
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          marginTop: 32,
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: 600,
            background: colors.card,
            borderRadius: 16,
            padding: 28,
            boxShadow: `0 4px 32px ${colors.border}`,
            marginBottom: 40,
          }}
        >
          <AddTask onAdd={addTask} colors={colors} />
          {view === "list"
            ? (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                colors={colors}
              />
            )
            : (
              <EisenhowerMatrix
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                colors={colors}
              />
            )}
        </section>
        <footer style={{ marginTop: "auto", color: colors.faded, fontSize: 14, paddingBottom: 14 }}>
          &copy; {new Date().getFullYear()} Productive You | Your College Club Project
        </footer>
      </main>
    </div>
  );
}

// --- AddTask Component ---
function AddTask({ onAdd, colors }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [cats, setCats] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const categories = cats.split(",").map(s => s.trim()).filter(Boolean);
    onAdd({ title, description: desc, due, categories });
    setTitle(""); setDesc(""); setDue(""); setCats("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
      <input style={inputStyle(colors)} placeholder="New task title…" value={title} onChange={e => setTitle(e.target.value)} required />
      <input style={inputStyle(colors)} placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} />
      <div style={{ display: "flex", gap: 12 }}>
        <input
          type="date"
          style={{ ...inputStyle(colors), flex: 2 }}
          value={due}
          onChange={e => setDue(e.target.value)}
        />
        <input
          style={{ ...inputStyle(colors), flex: 3 }}
          placeholder="Categories (comma-separated)"
          value={cats}
          onChange={e => setCats(e.target.value)}
        />
        <button
          type="submit"
          style={{
            background: colors.accent,
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            color: colors.card,
            fontSize: 17,
            padding: "8px 16px",
            marginLeft: 10,
            cursor: "pointer"
          }}
        >
          Add
        </button>
      </div>
    </form>
  );
}

// --- TaskList Component ---
function TaskList({ tasks, onToggle, onDelete, colors }) {
  if (!tasks.length)
    return <div style={{ color: colors.faded, textAlign: "center" }}>No tasks yet! 🎉</div>;
  // Sort: incomplete before completed, then earliest due date first
  const sorted = [...tasks].sort((a, b) =>
    a.completed - b.completed || new Date(a.due || "2250-01-01") - new Date(b.due || "2250-01-01")
  );
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {sorted.map(task =>
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} colors={colors} />
      )}
    </ul>
  );
}

// --- TaskItem Component ---
function TaskItem({ task, onToggle, onDelete, colors }) {
  return (
    <li
      style={{
        marginBottom: 16,
        padding: "16px 20px",
        borderRadius: 12,
        background: task.completed ? colors.complete : colors.card,
        boxShadow: `0 1.5px 5px ${colors.border}`,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between"
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          style={{ width: 19, height: 19, accentColor: colors.accent, cursor: "pointer" }}
        />
        <div>
          <div style={{
            color: colors.text,
            fontWeight: 600,
            fontSize: 17,
            textDecoration: task.completed ? "line-through" : "none"
          }}>
            {task.title}
          </div>
          {task.description && <div style={{ marginBottom:2, fontSize:15, color: colors.faded }}>{task.description}</div>}
          <div style={{ fontSize: 13, color: colors.faded }}>
            {task.due && <span>Due: {task.due}  </span>}
            {task.categories && task.categories.length > 0 && (
              <span>[{task.categories.join(", ")}]</span>
            )}
          </div>
        </div>
      </label>
      <button onClick={() => onDelete(task.id)}
        style={{
          marginLeft: 10, background: "none", border: "none", color: "#c86464",
          fontSize: 26, fontWeight: 800, cursor: "pointer"
        }}
        aria-label="Delete"
      >
        ×
      </button>
    </li>
  );
}

// --- Eisenhower Matrix View ---
function EisenhowerMatrix({ tasks, onToggle, onDelete, colors }) {
  function filterMatrix(u, im) {
    return tasks.filter(t =>
      t.categories.includes(u ? "urgent" : "not urgent") &&
      t.categories.includes(im ? "important" : "not important")
    );
  }
  const quadrants = [
    { name: "Urgent & Important", urgent: true, important: true },
    { name: "Not Urgent & Important", urgent: false, important: true },
    { name: "Urgent & Not Important", urgent: true, important: false },
    { name: "Not Urgent & Not Important", urgent: false, important: false }
  ];

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16,
    }}>
      {quadrants.map(q =>
        <div
          key={q.name}
          style={{
            background: colors.bg,
            border: `1.5px solid ${colors.accent}`,
            borderRadius: 12,
            padding: "16px 8px 8px 8px",
            minHeight: 150,
          }}
        >
          <div style={{ fontWeight: 700, color: colors.accent, marginBottom: 7 }}>{q.name}</div>
          <TaskList
            tasks={filterMatrix(q.urgent, q.important)}
            onToggle={onToggle}
            onDelete={onDelete}
            colors={colors}
          />
        </div>
      )}
    </div>
  );
}

// --- Helper styles ---
function navBtnStyle(selected, colors) {
  return {
    background: selected ? colors.accent : colors.border,
    color: selected ? colors.card : colors.text,
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: "1px",
    padding: "8px 18px",
    marginRight: 7,
    cursor: "pointer",
    transition: "background .2s"
  };
}
function inputStyle(colors) {
  return {
    border: `1.5px solid ${colors.border}`,
    borderRadius: 7,
    padding: "8px 12px",
    fontSize: 15,
    background: colors.card,
    color: colors.text
  };
}
