import React, { useState } from 'react';
import { 
  Users, BookOpen, Send, Terminal, 
  TerminalSquare, Camera, CheckSquare, Square
} from 'lucide-react';
import './index.css';

function App() {
  const [view, setView] = useState('landing');
  const [studentType, setStudentType] = useState('');
  const [studyStyle, setStudyStyle] = useState([]);
  const [stressStyle, setStressStyle] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [memberCode, setMemberCode] = useState('');
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
    if (!isMember) {
      alert('회원 전용 기능입니다. 멤버 코드를 입력해 주세요!');
      return;
    }
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handlePost = () => {
    if (!isMember) {
      alert('회원 전용 기능입니다. 멤버 코드를 입력해 주세요!');
      return;
    }
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

  const handleMemberVerify = () => {
    if (memberCode === '00347') {
      setIsMember(true);
      setMemberCode('');
      alert('멤버 인증에 성공했습니다! 환영합니다.');
    } else {
      alert('잘못된 코드입니다. 다시 확인해 주세요.');
    }
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
          <a href="#" className="nav-item active">브릿지 로그 대시보드</a>
          {!isMember && (
            <div className="member-verify-nav">
              <input 
                type="password" 
                placeholder="멤버 코드 입력" 
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMemberVerify()}
                className="member-code-input"
              />
              <button onClick={handleMemberVerify} className="verify-btn">인증</button>
            </div>
          )}
          {isMember && <span className="member-badge pixel-font">MEMBER ACCESS</span>}
          <a href="#" className="nav-item" onClick={() => setView('landing')}>나가기</a>
        </nav>
      </header>
      
      {!isMember && (
        <div className="view-only-notice pixel-font">
          <Terminal size={16} /> 🔍 현재 '게스트 모드'입니다. 대시보드를 둘러보실 수 있지만, 수정은 불가능합니다.
        </div>
      )}

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
                    <div className={`new-post ${!isMember ? 'locked' : ''}`}>
              <input 
                type="text" 
                className="post-input" 
                placeholder={isMember ? "현재 진행 상황을 공유해보세요!" : "회원 전용: 현재 진행 상황 공유"} 
                disabled={!isMember}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePost()}
              />
              <button className="post-btn" onClick={handlePost} disabled={!isMember}><Send size={18} /></button>
              {!isMember && <div className="lock-icon-overlay"><TerminalSquare size={20} /></div>}
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
          <div className="choice-card apply-card" onClick={() => setView('apply')}>
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

  const ApplyView = () => (
    <div className="apply-container">
      <header>
        <div className="logo-wrapper" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
          <h1 className="logo">Bridge Lab_</h1>
        </div>
        <button onClick={() => setView('landing')} className="nav-item pixel-font back-btn">뒤로가기</button>
      </header>

      <div className="apply-hero">
        <h2 className="apply-title pixel-font">📌 &lt;&lt;Bridge Lab&gt;&gt; 4기 모집 📌</h2>
        <div className="apply-badge pixel-font">RECRUITING: ~04월 말 까지</div>
      </div>

      <div className="apply-content">
        <div className="apply-section main-intro">
          <h3 className="section-title pixel-font">01. 의지가 아니라 환경입니다_</h3>
          <p className="section-text">
            혼자 공부하면 흐지부지 끝난 적 많지 않나요? 계획은 세우지만 지켜지지 않고, 과제는 밀리고...<br/>
            문제는 의지가 아니라 <strong>환경</strong>입니다! 🔥<br/><br/>
            Bridge Lab은 같이 공부하는 환경을 만들고 공유하는 스터디 모임입니다.<br/>
            기존 멤버가 탄탄하여 그대로 진행하려다 활발한 소통을 위해 추가 모집을 결정하게 되었습니다!
          </p>
        </div>

        <div className="apply-section app-story">
          <div className="app-highlight-box">
            <h3 className="section-title pixel-font">📱 Bridge Log_</h3>
            <p className="section-text">
              운영진이 직접 제작한 전용 앱(실제 회원 사용 중!)을 통해 각자의 과제, 공부, 목표를 기록합니다.<br/>
              서로의 진행 상황을 실시간으로 공유하며 <strong>‘하지 않으면 안 되는 환경’</strong>을 함께 만들어갑니다. ✨
            </p>
          </div>
        </div>

        <div className="apply-grid">
          <div className="apply-info-box">
            <h3 className="section-title pixel-font">02. 활동 내용_</h3>
            <ul className="info-list">
              <li>Bridge Log 기반 스터디 & 과제 진행</li>
              <li>주 1회 함께하는 공부 루틴 형성</li>
              <li>월 1~2회 문화 활동 (전시, 영화, 맛집)</li>
              <li>다양한 전공 간 네트워킹 (정보 공유)</li>
            </ul>
          </div>

          <div className="apply-info-box">
            <h3 className="section-title pixel-font">03. 모집 대상_</h3>
            <ul className="info-list">
              <li>혼자서는 꾸준함이 어려운 분</li>
              <li>자극 받는 환경이 필요한 분</li>
              <li>공부와 스트레스 해소를 동시에 원하는 분</li>
              <li>00-07년생 대학생/대학원생 (~5명)</li>
            </ul>
          </div>
        </div>

        <div className="apply-section activity-method">
          <h3 className="section-title pixel-font">04. 활동 방식 & 장소_</h3>
          <p className="section-text">
            • 비슷한 전공 계열 혹은 3~5명 조별 활동<br/>
            • 운영진 학교 또는 스터디룸 대여 활용<br/>
            • 의견이 맞을 시 조별로 자유롭게 카페 이동 가능
          </p>
        </div>

        <div className="apply-section important-rules">
          <h3 className="section-title pixel-font" style={{ color: '#ff3366' }}>⚠️ 필독: 유령회원 방지 정책_</h3>
          <p className="section-text">
            매달 1회 이상 오프라인 참가는 필수입니다. (성실한 메이트 우대)<br/>
            <strong>3회 이상 참석 시, 프리미엄 기능이 포함된 '브릿지 로그' 코드를 증정합니다!</strong>
          </p>
        </div>

        <div className="apply-form-section">
          <h3 className="section-title pixel-font" style={{ textAlign: 'center' }}>05. 지금 지원하세요_</h3>
          <div className="placeholder-form">
            <div className="form-row">
              <label>성함 *</label>
              <input type="text" placeholder="이름을 입력하세요" />
            </div>
            
            <div className="form-row">
              <label>구분 (현재 대학원생 비율 40%) *</label>
              <div className="type-selection">
                <button 
                  className={`type-btn ${studentType === 'undergrad' ? 'selected' : ''}`}
                  onClick={() => setStudentType('undergrad')}
                >
                  대학생
                </button>
                <button 
                  className={`type-btn ${studentType === 'grad' ? 'selected' : ''}`}
                  onClick={() => setStudentType('grad')}
                >
                  대학원생
                </button>
              </div>
            </div>

            {studentType && (
              <div className="form-row animate-in">
                <label>{studentType === 'undergrad' ? '대학교명 *' : '대학원/과정명 *'}</label>
                <input type="text" placeholder="학교 이름을 입력하세요" />
              </div>
            )}

            <div className="form-row">
              <label>출생 년도 (00-07년생 지원 가능) *</label>
              <input type="number" placeholder="예: 2002" min="2000" max="2007" />
            </div>

            <div className="form-row">
              <label>거주지 (활동 장소 조율을 위해 필요) *</label>
              <input type="text" placeholder="예: 서울시 성북구 / 강남역 인근" />
            </div>

            <div className="form-row">
              <label>나의 공부 스타일 (중복 선택 가능) *</label>
              <div className="tag-cloud">
                {['침묵 독서실', '적당한 카공', '밤샘 야행성', '미라클 모닝', '함께 토론', '혼자 집중'].map(tag => (
                  <div 
                    key={tag} 
                    className={`tag-chip ${studyStyle.includes(tag) ? 'active' : ''}`}
                    onClick={() => setStudyStyle(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label>스트레스 해소법 (선호 활동 선택) *</label>
              <div className="tag-cloud">
                {['맛집 탐방', '영화/전시', '보드게임', '수다 발산', '활동적 운동', '조용한 산책'].map(tag => (
                  <div 
                    key={tag} 
                    className={`tag-chip stress-tag ${stressStyle.includes(tag) ? 'active' : ''}`}
                    onClick={() => setStressStyle(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label>지원 동기 및 각오 *</label>
              <textarea placeholder="함께 열공하고 싶은 이유를 들려주세요!"></textarea>
            </div>
            <button className="cta-button pixel-font" style={{ width: '100%' }} onClick={() => alert('지원이 완료되었습니다! 곧 운영진이 연락드리겠습니다.')}>
              지원서 제출하기
            </button>
          </div>
        </div>
      </div>

      <div className="apply-footer">
        © 2026 BRIDGE LAB. ALL RIGHTS RESERVED.
      </div>
    </div>
  );

  const CurrentView = () => {
    switch(view) {
      case 'dashboard': return <DashboardView />;
      case 'apply': return <ApplyView />;
      default: return <LandingView />;
    }
  };

  return (
    <>
      <div className="scanlines"></div>
      <CurrentView />
    </>
  );
}

export default App
