import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'team-task-manager-production-46bc.up.railway.app';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

function ProjectsPage({ user, onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

useEffect(() => {
    fetchProjects();
    if (user.role === 'ADMIN') fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchProjects = () => axios.get(`${API_URL}/projects`, { headers: getHeaders() }).then(r => setProjects(r.data));
  const fetchUsers = () => axios.get(`${API_URL}/projects/users/all`, { headers: getHeaders() }).then(r => setAllUsers(r.data));

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/projects`, form, { headers: getHeaders() });
    setForm({ name: '', description: '' });
    setShowForm(false);
    fetchProjects();
  };

  const handleAddMember = async (projectId, memberId) => {
    await axios.post(`${API_URL}/projects/${projectId}/members`, { memberId }, { headers: getHeaders() });
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete project?')) return;
    await axios.delete(`${API_URL}/projects/${id}`, { headers: getHeaders() });
    fetchProjects();
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f0f2f5'}}>
      <div style={{backgroundColor:'#1a73e8',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{color:'white',margin:0}}>Task Manager</h2>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <button style={navBtnStyle} onClick={() => onNavigate('dashboard')}>Dashboard</button>
          <span style={{color:'white',fontSize:'14px'}}>👤 {user.name} ({user.role})</span>
          <button style={{padding:'8px 16px',backgroundColor:'white',color:'#1a73e8',border:'none',borderRadius:'6px',cursor:'pointer'}} onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</button>
        </div>
      </div>
      <div style={{padding:'24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <h3 style={{color:'#333',margin:0}}>Projects</h3>
          {user.role === 'ADMIN' && <button style={addBtnStyle} onClick={() => setShowForm(!showForm)}>+ New Project</button>}
        </div>
        {showForm && (
          <div style={formCardStyle}>
            <form onSubmit={handleCreate}>
              <input style={inputStyle} placeholder="Project Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <input style={inputStyle} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <div style={{display:'flex',gap:'12px'}}>
                <button type="submit" style={addBtnStyle}>Create</button>
                <button type="button" style={{padding:'10px 24px',backgroundColor:'#f0f2f5',border:'none',borderRadius:'8px',cursor:'pointer'}} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        {projects.length === 0 ? <p style={{textAlign:'center',color:'#999'}}>No projects yet</p> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:'20px'}}>
            {projects.map(p => (
              <div key={p.id} style={{backgroundColor:'white',padding:'20px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <h4 style={{margin:'0 0 8px',color:'#333'}}>{p.name}</h4>
                  {user.role === 'ADMIN' && p.ownerId === user.id && <button style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px'}} onClick={() => handleDelete(p.id)}>🗑️</button>}
                </div>
                <p style={{color:'#666',fontSize:'14px',margin:'0 0 8px'}}>{p.description || 'No description'}</p>
                <p style={{color:'#888',fontSize:'13px',margin:'0 0 12px'}}>👥 {p.memberIds.length} members</p>
                {user.role === 'ADMIN' && p.ownerId === user.id && (
                  <select style={{width:'100%',padding:'8px',border:'1px solid #ddd',borderRadius:'6px',marginBottom:'12px',cursor:'pointer'}}
                    onChange={e => { if(e.target.value) { handleAddMember(p.id, e.target.value); e.target.value=''; }}}>
                    <option value="">+ Add Member</option>
                    {allUsers.filter(u => u.id !== user.id && !p.memberIds.includes(u.id)).map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                )}
                <button style={{width:'100%',padding:'10px',backgroundColor:'#e8f0fe',color:'#1a73e8',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}} onClick={() => onNavigate('tasks', p)}>
                  View Tasks →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const navBtnStyle = {padding:'8px 16px',backgroundColor:'rgba(255,255,255,0.2)',color:'white',border:'1px solid white',borderRadius:'6px',cursor:'pointer'};
const addBtnStyle = {padding:'10px 20px',backgroundColor:'#1a73e8',color:'white',border:'none',borderRadius:'8px',cursor:'pointer'};
const inputStyle = {width:'100%',padding:'10px',marginBottom:'12px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',boxSizing:'border-box'};
const formCardStyle = {backgroundColor:'white',padding:'24px',borderRadius:'10px',marginBottom:'24px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'};

export default ProjectsPage;