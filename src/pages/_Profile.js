import React, { useState,useContext,useEffect } from "react";
import { _button } from "../components/_ui/_button";
import { _calendar } from "../components/_ui/_calendar";
import { useNavigate } from "react-router-dom";
import "./_Profile.css";
import _ProfileScoreChart from "../components/_ProfileScoreChart";
import {apiGet} from "../api/index"
import {UserContext} from "../UserContext";
import axios from "axios";
import {Link} from "react-router-dom";
// const USER = {
//   id: 1,
//   name: "올마이트",
//   email: "piece@naver.com",
//   statusMessage:"Plus Ultra!",
//   image: "/allmight.png",
// };

// const RECORD = [{
//     id: 1,
//     date: "2025-08-17",
//     questions: ["환자가 치료 계획을 다르지 않고 간호 조치에 불응할 경우 어떻게 대처하시겠습니까?",
//       "중환자실에서 여러 응급 상황이 동시에 발생했을 때 우선순위 판단 기준은 무엇입니까?",
//       "말기 환자의 통증 조절 요청과 과족의 과잉 진통제 사용 우려가 충돌할 때 어떻게 해결하시겠습니까?"],
//     answers: ["먼저 환자의 불응 이유를 파악하기 위해 경청과 공감적 의사소통을 시도하겠습니다. 치료 거부의 배경에는 신체적 고통이나 심리적 불안이 있을 수 있으므로 개별적인 상황을 고려해 설명을 진행하고 가족과 협력하여 신뢰 관계를 구축하는 것이 중요하다고 판단합니다.",
//       "생명 위협 여부와 안정화 가능성에 따라 우선순위를 설정해야합니다. 예를 들어 호흡/순환 유지가 가장 시급한 문제이며 동시에 보호자 동의 절차와 의료진 협업 체계도 병행하면서 표준 프로토콜에 따른 행동 목록을 작성해 처리합니다.",
//       "환자의 고통 완화 권리와 가족의 정서적 부담 모두 고려해야 합니다만 최종적으로는 환자 중심 결정권 존중 원칙에 따라 의료팀과 함께 통증 평가 도구 활용 및 점진적 투여 방식으로 양측 이해대화를 촉진하겠습니다."],
//     feedback:[{
//       index:0,
//       good: ["환자의 심리·정서적 요인을 고려한 접근이 인상적입니다.",
//         "공감적 의사소통을 통해 신뢰를 형성하려는 자세가 적절합니다.",
//         "단순 지시가 아닌 이유 파악 → 설명 → 협력의 순서가 논리적입니다."],
//       better: ["구체적인 의료진 내 협업 방식이나 예시(예: 상담 의뢰, 다학제 회의 등)가 부족합니다.",
//         "진행하고 가족과 협력하여…“라는 문장에서 행동 주체가 모호하므로, “간호사는 ~합니다”처럼 1인칭 시점을 더 명확히 해도 좋습니다."],
//       sample: ["환자의 불응 이유를 파악하기 위해 먼저 공감적 의사소통을 시도하고, 필요 시 정신건강 전문의와의 협의를 요청합니다. 이후 가족과 함께 치료 계획을 재설계하여 환자 중심의 돌봄 환경을 조성하겠습니다."]
//       },
//       {
//         index:1,
//         good:[
//             "ABC 원칙(Airway, Breathing, Circulation)에 기반한 의사결정이 잘 표현되었습니다.",
//           "표준화된 프로토콜을 언급하여 실제 임상 적용성이 높아 보입니다.",
// 	      "협업 체계 언급도 적절합니다."],
//         better: ["“보호자 동의 절차”는 응급 상황에서는 후순위인 경우가 많으므로 문맥상 우선순위에 있어 주의가 필요합니다.",
// 	    "상황 예시나 환자 유형을 추가하면 더 생동감 있습니다.",
// 	    "“행동 목록을 작성해 처리”는 너무 추상적이므로 실제 행동 예시(예: 코드 블루 호출, 응급 장비 준비 등)를 명시하면 좋습니다."
//         ],
//         sample:["우선 호흡과 순환이 위급한 환자를 최우선으로 간호하며, 동시에 코드 블루 팀과 협력해 심폐소생술을 시행하거나 응급 약물을 준비합니다. 이후 안정된 환자부터 보호자 설명 및 후속 처치를 진행합니다.\n"]
//       },
//       {
//         index:2,
//         good:[
//             "환자 중심 돌봄의 핵심 가치(결정권 존중)를 잘 표현했습니다.",
// 	        "통증 평가 도구 사용과 점진적 투여 전략은 구체적이며 실제적입니다.",
// 	        "가족과의 이해 조율을 위한 대화 강조가 적절합니다."
//         ],
//         better: [
//             "답변 전반이 너무 한 문장으로 구성되어 가독성이 떨어질 수 있습니다.",
// 	        "“양측 이해 대화를 촉진” → “의료진이 중재하여 상호 이해를 유도”처럼 조금 더 구체화하면 좋습니다."
//         ],
//         sample:["환자의 통증 완화는 생애 말기 돌봄에서 중요한 권리이므로 이를 최우선으로 고려합니다. 동시에 가족의 우려를 경청하고, 의료진과 함께 통증 평가 결과를 설명하며 점진적 진통제 투여 계획을 공유함으로써 상호 신뢰를 구축하겠습니다."]
//       }
//       ,
//     ],
//     score: {구체성: 80, 논리성: 65, 적합성: 75, 표현력: 70, 전문성: 60 },
//     thumbnail:"/young_allmight.png",
//     video:"/plusultra.mp4"
//   },
//   {
//     id: 1,
//     date: "2025-08-15",
//     questions: ["왜 맨날 웃고 다니나요?", "평화의 상징은 뭐라고 생각하시나요?", "앞에 두 히어로가 서로 싸우고 있으면 어떻게 해결하시겠어요?"],
//
//   },
// ];
const sampleData = {
  InterviewList: [{
    question:["자기소개 해주세요.","최근 사용한 기술 스택은?","협업 중 갈등 해결 사례는?"],
    useranswer:["안녕하세요, 저는 책임감 있고 소통을 중요하게 생각하는 지원자 홍길동입니다. 대학 시절 여러 프로젝트에 참여하며 개발뿐 아니라 기획과 협업 경험을 쌓았고, 현재는 풀스택 개발자로 성장 중입니다.",
      "최근에는 React와 Flask를 이용해서 예약 시스템을 개발했습니다. 프론트엔드는 React로 구성했고, Flask로 API 서버를 구축했습니다. MongoDB를 데이터베이스로 사용했습니다.",
      "프로젝트 중 디자이너와 기능 우선순위를 두고 의견 충돌이 있었는데, 각자의 입장을 정리해 회의에서 공유하고 사용자 피드백을 기반으로 의사결정을 내렸습니다."],
    LLM_gen_answer:["지원자는 자신을 명확하게 표현하고 핵심 역량을 잘 언급했습니다. 다만 '프로젝트'에 대한 구체적인 사례가 없고, 강점을 뒷받침하는 경험이 부족해 설득력이 떨어집니다.",
    "기술 스택에 대한 설명은 명확하나, 기술을 선택한 이유나 해결한 문제에 대한 언급이 없어 실무 역량이 충분히 드러나지 않습니다.",
    "협업 상황을 명확히 설명하고 해결 과정도 논리적이지만, 감정적 갈등의 디테일이나 리더십 요소는 부족해 인상 깊지 않음."],
    analysis:[
        "분석내용: 어조는 침착하고 시선도 안정적이었음. 표정에서 긴장감은 있었으나 과도하지 않았음. \n미흡한점: 구체적인 프로젝트 사례가 없어 실제 경험 기반의 자기소개로 보기엔 아쉬움.\n개선점: 예시를 하나 넣어 신뢰도를 높이면 좋음.\n수정된 답변: 안녕하세요, 저는 책임감을 기반으로 협업을 중시하는 홍길동입니다. 대학 시절 팀 프로젝트에서 팀장을 맡아 React와 Firebase로 웹앱을 개발했으며, 일정과 소통을 총괄하며 프로젝트를 성공적으로 완수했습니다. 이런 경험을 통해 실무 중심의 커뮤니케이션 능력을 키웠습니다.",
        "분석내용: 말은 또렷하고 전달력은 좋았음. 다만 내용은 나열식으로 기술되어 면접관의 관심을 끌기엔 부족했음.\n미흡한점: 단순한 기술 나열. 해당 기술이 사용된 배경과 결과가 빠짐.\n개선점: 기술 선택 이유와 구현 성과 또는 문제 해결 경험을 추가.\n수정된 답변: 최근에는 React와 Flask를 사용해 병원 예약 시스템을 개발했습니다. 프론트엔드는 사용자 친화적인 UI를 구현하기 위해 React를, 백엔드는 빠른 REST API 개발을 위해 Flask를 사용했습니다. 인증은 JWT를, DB는 MongoDB로 구성해 빠른 검색이 가능하도록 최적화했습니다.",
        "분석내용: 침착한 어조와 중립적인 시선 처리로 긍정적인 인상. 논리 전개는 좋았으나 구체적 상황 묘사가 부족했음.\n미흡한점: ‘의견 충돌’의 강도나 해결의 주도성 부족. 본인의 역할이 불명확함.\n개선점: 자신이 어떻게 조율했는지를 강조하면 리더십 어필 가능.\n수정된 답변: 프로젝트 중 디자이너는 사용성, 저는 개발 난이도를 우선시해 우선순위 충돌이 있었습니다. 저는 두 입장을 문서화해 정리한 뒤 사용자 대상 테스트를 통해 우선순위를 조정했고, 결과적으로 일정과 품질을 모두 지킬 수 있었습니다."
    ],
    score:[85,78,82]
  }],
  Date: "2025-08-15",
  summary: "지원자는 전반적으로 명확한 어조와 침착한 태도를 유지하며 좋은 인상을 주었습니다. 특히 협업에 있어 논리적인 문제 해결 접근을 보였고, 기술 스택에 대한 이해도도 기본 이상이었습니다. 다만 전반적으로 '구체성'이 부족해 실무 능력을 강조하기에는 설득력이 다소 약했습니다. 이후에는 경험 중심의 답변 구성과 수치·성과 중심의 표현 연습이 필요합니다.",
  video: "/plusultra.mp4",
  thumbnail:"/young_allmight.png"
};


