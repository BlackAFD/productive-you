import React, { useState } from "react";

export default function Sidebar({
  spaces,
  selectedSpaceId,
  setSelectedSpaceId,
  selectedFolderPath,
  selectFolderPath,
  addFolder,
  addSpace,
  addSection,
  onAddTask,  // New
  theme,
}) {
  const isDark = theme === "dark";

  function handleFolderClick(spaceId, folderPath, folderId) {
    selectFolderPath(folderPath);
  }

  function renderFolders(folders, path = []) {
    return folders.map((folder) => {
      const currentPath = [...path, folder.id];
      const isSelected = JSON.stringify(currentPath) === JSON.stringify(selectedFolderPath);
      return (
        <div key={folder.id} style={{ marginLeft: 16 }}>
          <div
            style={{
              cursor: "pointer",
              color: isSelected ? "#007bff" : isDark ? "#aaa" : "#444",
              fontWeight: isSelected ? "bold" : "normal",
              userSelect: "none",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
            }}
            onClick={() => handleFolderClick(selectedSpaceId, currentPath, folder.id)}
            title={folder.name}
          >
            {/* Slim folder icon */}
            <span role="img" aria-label="folder" style={{ fontSize: 14 }}>
              📁
            </span>
            {folder.name}
          </div>
          {folder.folders && folder.folders.length > 0 && renderFolders(folder.folders, currentPath)}
        </div>
      );
    });
  }

  return (
    <aside
      style={{
        width: 280,
        background: isDark ? "#1f1f1f" : "#fff",
        borderRight: isDark ? "1px solid #333" : "1px solid #ddd",
        color: isDark ? "#ccc" : "#222",
        padding: 20,
        overflowY: "auto",
      }}
    >
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h2>Spaces</h2>
        <button onClick={addSpace} title="Add Space" style={{ cursor: "pointer" }}>
          ➕
        </button>
      </div>

      {spaces.map((space) => {
        const isSelectedSpace = space.id === selectedSpaceId;
        return (
          <div key={space.id} style={{ marginBottom: 24 }}>
            <div
              onClick={() => setSelectedSpaceId(space.id)}
              style={{
                cursor: "pointer",
                fontWeight: isSelectedSpace ? "bold" : "normal",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 16,
              }}
            >
              🌌 {space.name}
            </div>

            {isSelectedSpace && (
              <>
                <div style={{ marginLeft: 16, marginTop: 8 }}>
                  {renderFolders(space.folders)}
                  <button onClick={addFolder} title="Add Folder" style={{ marginTop: 6, cursor: "pointer", fontSize: 14 }}>
                    ➕ Add Folder
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}

      {selectedFolderPath.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <button onClick={addSection} title="Add Section" style={{ cursor: "pointer", fontSize: 14 }}>
            ➕ Add Section
          </button>
          <button onClick={onAddTask} title="Add Task" style={{ cursor: "pointer", marginTop: 8, fontSize: 14 }}>
            ➕ Add Task
          </button>
          <small style={{ display: "block", color: isDark ? "#666" : "#999", marginTop: 4 }}>
            Add tasks inside selected folder's first section
          </small>
        </div>
      )}
    </aside>
  );
}
