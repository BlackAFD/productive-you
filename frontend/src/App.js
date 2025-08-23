import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import EisenhowerMatrix from "./components/EisenhowerMatrix";
import AddModal from "./components/AddModal";
import WarningPopup from "./components/WarningPopup";
import AddTaskModal from "./components/AddTaskModal";

const tutorialSpace = {
  id: "tutorial",
  name: "Tutorial Space",
  folders: [
    {
      id: "applied-chemistry",
      name: "Applied Chemistry",
      sections: [
        {
          id: "DAs",
          name: "DAs",
          tasks: [
            {
              id: 1,
              title: "Finish DA2",
              completed: false,
              due: "2025-09-01",
              categories: ["urgent", "important"],
            },
          ],
        },
        {
          id: "Theory",
          name: "Theory",
          tasks: [
            {
              id: 2,
              title: "Study Chapter 12",
              completed: false,
              due: "2025-08-30",
              categories: ["important"],
            },
          ],
        },
        {
          id: "Lab",
          name: "Lab",
          tasks: [
            {
              id: 3,
              title: "Prepare Lab report",
              completed: false,
              due: "2025-09-05",
              categories: ["not urgent"],
            },
          ],
        },
      ],
      folders: [
        {
          id: "subfolder1",
          name: "Nested Folder (Not Recommended)",
          sections: [],
          folders: [],
        },
      ],
    },
  ],
};

export default function App() {
  const [spaces, setSpaces] = useState([tutorialSpace]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(tutorialSpace.id);
  const [selectedFolderPath, setSelectedFolderPath] = useState([tutorialSpace.folders[0].id]);
  const [view, setView] = useState("list");
  const [theme, setTheme] = useState("light");

  const [modalType, setModalType] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);

  function getSelectedFolder() {
    let currentSpace = spaces.find((s) => s.id === selectedSpaceId);
    if (!currentSpace) return null;
    let current = currentSpace;
    for (const id of selectedFolderPath) {
      if (!current.folders) return null;
      current = current.folders.find((f) => f.id === id);
      if (!current) return null;
    }
    return current;
  }
  const selectedFolder = getSelectedFolder();

  useEffect(() => {
    document.body.style.background = theme === "dark" ? "#121212" : "#f8f9fa";
    document.body.style.color = theme === "dark" ? "#eee" : "#222";
  }, [theme]);

  function addSpace(name) {
    const id = `space-${Date.now()}`;
    setSpaces((prev) => [...prev, { id, name, folders: [] }]);
    setSelectedSpaceId(id);
    setSelectedFolderPath([]);
  }

  function addFolder(name) {
    const id = `folder-${Date.now()}`;
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) => {
        if (space.id !== selectedSpaceId) return space;
        if (selectedFolderPath.length === 0) {
          return { ...space, folders: [...space.folders, { id, name, sections: [], folders: [] }] };
        } else {
          setWarningOpen(true);
          const updatedFolders = addNestedFolder(space.folders, selectedFolderPath, id, name);
          return { ...space, folders: updatedFolders };
        }
      })
    );
  }

  function addNestedFolder(folders, path, id, name) {
    if (path.length === 0) return folders;
    const [currentId, ...restPath] = path;
    return folders.map((folder) => {
      if (folder.id !== currentId) return folder;
      if (restPath.length === 0) {
        return { ...folder, folders: [...folder.folders, { id, name, sections: [], folders: [] }] };
      }
      return { ...folder, folders: addNestedFolder(folder.folders, restPath, id, name) };
    });
  }

  function addSection(name) {
    if (!selectedFolder) return;
    const id = `section-${Date.now()}`;
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) => {
        if (space.id !== selectedSpaceId) return space;
        const updatedFolders = updateSectionsInFolder(space.folders, selectedFolderPath, id, name);
        return { ...space, folders: updatedFolders };
      })
    );
  }

  function updateSectionsInFolder(folders, path, id, name) {
    if (path.length === 0) return folders;
    const [currentId, ...restPath] = path;
    return folders.map((folder) => {
      if (folder.id !== currentId) return folder;
      if (restPath.length === 0) {
        // Ensure sections is an array
        const sections = Array.isArray(folder.sections) ? folder.sections : [];
        return { ...folder, sections: [...sections, { id, name, tasks: [] }] };
      }
      return { ...folder, folders: updateSectionsInFolder(folder.folders, restPath, id, name) };
    });
  }

  function addTask(title, due, categories) {
    if (!selectedFolder) return;
    const id = `task-${Date.now()}`;
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) => {
        if (space.id !== selectedSpaceId) return space;
        const updatedFolders = updateTasksInFolder(space.folders, selectedFolderPath, id, title, due, categories);
        return { ...space, folders: updatedFolders };
      })
    );
  }

function updateTasksInFolder(folders, path, taskId, title, due, categories) {
  if (path.length === 0) return folders;
  const [currentId, ...restPath] = path;
  return folders.map((folder) => {
    if (folder.id !== currentId) return folder;

    if (restPath.length === 0) {
      // Ensure folder.sections is an array
      const newSections = Array.isArray(folder.sections) ? [...folder.sections] : [];

      // If no sections exist, create a default one
      if (newSections.length === 0) {
        newSections.push({ id: "section-1", name: "General", tasks: [] });
      }

      const firstSection = newSections[0];
      const existingTasks = Array.isArray(firstSection.tasks) ? firstSection.tasks : [];

      // Create updated first section with new tasks
      const updatedFirstSection = {
        ...firstSection,
        tasks: [...existingTasks, { id: taskId, title, completed: false, due, categories }],
      };

      // Create new sections array with updated first section
      const updatedSections = [updatedFirstSection, ...newSections.slice(1)];

      return { ...folder, sections: updatedSections };
    }

    return {
      ...folder,
      folders: updateTasksInFolder(folder.folders, restPath, taskId, title, due, categories),
    };
  });
}

 

  function selectFolderPath(newPath) {
    setSelectedFolderPath(newPath);
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        spaces={spaces}
        selectedSpaceId={selectedSpaceId}
        setSelectedSpaceId={setSelectedSpaceId}
        selectedFolderPath={selectedFolderPath}
        selectFolderPath={selectFolderPath}
        addFolder={() => {
          if (selectedFolderPath.length >= 1) setWarningOpen(true);
          const name = prompt("Enter folder name:");
          if (name) addFolder(name);
        }}
        addSpace={() => {
          const name = prompt("Enter space name:");
          if (name) addSpace(name);
        }}
        addSection={() => {
          if (!selectedFolder) return;
          const name = prompt("Enter section name:");
          if (name) addSection(name);
        }}
        onAddTask={() => setTaskModalOpen(true)}
        theme={theme}
      />
      <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <Header view={view} setView={setView} theme={theme} setTheme={setTheme} />
        {selectedFolder ? (
          view === "list" ? (
            <TaskList sections={selectedFolder.sections} theme={theme} />
          ) : (
            <EisenhowerMatrix sections={selectedFolder.sections} theme={theme} />
          )
        ) : (
          <p>No folder selected</p>
        )}
      </main>

      <AddModal
        open={modalType !== null}
        onClose={() => setModalType(null)}
        modalType={modalType}
        onAdd={(name) => {
          if (modalType === "space") addSpace(name);
          else if (modalType === "folder") addFolder(name);
          else if (modalType === "section") addSection(name);
          setModalType(null);
        }}
      />

      <AddTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onAdd={addTask}
      />

      <WarningPopup open={warningOpen} onClose={() => setWarningOpen(false)} />
    </div>
  );
}