export default function _Profile() {
  const [selectedRange, setSelectedRange] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const {user} = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [interviewList, setInterviewList] = useState([]);
  const [summary, setSummary] = useState('');
  const [video, setVideo] = useState('');
  const [profileImage, setProfileImage] = useState("/allmight.png");
  const [profilestatusMessage, setProfilestatusMessage] = useState("");
  const [recordThumbnail, setRecordThumbnail] = useState("young_allmight.png");
  const [date, setDate] = useState(new Date());
  //로그인 중이 아니면 SignIn페이지로
  if(!user){navigate('/SignIn');}

  //데이터 들고 오기
  useEffect(() => {
    //유저 정보
    const userInfo = apiGet('/api/user/info');
    if (userInfo.result==='ok') {
      const data = userInfo.data;
      setEmail(data.email);
      setUsername(data.username);
      //기존 API 외 - 프로필이미지,상태매시지
      setProfileImage(data.image);
      setProfilestatusMessage(data.statusMessage);
    }else{
      console.log('데이터를 가져오지 못했습니다.');
    }

    //유저 기록 분석 데이터 들고 오기
    axios.get('/api/analysis/info')
      .then(response => {
        if (response.data.result === 'ok') {
          const data = response.data.data;
          setInterviewList(data.InterviewList);
          setSummary(data.summary);
          setVideo(data.video);
          //기존 API 외 (썸네일, 영상 날짜)
          setRecordThumbnail(data.thumbnail);
          setDate(data.date);
        }
      })
      .catch(error => {
        console.error('API 실패 - 기본 데이터 사용:', error);
        setInterviewList(sampleData.InterviewList);
        setSummary(sampleData.summary);
        setVideo(sampleData.video);
      })
  },[]);

  //날짜 범위 지정
  const handleSearch = () => {
    if (selectedRange && selectedRange.from && selectedRange.to) {
      const filtered = sampleData.filter((r) => {
        const recordDate = new Date(date);
        return (
          recordDate >= selectedRange.from &&
          recordDate <= selectedRange.to
        );
      });
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([]);
    }
  };

  return (
    <div className="profile-container">
      {/* 프로필 카드 */}
      <div className="profile-card">
        <h2>My Profile</h2>
        <img src={profileImage} alt="프로필" />
        <p style={{ textAlign: "left" }}>이름: {username}</p>
        <p style={{ textAlign: "left" }}>이메일: {email}</p>
        <p style={{ textAlign: "left" }}>상태 메시지: {profilestatusMessage}</p>
        <div className="profile-buttons">
          <_button className="button-modify"><Link to="ProfileModify">수정하기</Link></_button>
          <_button className="button-ask">문의하기</_button>
        </div>
      </div>

      {/* 면접 기록 */}
      <div className="interview-records">
        <h2>My 면접 기록</h2>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              // key={record.id}
              className="record-card"
              onClick={() => {
              setSelectedRecord(record);
              setIsModalOpen(true);
  }}
            >
              <div className="record-thumbnail">
                <img src={record.thumbnail} alt="썸네일" />
              </div>
              <div className="record-questions">
                <p><strong>면접 문제</strong></p>
                {record.questions.map((q, i) => (
                  <p key={i}>{i + 1}. {q}</p>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-record">선택한 날짜의 면접 기록이 없습니다.</p>
        )}
      </div>

      {/* 달력 */}
      <div className="calendar-wrapper">
        <h2>날짜 선택</h2>
        <_calendar
          mode="range"
          selected={selectedRange}
          onSelect={setSelectedRange}
        /><div className="button_wrapper">
        <_button className="glass-button" onClick={handleSearch}>조회하기</_button>
      </div>

      </div>
      {isModalOpen && selectedRecord && (
      <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}
        style={{ position: "relative" }} // 필수: X 버튼 위치 제어//
        >
          {/* X 닫기 버튼 */}
      <button
        onClick={() => setIsModalOpen(false)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "transparent",
          border: "none",
          fontSize: "4.5rem",
          cursor: "pointer",
        }}
        aria-label="닫기"
      >
        &times;
      </button>
          <h2 style={{ textAlign: "center" }}>자세히 보기</h2>
          <div className="video-chart-wrapper" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <video
              className="modal-video"
              controls
              src={selectedRecord.video}
            />
              {selectedRecord.score&&(
                  <_ProfileScoreChart
              className="modal-scorechart"
              scores={selectedRecord.score}/>)}
          </div>
          <ul>
  {selectedRecord.questions.map((q, i) => (
    <li
      key={i}
      style={{
        textAlign: "left",
        marginBottom: "2rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #ccc",
      }}
    >
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        질문 {i + 1}: {q}
      </p>

      {selectedRecord.answers && selectedRecord.answers[i] && (
        <p>
          <strong>답변:</strong> {selectedRecord.answers[i]}
        </p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <p><strong>🕵️‍ 피드백  🕵️‍</strong></p>
        <p><strong>👍 잘한 점:</strong></p>
        <ul>
          {selectedRecord.feedback[i].good.map((g, j) => (
            <li key={j} style={{ marginBottom: "0.5rem" }}>{g}</li>
          ))}
        </ul>

        <p><strong>🔧 개선할 점:</strong></p>
        <ul>
          {selectedRecord.feedback[i].better.map((b, j) => (
            <li key={j} style={{ marginBottom: "0.5rem" }}>{b}</li>
          ))}
        </ul>

        <p><strong> 제안 보완 문장 예:</strong></p>
        <ul>
          {selectedRecord.feedback[i].sample.map((s, j) => (
            <li key={j} style={{ marginBottom: "0.5rem" }}>{s}</li>
          ))}
        </ul>
      </div>
    </li>
  ))}
</ul>
        </div>
      </div>
    )}
    </div>
  );
}