import React, { useState, useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { postAnswer } from '../api/InterviewAPI';
import './Interview.css';

const QUESTIONS = {
  developer: [
    '자기소개를 해주세요.',
    '최근에 사용한 기술 스택은 무엇인가요?',
    '문제 해결 경험을 말해주세요.'
  ],
};

const TIME_LIMIT = 120; // 초

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job || 'developer';
  const sessionId = location.state?.session_id || null;
  const { addInterview } = useContext(UserContext);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [listening, setListening] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [buffer, setBuffer] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  // API에서 받은 질문 목록을 우선 사용, 없으면 기본 질문 사용
  const apiQuestions = location.state?.questions;
  const questions = (apiQuestions && Array.isArray(apiQuestions)) ? 
    apiQuestions.map(q => q.question) : 
    QUESTIONS[job];
    
  // console.log('API Questions:', apiQuestions); // 디버깅용
  // console.log('Final Questions:', questions); // 디버깅용

  // 1) SpeechRecognition 초기화
  useEffect(() => {
    const TR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!TR) return;
    const recog = new TR();
    recog.lang = 'ko-KR';
    recog.interimResults = true;
    recog.continuous = true;
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = event => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }
      transcript = transcript.trim();
      setSubtitle(transcript);
      setBuffer(transcript);
    };
    recog.onerror = e => console.error('SpeechRecognition error:', e.error);
    recognitionRef.current = recog;
  }, []);

  // 2) 질문 바뀔 때마다 초기화 → TTS
  useEffect(() => {
    if (isAnalyzing) return;  // 분석중이면 건너뛰기
    setSubtitle('');
    setBuffer('');
    setTimeLeft(TIME_LIMIT);
    recognitionRef.current?.abort();
    speakQuestion();
  }, [step, isAnalyzing]);

  // 3) TTS 및 음성 인식 시작
  // const speakQuestion = () => {
  //   if (!('speechSynthesis' in window)) return;
  //   speechSynthesis.cancel();
  //   const loadVoices = () => {
  //     const voices = speechSynthesis.getVoices();
  //     if (voices.length === 0) return setTimeout(loadVoices, 100);
  //     const sel = voices.find(v => v.name === 'Yuna' && v.lang?.startsWith('ko'))
  //               || voices.find(v => v.lang === 'ko-KR')
  //               || voices[0];
  //     const u = new SpeechSynthesisUtterance(questions[step]);
  //     if (sel) { u.voice = sel; u.lang = sel.lang; }
  //     else      { u.lang = 'ko-KR'; }
  //     u.rate = 1; u.pitch = 1; u.volume = 1;
  //     u.onend = () => {
  //       try {
  //         recognitionRef.current.start();
  //       }
  //       catch (e) { console.warn(e); }
  //     };
  //     startRecording() 
  //     speechSynthesis.speak(u);
  //   };
  //   loadVoices();
  // };

  // speakQuestion 함수를 async로 수정
