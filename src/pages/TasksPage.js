import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://team-task-manager-production-46bc.up.railway.app/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

function TasksPage({ user, project, onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', assignedToId:'', priority:'MEDIUM', dueDate:'' });

useEffect(() => {
    fetchTasks();
    fetchMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchTasks = () => axios.get(`${API_URL}/tasks/project/${project.id}`, { headers: getHeaders() }).then(r => setTasks(r.data));

  const fetchMembers = async () => {
    const r = await axios.get(`${API_URL}/projects/${project.id}`, { headers: getHeaders() });
    const allUsers = await axios.get(`${API_URL}/projects/users/all`, { headers: getHeaders() });
    setMembers(allUsers.data.filter(u => r.data.memberIds.includes(u.id) || u.id === r.data.ownerId));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {...form};
    if (payload.dueDate) payload.dueDate = new Date(payload.dueDate).toISOString();
    await axios.post(`${API_URL}/tasks/project/${project.id}`, payload, { headers: getHeaders() });
    setForm({ title:'', description:'', assignedToId:'', priority:'MEDIUM', dueDate:'' });
    setShowForm(false);
    fetchTasks();
  };

  const handleStatus = async (id, status) => {
    await axios.patch(`${API_URL}/tasks/${id}/status`, { status }, { headers: getHeaders() });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete task?')) return;
    await axios.delete(`${API_URL}/tasks/${id}`, { headers: getHeaders() });
    fetchTasks();
  };

  const todo = tasks.filter(t => t.status === 'TODO');
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
  const done = tasks.filter(t => t.status === 'DONE');

  const TaskCard = ({ task }) => (
    <div style={{margin:'12px',padding:'14px',backgroundColor:'#fafafa',borderRadius:'8px',border:'1px solid #eee'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
        <p style={{fontWeight:'bold',color:'#333',margin:0,fontSize:'14px'}}>{task.title}</p>
        <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
          <span style={{padding:'2px 8px',borderRadius:'20px',color:'white',fontSize:'11px',backgroundColor:task.priority==='HIGH'?'#ea4335':task.priority==='LOW'?'#34a853':'#fbbc04'}}>
            {task.priority}
          </span>
          {(user.role==='ADMIN' || task.createdById===user.id) && (
            <button style={{background:'none',border:'none',cursor:'pointer',fontSize:'14px'}} onClick={() => handleDelete(task.id)}>🗑️</button>
          )}
        </div>
      </div>
      {task.description && <p style={{color:'#666',fontSize:'13px',margin:'0 0 8px'}}>{task.description}</p>}
      {task.dueDate && <p style={{color:'#888',fontSize:'12px',margin:'0 0 8px'}}>📅 {new Date(task.dueDate).toLocaleDateString()}</p>}
      <select style={{width:'100%',padding:'6px',borderRadius:'6px',border:'2px solid',borderColor:task.status==='DONE'?'#34a853':task.status==='IN_PROGRESS'?'#fbbc04':'#1a73e8',cursor:'pointer'}}
        value={task.status} onChange={e => handleStatus(task.id, e.target.value)}>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>
    </div>
  );

  const Column = ({ title, tasks, color, bg }) => (
    <div style={{backgroundColor:'white',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',overflow:'hidden'}}>
      <div style={{padding:'14px 16px',backgroundColor:bg,display:'flex',justifyContent:'space-between'}}>
        <span style={{fontWeight:'bold',color:'#333',fontSize:'14px'}}>{title}</span>
        <span style={{backgroundColor:'rgba(0,0,0,0.1)',borderRadius:'20px',padding:'2px 10px',fontSize:'13px'}}>{tasks.length}</span>
      </div>
      {tasks.length===0 ? <p style={{textAlign:'center',color:'#999',padding:'20px',fontSize:'14px'}}>No tasks</p>
        : tasks.map(t => <TaskCard key={t.id} task={t} />)}
    </div>
  );

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f0f2f5'}}>
      <div style={{backgroundColor:'#1a73e8',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{color:'white',margin:0}}>Task Manager</h2>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <button style={navBtnStyle} onClick={() => onNavigate('dashboard')}>Dashboard</button>
          <button style={navBtnStyle} onClick={() => onNavigate('projects')}>Projects</button>
          <span style={{color:'white',fontSize:'14px'}}>👤 {user.name}</span>
          <button style={{padding:'8px 16px',backgroundColor:'white',color:'#1a73e8',border:'none',borderRadius:'6px',cursor:'pointer'}} onClick={() => { localStorage.clear(); window.location.reload(); }}>Logout</button>
        </div>
      </div>
      <div style={{padding:'24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px'}}>
          <div>
            <h3 style={{color:'#333',margin:'0 0 4px'}}>📁 {project.name}</h3>
            <p style={{color:'#666',fontSize:'14px',margin:0}}>{project.description}</p>
          </div>
          <button style={{padding:'10px 20px',backgroundColor:'#1a73e8',color:'white',border:'none',borderRadius:'8px',cursor:'pointer'}} onClick={() => setShowForm(!showForm)}>+ New Task</button>
        </div>
        {showForm && (
          <div style={{backgroundColor:'white',padding:'24px',borderRadius:'10px',marginBottom:'24px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
            <form onSubmit={handleCreate}>
              <input style={inputStyle} placeholder="Task Title" value={form.title} onChange={e => setForm({...form,title:e.target.value})} required />
              <input style={inputStyle} placeholder="Description" value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
              <select style={inputStyle} value={form.assignedToId} onChange={e => setForm({...form,assignedToId:e.target.value})}>
                <option value="">Assign To (Optional)</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select style={inputStyle} value={form.priority} onChange={e => setForm({...form,priority:e.target.value})}>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
              <input style={inputStyle} type="datetime-local" value={form.dueDate} onChange={e => setForm({...form,dueDate:e.target.value})} />
              <div style={{display:'flex',gap:'12px'}}>
                <button type="submit" style={{padding:'10px 24px',backgroundColor:'#1a73e8',color:'white',border:'none',borderRadius:'8px',cursor:'pointer'}}>Create Task</button>
                <button type="button" style={{padding:'10px 24px',backgroundColor:'#f0f2f5',border:'none',borderRadius:'8px',cursor:'pointer'}} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'20px'}}>
          <Column title="📋 TODO" tasks={todo} bg="#e8f0fe" />
          <Column title="⚡ IN PROGRESS" tasks={inProgress} bg="#fff8e1" />
          <Column title="✅ DONE" tasks={done} bg="#e6f4ea" />
        </div>
      </div>
    </div>
  );
}

const navBtnStyle = {padding:'8px 16px',backgroundColor:'rgba(255,255,255,0.2)',color:'white',border:'1px solid white',borderRadius:'6px',cursor:'pointer'};
const inputStyle = {width:'100%',padding:'10px',marginBottom:'12px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',boxSizing:'border-box'};

export default TasksPage;