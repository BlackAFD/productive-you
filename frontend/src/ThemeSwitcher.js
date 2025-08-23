import React from "react";
export default function ThemeSwitcher({ theme, setTheme }) {
  return (
    <div style={{ textAlign: "right", marginBottom: 10 }}>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
        fontSize: 14, padding: "6px", borderRadius: 4, border: "none",
        background: theme === "dark" ? "#313148" : "#d3d3ff", color: theme === "dark" ? "#fff" : "#232323"
      }}>
        {theme === "dark" ? "🌞 Light Theme" : "🌙 Dark Theme"}
      </button>
    </div>
  );
}
    