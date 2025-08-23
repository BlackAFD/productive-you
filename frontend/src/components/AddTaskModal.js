import React, { useState, useEffect } from "react";

export default function AddTaskModal({ open, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [categories, setCategories] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setDue("");
      setCategories("");
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    // categories split by comma, trimmed
    const cats = categories.split(",").map((c) => c.trim()).filter(Boolean);
    onAdd(title.trim(), due, cats);
    onClose();
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <form style={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Add Task</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          style={styles.input}
          autoFocus
          required
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          style={{ ...styles.input, marginTop: 10 }}
        />
        <input
          type="text"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          placeholder="Categories (comma separated)"
          style={{ ...styles.input, marginTop: 10, marginBottom: 20 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" style={styles.button}>
            Add
          </button>
          <button type="button" onClick={onClose} style={{ ...styles.button, marginLeft: 10, background: "#bbb" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 101,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    width: 320,
    boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  button: {
    backgroundColor: "#007bff",
    border: "none",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },
};
