import React from "react";

export default function Header({ view, setView, theme, setTheme }) {
  const isDark = theme === "dark";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 22,
        alignItems: "center",
      }}
    >
      <div>
        <button
          onClick={() => setView("list")}
          style={btnStyle(isDark, view === "list")}
        >
          List View
        </button>
        <button
          onClick={() => setView("matrix")}
          style={btnStyle(isDark, view === "matrix")}
        >
          Eisenhower Matrix
        </button>
      </div>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        style={{
          padding: "8px 14px",
          cursor: "pointer",
          background: isDark ? "#333" : "#ddd",
          border: "none",
          borderRadius: 6,
        }}
      >
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}

function btnStyle(isDark, selected) {
  return {
    padding: "8px 16px",
    marginRight: 10,
    cursor: "pointer",
    borderRadius: 6,
    border: selected ? "2px solid #007bff" : "1px solid #aaa",
    background: selected ? "#007bff" : isDark ? "#333" : "#fafafa",
    color: selected ? "#fff" : isDark ? "#eee" : "#222",
    fontWeight: selected ? "bold" : "normal",
  };
}
