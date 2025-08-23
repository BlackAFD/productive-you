import React, { useEffect } from "react";

export default function WarningPopup({ open, onClose }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={styles.popup}>
      <p>
        Warning: Deep folder nesting is not recommended. Try using sections instead.
      </p>
    </div>
  );
}

const styles = {
  popup: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ffcc00",
    color: "#222",
    padding: "12px 20px",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    fontWeight: "bold",
    minWidth: 280,
    zIndex: 1000,
  },
};
