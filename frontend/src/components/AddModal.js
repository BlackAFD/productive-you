import React, { useState, useEffect } from "react";

export default function AddModal({ open, onClose, modalType, onAdd }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Add {modalType}</h2>
        <input
          type="text"
          placeholder={`Enter ${modalType} name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          autoFocus
        />
        <div style={styles.buttons}>
          <button onClick={() => onAdd(name)} disabled={!name.trim()}>
            Add
          </button>
          <button onClick={onClose} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 300,
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    marginTop: 10,
    borderRadius: 5,
    border: "1px solid #ddd",
  },
  buttons: {
    marginTop: 15,
    display: "flex",
    justifyContent: "flex-end",
  },
};
