import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPage('dashboard');
  };

  const handleNavigate = (targetPage, project = null) => {
    if (project) setSelectedProject(project);
    setPage(targetPage);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (page === 'dashboard') {
    return <DashboardPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (page === 'projects') {
    return <ProjectsPage user={user} onNavigate={handleNavigate} />;
  }

  if (page === 'tasks' && selectedProject) {
    return <TasksPage user={user} project={selectedProject} onNavigate={handleNavigate} />;
  }

  return <DashboardPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
}

export default App;