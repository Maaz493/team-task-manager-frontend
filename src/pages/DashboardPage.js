import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://team-task-manager-production-46bc.up.railway.app/api';
function DashboardPage({ user, onLogout, onNavigate }) {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_URL}/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDashboard(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!dashboard) return <div style={{textAlign:'center',marginTop:'100px',fontSize:'18px'}}>Loading...</div>;

  const stats = [
    { label: 'Total Projects', value: dashboard.totalProjects, color: '#1a73e8' },
    { label: 'Total Tasks', value: dashboard.totalTasks, color: '#34a853' },
    { label: 'Todo', value: dashboard.todoTasks, color: '#00bcd4' },
    { label: 'In Progress', value: dashboard.inProgressTasks, color: '#fbbc04' },
    { label: 'Done', value: dashboard.doneTasks, color: '#9c27b0' },
    { label: 'Overdue', value: dashboard.overdueTasks, color: '#ea4335' },
  ];

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f0f2f5'}}>
      <div style={{backgroundColor:'#1a73e8',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{color:'white',margin:0}}>Task Manager</h2>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          <button style={navBtnStyle} onClick={() => onNavigate('projects')}>Projects</button>
          <span style={{color:'white',fontSize:'14px'}}>👤 {user.name} ({user.role})</span>
          <button style={{padding:'8px 16px',backgroundColor:'white',color:'#1a73e8',border:'none',borderRadius:'6px',cursor:'pointer'}} onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div style={{padding:'24px'}}>
        <h3 style={{color:'#333',marginBottom:'24px'}}>Welcome, {user.name}! 👋</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:'16px',marginBottom:'32px'}}>
          {stats.map((s, i) => (
            <div key={i} style={{backgroundColor:'white',padding:'20px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',textAlign:'center',borderTop:`4px solid ${s.color}`}}>
              <p style={{color:'#666',fontSize:'13px',margin:'0 0 8px'}}>{s.label}</p>
              <p style={{fontSize:'32px',fontWeight:'bold',color:'#333',margin:0}}>{s.value}</p>
            </div>
          ))}
        </div>
        <h3 style={{color:'#333',marginBottom:'16px'}}>Recent Tasks</h3>
        {dashboard.recentTasks.length === 0 ? <p style={{color:'#999',textAlign:'center'}}>No tasks yet</p> : (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {dashboard.recentTasks.map(task => (
              <div key={task.id} style={{backgroundColor:'white',padding:'16px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{fontWeight:'bold',color:'#333',margin:'0 0 4px'}}>{task.title}</p>
                  <p style={{color:'#666',fontSize:'13px',margin:0}}>{task.description}</p>
                </div>
                <span style={{padding:'4px 12px',borderRadius:'20px',color:'white',fontSize:'12px',fontWeight:'bold',backgroundColor:task.status==='DONE'?'#34a853':task.status==='IN_PROGRESS'?'#fbbc04':'#1a73e8'}}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const navBtnStyle = {padding:'8px 16px',backgroundColor:'rgba(255,255,255,0.2)',color:'white',border:'1px solid white',borderRadius:'6px',cursor:'pointer'};

export default DashboardPage;