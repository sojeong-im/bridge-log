import React, { useState } from 'react';
import { 
  Users, BookOpen, Send, Terminal, 
  TerminalSquare, Camera, CheckSquare, Square
} from 'lucide-react';
import './index.css';

function App() {
  const [view, setView] = useState('landing');
  const [tasks, setTasks] = useState([
    { id: 1, text: '운영체제 7단원 복습', completed: false },
    { id: 2, text: '리액트 컴포넌트 실습 과제', completed: true },
    { id: 3, text: 'Bridge Lab 공지 확인하기', completed: true },
    { id: 4, text: '알고리즘 코테 2문제', completed: false },
  ]);

  const [newPost, setNewPost] = useState('');
  const [feed, setFeed] = useState([
    {
      id: 1,
      name: '이수진 (컴공)',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      content: '도서관에 자리 잡았습니다. 오늘 밤샘 예정 😂 거의 과제 모임이네요',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80',
      time: '10분 전'
    },
    {
      id: 2,
      name: '김도현 (미대)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      content: '드로잉 과제 시작! 다들 화이팅입니다✨ 전시회 끝나고 맛집가요~',
      image: null,
      time: '1시간 전'
    }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    setFeed([{
      id: Date.now(),
      name: '나 (User)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      content: newPost,
      image: null,
      time: '방금 전'
    }, ...feed]);
    setNewPost('');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const DashboardView = () => (
    <div className="app-container">
      <header>
        <div className="logo-wrapper" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
          <h1 className="logo">Bridge Log_</h1>
          <div className="pixel-bubble pixel-font">전멸 아님ㅋㅋ - 시험기간</div>
        </div>
        <nav className="nav-links pixel-font">
          <a href="#" className="nav-item active">대시보드</a>
          <a href="#" className="nav-item">로그 기록</a>
          <a href="#" className="nav-item" onClick={() => setView('landing')}>나가기</a>
        </nav>
      </header>

      {/* Hero Section (Recruitment) */}
      <section className="hero-banner">
        <h2 className="hero-title pixel-font">📌 Bridge Lab 4기 모집 중! 📌</h2>
        <p className="hero-subtitle">
          계획은 세우지만 지켜지지 않고, 과제는 밀리나요?<br/>
          문제는 의지가 아니라 환경입니다! 🔥 Bridge Log로 같이 공부하는 환경을 만드세요!
        </p>
        <button className="cta-button pixel-font">지원하기 (~4월 말)</button>
      </section>

      <div className="dashboard-grid">
        
        {/* Panel 1: Tasks & Goals */}
        <div className="panel">
          <div className="panel-header pixel-font">
            <Terminal size={24} />
            내 목표 & 과제
          </div>
          
          <div className="task-list">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`task-item ${task.completed ? 'completed' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="task-checkbox">
                  {task.completed && <CheckSquare size={16} color="black" />}
                </div>
                <span className="task-text">{task.text}</span>
              </div>
            ))}
          </div>

          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div style={{ textAlign: 'right', marginTop: '10px', fontSize: '0.9rem', color: 'var(--neon-green)' }}>
            진척도: {progressPercent}%
          </div>
        </div>

        {/* Panel 2: Member Status */}
        <div className="panel">
          <div className="panel-header pixel-font">
            <Users size={24} />
            스터디 메이트 현황
          </div>
          
          <div className="member-list">
            <div className="member-item">
              <div className="member-avatar" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop)' }}></div>
              <div className="member-info">
                <div className="member-name">이수진 <span className="member-status"><div className="status-dot online"></div>열공중</span></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>컴공 / 목표: OS 완강</div>
              </div>
            </div>

            <div className="member-item">
              <div className="member-avatar" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop)' }}></div>
              <div className="member-info">
                <div className="member-name">김도현 <span className="member-status"><div className="status-dot busy"></div>과제폭탄</span></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>미대 / 목표: 포폴 완성</div>
              </div>
            </div>

            <div className="member-item">
              <div className="member-avatar" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop)' }}></div>
              <div className="member-info">
                <div className="member-name">최우식 <span className="member-status"><div className="status-dot online"></div>휴식중</span></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>경영 / 목표: 자격증 준비</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <span className="pixel-bubble" style={{ transform: 'rotate(-5deg)', display: 'inline-block' }}>같이 과제 할 사람~!</span>
          </div>
        </div>

        {/* Panel 3: Shared Feed */}
        <div className="panel">
          <div className="panel-header pixel-font">
            <BookOpen size={24} />
            Bridge Log 기록
          </div>
          
          <div className="new-post">
            <input 
              type="text" 
              className="post-input" 
              placeholder="현재 진행 상황을 공유해보세요!" 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePost()}
            />
            <button className="post-btn" onClick={handlePost}><Send size={18} /></button>
          </div>

          <div className="feed-list">
            {feed.map(post => (
              <div key={post.id} className="feed-item">
                <div className="feed-header">
                  <img src={post.avatar} alt="avatar" className="feed-avatar" />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--neon-green)' }}>{post.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.time}</div>
                  </div>
                </div>
                <div className="feed-content">
                  {post.content}
                </div>
                {post.image && (
                  <img src={post.image} alt="post" className="feed-image" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const LandingView = () => (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-logo-box">
          <h1 className="logo main-logo">Bridge Log_</h1>
          <p className="landing-tagline pixel-font">Connecting Effort, Building Success</p>
        </div>

        <div className="choice-grid">
          <div className="choice-card apply-card" onClick={() => alert('지원 페이지로 이동합니다 (준비 중)')}>
            <div className="card-glitch-bg"></div>
            <div className="card-content">
              <TerminalSquare size={48} className="card-icon" />
              <h2 className="pixel-font">브릿지 지원하기</h2>
              <p>의지 박약인 당신을 위한<br/>최고의 공부 환경, 4기 모집 중</p>
              <div className="card-footer">
                <span className="arrow-text">APPLY NOW -&gt;</span>
              </div>
            </div>
          </div>

          <div className="choice-card log-card" onClick={() => setView('dashboard')}>
            <div className="card-glitch-bg"></div>
            <div className="card-content">
              <Users size={48} className="card-icon" />
              <h2 className="pixel-font">브릿지 로그</h2>
              <p>스터디 메이트들과<br/>실시간 학습 상황 공유 및 소통</p>
              <div className="card-footer">
                <span className="arrow-text">ENTER LOG -&gt;</span>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-footer pixel-font">
          SYSTEM READY: USER_INITIALIZED_2026
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="scanlines"></div>
      {view === 'landing' ? <LandingView /> : <DashboardView />}
    </>
  );
}

export default App