const speakQuestion = async () => {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();

  // MediaRecorder가 준비될 때까지 기다리는 Promise 함수
  const waitForRecorder = () => new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      // mediaRecorderRef가 설정되었고, 상태가 'inactive'(대기 중)인지 확인
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
        clearInterval(interval);
        resolve();
      }
    }, 100); // 0.1초마다 확인

    // 10초 이상 준비 안 되면 에러 처리 (무한 루프 방지)
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error("녹화 장치를 준비하는 데 시간이 너무 오래 걸립니다."));
    }, 10000);
  });

  try {
    // 1. 녹화기가 준비될 때까지 기다립니다.
    await waitForRecorder();

    // 2. 녹화기 준비가 완료되면, 음성 로드 및 TTS 시작
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) return setTimeout(loadVoices, 100);
      
      const sel = voices.find(v => v.name === 'Yuna' && v.lang?.startsWith('ko'))
                || voices.find(v => v.lang === 'ko-KR')
                || voices[0];
                
      const u = new SpeechSynthesisUtterance(questions[step]);
      if (sel) { u.voice = sel; u.lang = sel.lang; }
      else      { u.lang = 'ko-KR'; }
      u.rate = 1; u.pitch = 1; u.volume = 1;
      u.onend = () => {
        try {
          recognitionRef.current.start();
        }
        catch (e) { console.warn(e); }
      };

      // 3. 이제 안심하고 녹화를 시작합니다.
      startRecording();
      // 4. TTS를 시작합니다.
      speechSynthesis.speak(u);
    };

    loadVoices();

  } catch (error) {
    console.error(error);
    alert("녹화 장치를 준비할 수 없습니다. 페이지를 새로고침하고 카메라 권한을 확인해주세요.");
  }
};

  // 4) 타이머
  useEffect(() => {
    if (isAnalyzing || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, isAnalyzing]);

  // 5) 타임아웃 시 자동 다음
  useEffect(() => {
    if (timeLeft === 0) handleNext();
  }, [timeLeft]);

  // 6) 웹캠
  // useEffect(() => {
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  //     .then(s => videoRef.current && (videoRef.current.srcObject = s))
  //     .catch(e => console.error('Webcam error:', e));
  // }, []);
  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // 오디오도 포함
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // --- MediaRecorder 설정 ---
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstart = () => {
          setIsRecording(true);
        };
        
        mediaRecorderRef.current.onstop = () => {
          setIsRecording(false);
        };

      } catch (e) {
        console.error('Webcam or MediaRecorder error:', e);
      }
    }
    setupWebcam();
  }, []);

  const startRecording = () => {
    recordedChunksRef.current = []; // 이전 녹화 데이터 초기화
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      console.log("녹화 시작")
      mediaRecorderRef.current.start();
    }
  };

  // --- 녹화 중지 및 Blob 생성 함수 ---
  const stopRecordingAndGetBlob = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          recordedChunksRef.current = []; // 청크 비우기
          setIsRecording(false);
          resolve(blob);
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(null); // 녹화 중이 아니면 null 반환
      }
    });
  };


  // 면접 완료 후 분석 시작 → addInterview, 분석화면 토글
  const handleVoiceSubmit = transcript => {
    setAnswers(prev => {
      const next = [...prev, transcript];
      if (step < questions.length - 1) {
        setStep(s => s + 1);
      } else {
        addInterview(job, next);
        setIsAnalyzing(true);
      }
      return next;
    });
  };

  const handleNext = async () => {
    recognitionRef.current?.stop();

    // --- 녹화 중지 및 비디오 Blob 가져오기 ---
    const videoBlob = await stopRecordingAndGetBlob(); // 추가
    const answerText = buffer.trim() || 'None';
    const currentQuestion = questions[step];
    
    // 추가
    if (!videoBlob) {
      console.warn("녹화된 비디오 데이터가 없습니다.");
    }

    // 1) API로 답변 전송
    console.log('Submitting answer:', {
      question: currentQuestion,
      useranswer: answerText,
      // 수정
      video: videoBlob,
      // video: "", // 비디오 데이터는 나중에 처리
      type: job
    });


    try{
      const res = await postAnswer(currentQuestion, answerText, videoBlob, job, sessionId);
      if (!res.success) {
      alert(res.message);

      // 실패 시 다시 녹화를 시작할 수 있도록 처리
      startRecording(); 
      return;
    }
    }catch (error){
      alert('답변이 인식되지 않았습니다.');
      console.error('Answer submission error:', error);
      startRecording();
        return;
    }

    handleVoiceSubmit(answerText);
  };

  // 7) 분석중 화면에서 3초 뒤 홈으로 이동
  useEffect(() => {
    if (!isAnalyzing) return;
    const id = setTimeout(() => {
      navigate('/result', { 
        state: { session_id: sessionId },
        replace: true 
      });
    }, 3000); // 3초 뒤
    return () => clearTimeout(id);
  }, [isAnalyzing, navigate, sessionId]);

  
  if (isAnalyzing) {
    return (
      <div className="analyzing-overlay">
        <div className="analyzing-card">
          <div className="analyzing-spinner" />
          <div className="analyzing-text">면접 질문 분석 중...</div>
          <div className="analyzing-subtext">잠시만 기다려주세요.</div>
        </div>
      </div>
    );
  }

  // 질문이 없는 경우 처리
  if (!questions || questions.length === 0) {
    return (
      <div className="interview-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>질문을 불러올 수 없습니다</h2>
          <p>다시 시도해주세요.</p>
          <button onClick={() => navigate('/select-job')}>
            직무 선택으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // **면접 진행 화면**
  const percent = ((step + 1) / questions.length) * 100;
  return (
    <div className="interview-container" style={{ position: 'relative', paddingBottom: '8rem' }}>
      <div className="webcam-container">
        <video ref={videoRef} autoPlay muted playsInline className="webcam-video" />
      </div>

      <div className="subtitle">{subtitle}</div>

      <h2 style={{
        position: 'absolute', bottom: '8rem',
        left: 0, right: 0, margin: 0, textAlign: 'center'
      }}>
        면접 진행 <span style={{ fontWeight: 400, fontSize: '1rem', color: '#888' }}>
          ({step + 1}/{questions.length})
        </span>
      </h2>

      <div style={{
        position: 'absolute', bottom: '1rem',
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '0.5rem'
      }}>
        <button onClick={handleNext}
                style={{ padding: '.5rem 1rem', borderRadius: '.5rem', cursor: 'pointer' }}>
          다음 질문
        </button>
        <div>남은 시간: {timeLeft}s</div>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default Interview;
