import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Send, Terminal, 
  TerminalSquare, Camera, CheckSquare, Square,
  ShieldCheck, Lock, RotateCw, Trash2, Eye, LayoutDashboard, ChevronLeft, X
} from 'lucide-react';
import { db } from './lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import './index.css';

function App() {
  const [view, setView] = useState('landing');
  const [studentType, setStudentType] = useState('');
  const [studyStyle, setStudyStyle] = useState([]);
  const [stressStyle, setStressStyle] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberCode, setMemberCode] = useState('');
  const [visiblePosts, setVisiblePosts] = useState(5);
  
  // URL routing for Admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path === '/mgmt') {
      setView('admin-login');
    }
  }, []);
  
  // Application Data States
  const [submissions, setSubmissions] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [applyForm, setApplyForm] = useState({
    name: '',
    phone: '',
    school: '',
    birthYear: '',
    address: '',
    motivation: ''
  });

  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  // D-Day State
  const dDays = [
    { title: '중간고사 시작', date: '2026-04-20', days: 32, progress: 60 },
    { title: '건축설계 마감', date: '2026-03-25', days: 6, progress: 85 },
    { title: '토익 정기시험', date: '2026-05-15', days: 57, progress: 20 },
  ];

  const [tasks, setTasks] = useState([
    { id: 1, text: '전공 서적 3챕터 요약', assignee: '유진스', deadline: 'D-3', completed: false },
    { id: 2, text: '토익 오답노트 정리', assignee: '미뉴', deadline: 'D-5', completed: true },
    { id: 3, text: 'UI/UX 디자인 리서치', assignee: '로보', deadline: '오늘', completed: true },
    { id: 4, text: '알고리즘 기말 공지 확인', assignee: '건축왕', deadline: 'D-12', completed: true },
    { id: 5, text: '졸업 논문 초안 피드백', assignee: '유진스', deadline: 'D-1', completed: false },
    { id: 6, text: '주간 루틴 기록 (Bridge Log)', assignee: '머니마스터', deadline: '매주', completed: true },
  ]);

  const [newPost, setNewPost] = useState('');
  const [feed, setFeed] = useState([
    { id: 1, name: '코딩여우 (컴공)', avatar: '🦊', content: '🔥 오늘 중앙대 정문 주변 카페에서 같이 카공할 사람! (3시~7시)', time: '1분 전' },
    { id: 2, name: '유진스 (심리)', avatar: 'YJ', content: '논문 통계 돌리느라 하루가 다 갔네요.. SPSS랑 싸우는 중 ㅠㅠ', time: '23분 전' },
    { id: 3, name: '건축왕 (건축)', avatar: 'CW', content: '설계 마감 D-3. 밤샘 이틀차입니다. 다들 화이팅!', image: 'https://images.unsplash.com/photo-1503387762-592dea58ef01?w=400&q=80', time: '1시간 전' },
    { id: 4, name: '미뉴 (경영)', avatar: 'MN', content: '공인중개사 1차 인강 클리어! 이번 기수는 유독 공부 열기가 뜨겁네요.', time: '3시간 전' },
    { id: 5, name: '아르몽 (미대)', avatar: 'AM', content: '졸시 준비 중.. 드로잉만 수백장째 ㅠㅠ 그래도 뿌듯하네요!', time: '5시간 전' },
    { id: 6, name: '머니마스터 (경제)', avatar: 'MM', content: '금융권 인턴 면접 뿌시고 왔습니다! 긍정 기운 나눠요~', time: '8시간 전' },
    { id: 7, name: '작가님 (국문)', avatar: 'JK', content: '드디어 소설 한 단락 마무리. 밤 공기가 좋네요.', time: '어제' },
    { id: 8, name: '로보 (컴공)', avatar: '🦊', content: '백준 골드 달성! Bridge Log 덕분에 꾸준히 하게 되네요.', time: '어제' },
    { id: 9, name: '유진스 (심리)', avatar: 'YJ', content: '스터디 카페 12시간권 끊었습니다. 오늘은 여기서 죽는다.', time: '어제' },
    { id: 10, name: '건축왕 (건축)', avatar: 'CW', content: '모형 제작 완료! 손가락에 본드 범벅이지만 행복함.', time: '2일 전' },
    { id: 11, name: '미뉴 (경영)', avatar: 'MN', content: '오늘 회계 원리 수업 너무 어렵다.. 복습 같이 하실 분?', time: '2일 전' },
    { id: 12, name: '아르몽 (미대)', avatar: 'AM', content: '작업실에서 발견한 예쁜 노을 공유해요~ ✨', image: 'https://images.unsplash.com/photo-1470252649358-96957c053e9a?w=400&q=80', time: '2일 전' },
    { id: 13, name: '머니마스터 (경제)', avatar: 'MM', content: '매일 아침 6시 기상 챌린지 10일차 성공!', time: '3일 전' },
    { id: 14, name: '작가님 (국문)', avatar: 'JK', content: '도서관 신착 도서 코너에서 보물 같은 책을 찾았어요.', time: '3일 전' },
    { id: 15, name: '로보 (컴공)', avatar: '🦊', content: 'React hooks 개념 드디어 잡힘! 이제 프로젝트 시작!', time: '3일 전' },
    { id: 16, name: '유진스 (심리)', avatar: 'YJ', content: '비 오는 날엔 역시 카페에서 클래식 들으며 공부하는 게 최고.', time: '4일 전' },
    { id: 17, name: '건축왕 (건축)', avatar: 'CW', content: 'CAD 작업 하다가 파일 날라감.. 하 살려줘...', time: '4일 전' },
    { id: 18, name: '미뉴 (경영)', avatar: 'MN', content: '팀플 무임승차 빌런 때문에 스트레스.. 운동으로 풀고 옵니다 ㅠ', time: '5일 전' },
    { id: 19, name: '아르몽 (미대)', avatar: 'AM', content: '새로운 붓 샀다! 역시 장비빨이 최고야.', time: '5일 전' },
    { id: 20, name: '머니마스터 (경제)', avatar: 'MM', content: '경제 뉴스 브리핑 정리 완료. 필독 리스트 공유할게요.', time: '6일 전' },
    { id: 21, name: '작가님 (국문)', avatar: 'JK', content: '고전문학 산책 중.. 과거 사람들도 우리랑 비슷한 고민을 했네요.', time: '6일 전' },
    { id: 22, name: '로보 (컴공)', avatar: '🦊', content: 'Github 잔디 심기 성공! 하루도 안 빠졌다.', time: '1주일 전' },
    { id: 23, name: '유진스 (심리)', avatar: 'YJ', content: '엠비티아이 검사 다시 해봤는데 성격 바뀜 ㅋㅋ 신기함', time: '1주일 전' },
    { id: 24, name: '건축왕 (건축)', avatar: 'CW', content: '유명 건축가 강연 듣고 왔는데 동기부여 제대로 됨!', time: '1주일 전' },
    { id: 25, name: '미뉴 (경영)', avatar: 'MN', content: '스토리 마케팅 공부 중. 브릿지 랩 홍보 전략 짜보는 중?', time: '1주일 전' },
    { id: 26, name: '아르몽 (미대)', avatar: 'AM', content: '색채학 너무 심오하다.. 세상에는 이렇게 많은 색이 있다니.', time: '2주일 전' },
    { id: 27, name: '머니마스터 (경제)', avatar: 'MM', content: '주식 투자 스터디 모집 중! 소액으로 시작해보실 분?', time: '2주일 전' },
    { id: 28, name: '작가님 (국문)', avatar: 'JK', content: '필사 챌린지 시작. 정지용 시인의 시를 옮겨 적어 봅니다.', time: '2주일 전' },
    { id: 29, name: '로보 (컴공)', avatar: '🦊', content: '알고리즘 대회 본선 진출! 팀원 구함!!', time: '3주일 전' },
    { id: 30, name: '유진스 (심리)', avatar: 'YJ', content: 'Bridge Lab 들어오고 나서 공부 시간이 2배로 늘었어요 💖', time: '한 달 전' },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, title: '스타필드 수원 나들이', location: '수원', image: '/starfield.jpg', description: '화제의 스타필드 도서관 드디어 입성! 규모가 어마어마하네요.. 웅장함에 압도당하고 갑니다 ✨', participants: ['로보', '유진스', '건축왕'] },
    { id: 2, title: '시험 끝! 성수동 카페 번개', location: '성수동', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80', description: '전공 시험 다들 고생 많았어요! 수다는 역시 힐링..', participants: ['미뉴', '아르몽', '작가님'] },
    { id: 3, title: '한강 치맥 나들이', date: '2026.03.20', location: '반포 한강공원', image: '/chimaek.jpg', description: '날씨 최고! 돗자리 깔고 수다 중. 이런 게 행복이죠.', participants: ['로보', '유진스', '머니마스터', '건축왕'] },
    { id: 4, title: '브릿지 4기 오리엔테이션', date: '2026.03.02', location: '강남역 스터디룸', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80', description: '두근구근 첫 만남! 이번 기수 라인업 대박입니다.', participants: ['전원'] },
    { id: 5, title: '방탈출 카페 격파 성공!', date: '2026.03.25', location: '홍대입구', image: 'https://images.unsplash.com/photo-1496024840928-4c41702d1c3a?w=600&q=80', description: '힌트 하나도 안 쓰고 탈출! 우리 팀워크 무엇?', participants: ['미뉴', '로보', '작가님'] },
    { id: 6, title: '🍰 당 충전 & 리프레쉬', location: '중앙대 정문 카페', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', description: '공부하다 지칠 땐 역시 달콤한 거! 케이크 한 입에 피로가 싹 가시네요 💖', participants: ['유진스', '로보'] },
  ]);

  const members = [
    { name: '유진스', major: '심리학과', status: 'online', goal: '논문 통계 완성', avatar: 'YJ', mood: '열공중' },
    { name: '건축왕', major: '건축학과', status: 'online', goal: '설계 마감', avatar: 'CW', mood: '밤샘중' },
    { name: '미뉴', major: '경영학과', status: 'busy', goal: '자격증 취득', avatar: 'MN', mood: '부재중' },
    { name: '로보', major: '컴퓨터공학', status: 'online', goal: '코딩 테스트 대비', avatar: '🦊', mood: '화이팅' },
    { name: '아르몽', major: '미술대학', status: 'online', goal: '졸업 전시 기획', avatar: 'AM', mood: '드로잉 중' },
    { name: '머니마스터', major: '경제학과', status: 'offline', goal: '금융권 취업 준비', avatar: 'MM', mood: '로그오프' },
    { name: '작가님', major: '국어국문', status: 'online', goal: '창작 소설 탈고', avatar: 'JK', mood: '집중중' },
  ];

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
      avatar: 'User',
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

  const handleAdminLogin = () => {
    if (memberCode === '00347') {
      setIsAdmin(true);
      setMemberCode('');
      setView('admin-panel');
      fetchApplications();
    } else {
      alert('관리자 모드 전용 코드가 아닙니다.');
    }
  };

  const fetchApplications = async () => {
    try {
      const q = query(collection(db, 'applications'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date()
      }));
      setSubmissions(data);
    } catch (err) {
      console.error('Error fetching applications:', err.message);
    }
  };

  const handleApplySubmit = async () => {
    if (!applyForm.name || !applyForm.phone || !studentType || !applyForm.school || !applyForm.birthYear || !applyForm.address || !applyForm.motivation) {
      alert('모든 필수 항목(*)을 입력해 주세요.');
      return;
    }

    try {
      await addDoc(collection(db, 'applications'), {
        name: applyForm.name,
        phone: applyForm.phone,
        student_type: studentType,
        school: applyForm.school,
        birth_year: parseInt(applyForm.birthYear),
        address: applyForm.address,
        study_styles: studyStyle,
        stress_styles: stressStyle,
        motivation: applyForm.motivation,
        created_at: serverTimestamp()
      });

      alert('지원이 완료되었습니다! 곧 운영진이 연락드리겠습니다.');
      // Reset form
      setApplyForm({ name: '', phone: '', school: '', birthYear: '', address: '', motivation: '' });
      setStudentType('');
      setStudyStyle([]);
      setStressStyle([]);
      setView('landing');
    } catch (err) {
      alert('제출 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까? 데이터는 복구할 수 없습니다.')) return;
    try {
      await deleteDoc(doc(db, 'applications', id));
      setSubmissions(submissions.filter(app => app.id !== id));
      if (selectedApp && selectedApp.id === id) setSelectedApp(null);
    } catch (err) {
      alert('삭제 실패: ' + err.message);
    }
  };

  const startTimer = () => {
    if (timerActive) return;
    setTimerActive(true);
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(id);
          setTimerActive(false);
          alert('집중 시간이 종료되었습니다! 수고하셨습니다. ✨');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(id);
  };

  const pauseTimer = () => {
    clearInterval(timerInterval);
    setTimerActive(false);
  };

  const resetTimer = () => {
    clearInterval(timerInterval);
    setTimerActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  // Components moved inside as render functions to avoid losing focus
  const renderDashboard = () => (
    <div className="app-container">
      <header>
        <div className="logo-wrapper" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
          <h1 className="logo">Bridge Log_</h1>
          <div className="pixel-bubble pixel-font">전멸 아님ㅋㅋ - 시험기간</div>
        </div>
        <nav className="nav-links pixel-font">
          <a href="#" className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>브릿지 로그</a>
          <a href="#" className={`nav-item ${view === 'life' ? 'active' : ''}`} onClick={() => setView('life')}>
            브릿지 라이프<span className="nav-new-dot"></span>
          </a>
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
        <button className="cta-button pixel-font" onClick={() => setView('apply')}>지원하기 (~4월 말)</button>
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
                <div className="task-content-inner">
                  <span className="task-text">{task.text}</span>
                  <div className="task-meta">
                    <span className="task-assignee">{task.assignee}</span>
                    <span className="task-deadline">{task.deadline}</span>
                  </div>
                </div>
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
            스터디 회원 현황
          </div>
          
          <div className="member-list">
            {members.map((member, idx) => (
              <div 
                key={idx} 
                className="member-item" 
                onClick={() => !isMember && alert('회원 상세 정보는 멤버 코드 인증 후 열람할 수 있습니다.')}
                style={{ cursor: !isMember ? 'pointer' : 'default' }}
              >
                <div className="member-avatar-text pixel-font">{member.avatar}</div>
                <div className="member-info">
                  <div className="member-name">{member.name} <span className="member-status"><div className={`status-dot ${member.status}`}></div>{member.mood}</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{member.major} / 목표: {member.goal}</div>
                </div>
              </div>
            ))}
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
            {feed.slice(0, visiblePosts).map(post => (
              <div key={post.id} className="feed-item">
                <div className="feed-header">
                  <div className="feed-avatar-mini pixel-font">{post.avatar}</div>
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
            {visiblePosts < feed.length && (
              <button 
                className="load-more-btn pixel-font"
                onClick={() => setVisiblePosts(prev => prev + 10)}
              >
                기록 더보기 (+10)
              </button>
            )}
          </div>
        </div>

        {/* Panel 4: Academic Utilities */}
        <div className="panel utility-panel">
          <div className="panel-header pixel-font">
            <Terminal size={24} />
            학습 유틸리티
          </div>
          
          <div className="timer-section">
            <div className="timer-display pixel-font">{formatTime(timeLeft)}</div>
            <div className="timer-controls">
              {!timerActive ? (
                <button onClick={startTimer} className="timer-btn start">START</button>
              ) : (
                <button onClick={pauseTimer} className="timer-btn pause">PAUSE</button>
              )}
              <button onClick={resetTimer} className="timer-btn reset">RESET</button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>25분 집중 - 뽀모도로 테크닉</p>
          </div>

          <div className="dday-section">
            <h4 className="pixel-font" style={{ fontSize: '1rem', color: 'var(--neon-blue)', marginBottom: '15px' }}>📌 학업 카운트다운</h4>
            {dDays.map((day, idx) => (
              <div key={idx} className="dday-item">
                <div className="dday-top">
                  <span className="dday-title">{day.title}</span>
                  <span className="dday-value pixel-font">D-{day.days}</span>
                </div>
                <div className="progress-container mini">
                  <div className="progress-bar blue" style={{ width: `${day.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bridge Life Highlights - Desktop Bottom */}
      <div className="dashboard-footer-highlights">
        <h3 className="section-title pixel-font" style={{ fontSize: '1.2rem', color: 'var(--neon-blue)', marginBottom: '15px' }}>
          ✨ 브릿지 라이프 하이라이트 _
        </h3>
        <div className="highlights-scroll">
          {activities.map(activity => (
            <div key={activity.id} className="highlight-item" onClick={() => setView('life')}>
              <img src={activity.image} alt="pic" />
              <div className="highlight-tag pixel-font">#{activity.location}</div>
            </div>
          ))}
          <div className="highlight-more-card" onClick={() => setView('life')}>
            <span className="pixel-font">모두 보기 {'->'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanding = () => (
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
              <p>스터디 멤버들과<br/>실시간 학습 상황 공유 및 소통</p>
              <div className="card-footer">
                <span className="arrow-text">ENTER LOG -&gt;</span>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-footer pixel-font">
          SYSTEM READY: USER_INITIALIZED_2026
          <span 
            onClick={() => setView('admin-login')} 
            style={{ marginLeft: '15px', opacity: 0.2, cursor: 'pointer', fontSize: '0.7rem' }}
          >
            [MGMT]
          </span>
        </div>
      </div>
    </div>
  );

  const renderApply = () => (
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
            매달 1회 이상 오프라인 참가는 필수입니다. (성실한 멤버 우대)<br/>
            <strong>3회 이상 참석 시, 프리미엄 기능이 포함된 '브릿지 로그' 코드를 증정합니다!</strong>
          </p>
        </div>

        <div className="apply-form-section">
          <h3 className="section-title pixel-font" style={{ textAlign: 'center' }}>05. 지금 지원하세요_</h3>
          <div className="placeholder-form">
            <div className="form-row">
              <label>성함 *</label>
              <input 
                type="text" 
                placeholder="이름을 입력하세요" 
                value={applyForm.name}
                onChange={(e) => setApplyForm({...applyForm, name: e.target.value})}
              />
            </div>

            <div className="form-row">
              <label>연락처 *</label>
              <input 
                type="tel" 
                placeholder="010-0000-0000" 
                value={applyForm.phone}
                onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})}
              />
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
                <input 
                  type="text" 
                  placeholder="학교 이름을 입력하세요" 
                  value={applyForm.school}
                  onChange={(e) => setApplyForm({...applyForm, school: e.target.value})}
                />
              </div>
            )}

            <div className="form-row">
              <label>출생 년도 (00-07년생 지원 가능) *</label>
              <input 
                type="number" 
                placeholder="예: 2002" 
                min="2000" max="2007" 
                value={applyForm.birthYear}
                onChange={(e) => setApplyForm({...applyForm, birthYear: e.target.value})}
              />
            </div>

            <div className="form-row">
              <label>거주지 (활동 장소 조율을 위해 필요) *</label>
              <input 
                type="text" 
                placeholder="예: 서울시 성북구 / 강남역 인근" 
                value={applyForm.address}
                onChange={(e) => setApplyForm({...applyForm, address: e.target.value})}
              />
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
              <textarea 
                placeholder="함께 열공하고 싶은 이유를 들려주세요!"
                value={applyForm.motivation}
                onChange={(e) => setApplyForm({...applyForm, motivation: e.target.value})}
              ></textarea>
            </div>
            <button className="cta-button pixel-font" style={{ width: '100%' }} onClick={handleApplySubmit}>
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

  const renderAdminLogin = () => (
    <div className="landing-container login-center">
      <div className="panel admin-login-box">
        <h2 className="pixel-font" style={{ color: 'var(--neon-green)', marginBottom: '30px' }}>&lt; SYSTEM_ADMIN_AUTH &gt;</h2>
        <div className="form-row">
          <label className="pixel-font">ENTER PASSCODE</label>
          <input 
            type="password" 
            className="member-code-input" 
            placeholder="****"
            value={memberCode}
            onChange={(e) => setMemberCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="cta-button" onClick={handleAdminLogin} style={{ flex: 1 }}>UNLOCK</button>
          <button className="nav-item" onClick={() => setView('landing')} style={{ border: '1px solid #333' }}>EXIT</button>
        </div>
      </div>
    </div>
  );

  const renderAdminPanel = () => (
    <div className="app-container admin-view">
      <header>
        <div className="logo-wrapper">
          <h1 className="logo">Admin_Bridge_Submissions</h1>
        </div>
        <nav className="nav-links pixel-font">
          <button className="refresh-btn" onClick={fetchApplications}>
            <RotateCw size={14} /> REFRESH
          </button>
          <a href="#" className="nav-item" onClick={() => { setIsAdmin(false); setView('landing'); }}>LOGOUT</a>
        </nav>
      </header>

      <div className="panel" style={{ gridColumn: '1 / -1' }}>
        <div className="panel-header pixel-font">
          <ShieldCheck size={20} />
          지원서 접수 목록 ({submissions.length})
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr className="pixel-font">
                <th>이름</th>
                <th>연락처</th>
                <th>구분</th>
                <th>출생</th>
                <th>거주지</th>
                <th>공부 스타일</th>
                <th>스트레스 해소법</th>
                <th>지원 동기</th>
                <th>지원일시</th>
                <th>관련항목</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 'bold', color: 'var(--neon-green)' }}>{app.name}</td>
                  <td>{app.phone}</td>
                  <td>{app.student_type === 'undergrad' ? '학부생' : '대학원생'}</td>
                  <td>{app.birth_year}</td>
                  <td>{app.address}</td>
                  <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.study_styles?.join(', ')}>{app.study_styles?.join(', ')}</td>
                  <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.stress_styles?.join(', ')}>{app.stress_styles?.join(', ')}</td>
                  <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.motivation}>{app.motivation}</td>
                  <td style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(app.created_at).toLocaleString()}</td>
                  <td style={{ display: 'flex', gap: '10px' }}>
                    <button className="action-btn view" onClick={() => setSelectedApp(app)} title="상세보기">
                      <Eye size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => deleteApplication(app.id)} title="삭제">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>접수된 지원서가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <div className="detail-modal" onClick={() => setSelectedApp(null)}>
          <div className="detail-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="pixel-font" style={{ color: 'var(--neon-green)', margin: 0 }}>지원서 상세보기</h2>
              <button className="action-btn" onClick={() => setSelectedApp(null)}><X size={24} /></button>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">NAME</span>
              <div className="detail-value">{selectedApp.name} ({selectedApp.student_type === 'undergrad' ? '학부생' : '대학원생'})</div>
            </div>

            <div className="detail-row">
              <span className="detail-label">PHONE</span>
              <div className="detail-value">{selectedApp.phone || '미입력'}</div>
            </div>

            <div className="detail-row">
              <span className="detail-label">SCHOOL / BIRTH / ADDRESS</span>
              <div className="detail-value">{selectedApp.school} / {selectedApp.birth_year}년생 / {selectedApp.address}</div>
            </div>

            <div className="detail-row">
              <span className="detail-label">STUDY STYLE</span>
              <div className="detail-value">
                {selectedApp.study_styles?.map(s => <span key={s} className="participant-chip" style={{ marginRight: '5px' }}>#{s}</span>)}
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">STRESS RELIEF</span>
              <div className="detail-value">
                {selectedApp.stress_styles?.map(s => <span key={s} className="participant-chip" style={{ marginRight: '5px', borderColor: '#ff3366', color: '#ff3366' }}>#{s}</span>)}
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">MOTIVATION</span>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{selectedApp.motivation}</div>
            </div>

            <button className="cta-button" style={{ width: '100%', marginTop: '20px' }} onClick={() => setSelectedApp(null)}>확인 완료</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLifeGallery = () => (
    <div className="app-container">
      <header>
        <div className="logo-wrapper" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
          <h1 className="logo">Bridge Life_</h1>
          <div className="pixel-bubble pixel-font">함께 노는 중 - OFF DUTY</div>
        </div>
        <nav className="nav-links pixel-font">
          <a href="#" className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>브릿지 로그</a>
          <a href="#" className={`nav-item ${view === 'life' ? 'active' : ''}`} onClick={() => setView('life')}>
            브릿지 라이프<span className="nav-new-dot"></span>
          </a>
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

      <div className="life-gallery-grid">
        {activities.map(activity => (
          <div key={activity.id} className="life-card">
            <div className="life-image-wrapper">
              <img src={activity.image} alt={activity.title} className="life-image" />
            </div>
            <div className="life-card-content">
              <h3 className="life-title pixel-font">{activity.title}</h3>
              <p className="life-desc">{activity.description}</p>
              <div className="life-meta">
                <span className="location-tag">📍 {activity.location}</span>
                <div className="participants-chips">
                  {activity.participants.map(p => (
                    <span key={p} className="participant-chip">#{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="scanlines"></div>
      {view === 'dashboard' ? renderDashboard() : 
       view === 'apply' ? renderApply() : 
       view === 'life' ? renderLifeGallery() :
       view === 'admin-login' ? renderAdminLogin() :
       view === 'admin-panel' ? renderAdminPanel() :
       renderLanding()}
    </>
  );
}

export default App;
