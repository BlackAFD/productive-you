import React, { useState } from "react";

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [categories, setCategories] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    let cats = categories
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    onAdd({title, description, due, categories: cats});
    setTitle(""); setDescription(""); setDue(""); setCategories("");
  };

  return (
    <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom:24 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" required style={{padding:6}} />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" style={{padding:6}} />
      <input type="date" value={due} onChange={e => setDue(e.target.value)} style={{padding:6}} />
      <input value={categories} onChange={e => setCategories(e.target.value)} placeholder="Categories (comma-separated)" style={{padding:6}} />
      <button type="submit" style={{padding:8}}>Add Task</button>
    </form>
  );
}
