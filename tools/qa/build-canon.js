// 「캐릭터 설정 통합 정리본」(docs/source/settings-integrated.md)에서 assets/js/characters.js 를 만든다.
// 정리본의 문장은 고치지 않는다. 바꾸는 것은 세 가지뿐이다.
//   1) 캐릭터 코드(MG01 등)를 이름으로 바꾸거나, 이름 뒤 괄호 표기는 뺀다.
//   2) 백틱과 말투 기호(♡ ♧ ♤)를 뺀다. 능력계열 기호 줄은 읽지 않는다.
//   3) 문장 경계에서만 나눠 문장 목록으로 둔다(문장을 이으면 정리본과 같다).
// 손으로 정하는 값(분류, 순위, 개요, 가릴 문장 등)은 아래 표에 있다. 다시 돌려도 된다.
//   node tools/qa/build-canon.js
"use strict";
var fs = require("fs");
var path = require("path");
var vm = require("vm");
var split = require("./past-split.js");

var ROOT = path.join(__dirname, "..", "..");
var SRC = path.join(ROOT, "docs", "source", "settings-integrated.md");
var OUT = path.join(ROOT, "assets", "js", "characters.js");

/* ───── 손으로 정하는 표 ───── */
// [정리본 코드, id, 이름, 활동명, 분류, 구분(kind), 직위(role), 순위, 꼬리표(badge)] 순서가 곧 기록 번호다
var ROSTER = [
  ["MG01", "reina-de-rose", "레이나 드 로즈", "로즈 세라핌", "academy", "인간(마법소녀)", "학생위원장, 외국 명문가 출신", 2],
  ["MG02", "kang-doyun", "강도윤", "아이언 벨", "academy", "인간(마법소녀, TS)", "전국 대회 출신 복서", 18],
  ["MG03", "yu-haram", "유하람", "클립스타", "academy", "인간(마법소녀)", "마법소녀 전문 스트리머", 63],
  ["MG04", "oh-yunseo", "오윤서", "라스트 라이트", "academy", "인간(초기 세대 마법소녀)", "특별교관, 현역 은퇴자", null, "교관"],
  ["MG05", "cha-yuri", "차유리", "바이오필리아", "academy", "인간", "이계 생물 연구원, 현장 포획 담당", null, "연구"],
  ["MG06", "kang-sea", "강세아", "블루 리플", "academy", "인간(마법소녀)", "해수욕장 안전요원", 41],
  ["MG07", "moon-bora", "문보라", "선샤인", "academy", "인간(마법소녀)", "유치원 교사, 아카데미 협력 마법소녀", 77],
  ["MG08", "mee", "메에", "고트벨", "academy", "염소(인간 형태)", "산악 농장 소속, 아카데미 협력 마법소녀", 84],
  ["MG09", "seo-rian", "서리안", "체인 하트", "academy", "인간(마법소녀)", "심야 배달 노동자", 29],
  ["MG10", "lee-seohyeon", "이서현", "트윈 시그널", "academy", "인간(마법소녀) · 이계 기생체 공생", "전업 마법소녀", 6],
  ["MG11", "jeong-haeun", "정하은", "제로 나이트", "academy", "인간(마법소녀)", "실질적 은둔 생활자", 1],
  ["MG12", "elise-de-armand", "엘리제 드 아르망", "세인트 릴리", "academy", "인간(이국의 마법소녀)", "성직 전통의 고위 귀족 가문 출신", 12],
  ["MG13", "evelyn-rose", "이벨린 로제", "이벨린", "academy", "성검(전직 마법소녀)", "무기 등록, 엘리제의 파트너", null, "성검"],
  ["MG14", "kim-doa", "김도아", "프린스 메이드", "academy", "인간(마법소녀)", "메이드 카페 직원", 52],
  ["MG15", "yu-chaerin", "유채린", "아스트랄 레이븐", "academy", "인간(마법소녀)", "학생위원회 소속, 비밀기지 운영자", 31],
  ["MG16", "yoon-majo", "윤마조", "쇼크잼", "academy", "인간(마법소녀)", "고위험 임무 지원", 46],
  ["MG17", "cheon-sion", "천시온", "제로 크라운", "academy", "미공개", "소문상의 랭킹 0위, 학장과 직접 접촉", 0],
  ["MG18", "lee-areum", "이아름", "코멧 홈", "academy", "인간", "아카데미 학생", 88],
  ["MG19", "nam-sei", "남세이", "이모지", "academy", "인간(마법소녀)", "언령 능력 보유자", 57],
  ["MG20", "jang-yura", "장유라", "블랙 도메인", "academy", "인간(마법소녀)", "아카데미 돌격 전력", 16],
  ["MG21", "noah", "노아", "버스데이-07", "academy", "인공 마법소녀", "아카데미 실험 프로그램 소속", 35],
  ["MG22", "mizuno-saki", "미즈노 사키", "섀도우 픽시", "academy", "인간(마법소녀)", "일본 출신, 닌자식 잠입 전문", 72],
  ["MG23", "seo-nayun", "서나윤", "러키 로드", "academy", "인간(마법소녀)", "무면허 자전거 라이더", 99],
  ["MG24", "park-sion", "박시온", "블러드 하운드", "academy", "인간(마법소녀)", "특수 전력, 이계 생물 척살 담당", 9],
  ["MG25", "do-yeonhwa", "도연화", "청운검희", "academy", "인간(마법소녀)", "자칭 검협·검성 지망", 43],
  ["AD", "adelia", "아델리아", null, "academy", "인간(마법소녀)", "과거 랭킹 5위", null, "사망"],
  ["AV01", "shin-yuan", "신유안", "유리 왕관", "villain", "인간(마법소녀)", "과거 랭킹 3위(공식 기록 삭제), 아카데미 내부 반역자", null, "말소"],
  ["AV02", "ryu-seogyeong", "류서경(가칭)", null, "villain", "인간", "아카데미 전술 교관", null, "전술"],
  ["AV03", "kang-taeo", "강태오", "완벽한 후계자", "villain", "인간", "아카데미 외부 감독관", null, "감독"],
  ["AV04", "ophelia-jin", "오필리아 진", "환호의 광대", "villain", "인간", "마법소녀 연예 에이전시의 실세", null, "외부"],
  ["IW00", "celestis", "셀레스티스", "역천의 군주", "throne", "미상", "이계의 왕, 칠왕정의 정점", null, "왕"],
  ["SE01", "arbel", "아르벨", null, "throne", "이계인", "제1좌 · 교만", null, "1좌"],
  ["SE02", "merkan", "메르칸", null, "throne", "이계인", "제2좌 · 탐욕", null, "2좌"],
  ["SE03", "sitriel", "시트리엘", null, "throne", "이계인", "제3좌 · 색욕", null, "3좌"],
  ["SE04", "neisa", "네이사", null, "throne", "이계인", "제4좌 · 질투", null, "4좌"],
  ["SE05", "orgam", "오르감", null, "throne", "이계인", "제5좌 · 폭식", null, "5좌"],
  ["SE06", "lagbar", "라그바르", null, "throne", "이계인", "제6좌 · 분노", null, "6좌"],
  ["SE07", "nemuri", "네무리", null, "throne", "이계인", "제7좌 · 나태", null, "7좌"],
  ["BR01", "rain-starfall", "레인 스타폴", null, "border", "경계인", "경계 붕괴 현상을 추적하는 유랑자", null, "경계"],
  ["BR02", "yuda-istarod", "유다 이스타로드", null, "border", "경계인", "배신자라는 별칭을 가진 중재자", null, "경계"],
  ["ENT01", "min-rahee", "민라희", "베일", "border", "인간", "악역 전문 마법소녀 배우, 아카데미 학생", null, "연예"],
  ["ENT02", "lee-yeonha", "이연하", "노 리브", "border", "인간", "활동을 멈추지 못하는 마법소녀, 아카데미 학생", null, "연예"],
  ["COR01", "kang-myeongju", "강명주", "기억의 회장", "border", "인간", "기업 연합 의장", null, "기업"],
  ["COR02", "yoon-sehyeok", "윤세혁", "뇌실장", "border", "인간(신체 개조)", "기업 연합 전략총괄", null, "기업"],
  ["COR03", "billion", "빌리온", "B-ILLI", "border", "로봇", "기업 연합 소속 현장 정비·호위", null, "기업"],
  ["COR04", "jang-miryeong", "장미령", "백야의 감사", "border", "인간", "기업 연합 감사실장", null, "기업"],
  ["MER01", "han-taegeon", "한태건", "무사", "border", "인간", "독립 용병, 갱생한 전직 폭주족", null, "용병"],
  ["MER02", "baek-nari", "백나리", "프리티 머시너리", "border", "인간", "독립 용병, 아카데미 중퇴자", null, "용병"],
  ["MER03", "jin-seoyun", "진서윤", "롱레인지", "border", "인간", "독립 용병, 저격수·정찰 전문가", null, "용병"],
];

// 코드 → 이름(본문에 남은 코드를 이름으로 바꿀 때 쓴다)
var NAME = {};
ROSTER.forEach(function (r) { NAME[r[0]] = r[2]; });
NAME.AV02 = "전술 교관";

// 메인 25인이 아닌 인물의 성격 태그(성격 문단의 낱말)
var TRAITS = {
  adelia: ["정의로움", "기사도", "정당한 승부"], "shin-yuan": ["구조와 치유", "배신당한 믿음", "복수"],
  "ryu-seogyeong": ["전술", "상실", "집행자"], "kang-taeo": ["성과 관리", "사연 없음", "권한"], "ophelia-jin": ["여론 공작", "불행의 소비", "밝은 말투"],
  celestis: ["초월적 지성", "대리 형상", "통합"], arbel: ["교만", "완벽주의", "등급"], merkan: ["탐욕", "계약", "대가"],
  sitriel: ["색욕", "욕망", "무대"], neisa: ["질투", "모방", "개선"], orgam: ["폭식", "순수함", "기억"],
  lagbar: ["분노", "전투", "존중"], nemuri: ["나태", "잠입", "성실"], "rain-starfall": ["중립", "유랑", "과묵"],
  "yuda-istarod": ["중립", "중재", "배신자라는 별명"], "min-rahee": ["악역 연기", "예의", "낯가림"], "lee-yeonha": ["워커홀릭", "미소", "불안"],
  "kang-myeongju": ["기억", "직원 중심", "타협"], "yoon-sehyeok": ["분석", "회사는 생물", "신체 개조"], billion: ["유쾌", "허세", "히어로"],
  "jang-miryeong": ["현실적 정의론", "증거", "원칙"], "han-taegeon": ["갱생", "정직", "거친 말"], "baek-nari": ["자존심", "계약", "환멸"],
  "jin-seoyun": ["침착", "과묵", "정찰"],
};

// 요약표의 키워드 가운데 가려진 사실을 드러내거나 슬랭이라 성격 태그에서 뺄 말
var TRAIT_DROP = { "reina-de-rose": ["배신"], "cheon-sion": ["로리 바바"], "lee-areum": ["이계인에게 입양된 인간"] };

// 개요(한 문장). 정리본의 공개된 사실만 쓴다.
var SUMMARY = {
  "reina-de-rose": "외국 명문가에서 자라 하란 아카데미 학생위원장이 된 랭킹 2위 마법소녀, 누구에게나 상냥하고 공정한 얼굴로 사람을 관찰하며 전투의 선택지를 정리한다.",
  "kang-doyun": "전국 대회 출신 복서였다가 145cm의 몸이 된 랭킹 18위 마법소녀, 수치심과 롤모델 정하은을 향한 동경 사이에서 링 위처럼 정면으로 들이받는다.",
  "yu-haram": "마법소녀 전문 스트리머 랭킹 63위, 온라인에서는 대담하지만 현실에서는 눈도 잘 못 마주치며 전쟁이 끝나는 날의 졸업 방송을 꿈꾼다.",
  "oh-yunseo": "초기 세대 마법소녀였던 특별교관, 전쟁과 동료들의 죽음을 지나며 감정을 소진했지만 어린 마법소녀가 죽는 것만은 끝까지 막으려 한다.",
  "cha-yuri": "이계 생물을 연구하는 아카데미 연구원, 인간보다 이계 생물에게 더 예의를 갖추며 위험한 개체도 살아 있는 채로 데려오려 한다.",
  "kang-sea": "해수욕장 안전요원으로 일하는 랭킹 41위 마법소녀, 말이 거칠고 선의를 의심하지만 능력의 효율 때문에 비키니를 전투복으로 입는다.",
  "moon-bora": "유치원 교사로 일하는 랭킹 77위 치유계 마법소녀, 거짓말을 거의 못 하고 불살주의 때문에 전투 평가는 낮지만 구조에서는 높은 성과를 낸다.",
  mee: "염소가 인간 형태로 변한 랭킹 84위 마법소녀, 산악 농장 소속으로 높은 곳을 좋아하고 마음에 들지 않으면 머리부터 들이민다.",
  "seo-rian": "심야 배달 일을 하는 랭킹 29위 마법소녀, 전기톱 미미를 들고 싸우며 몸이 훼손돼도 빠르게 재생하지만 통증은 사라지지 않는다.",
  "lee-seohyeon": "몸 안에 이계 기생체 쿠오와 함께 사는 랭킹 6위 마법소녀, 아카데미에서 손꼽히는 인격자이면서 가장 기괴한 전투 방식을 쓴다.",
  "jeong-haeun": "공식 랭킹 1위이지만 임무가 아니면 방 밖으로 나오지 않는 마법소녀, 게임에 빠져 지내며 환호와 폭발음을 혼동하는 전쟁 트라우마가 있다.",
  "elise-de-armand": "성직 전통의 귀족 가문 출신 랭킹 12위 마법소녀, 성검 이벨린과 짝을 이뤄 싸우며 노골적인 농담 앞에서는 귀와 목덜미가 쉽게 붉어진다.",
  "evelyn-rose": "성검이 된 전직 마법소녀, 엘리제의 파트너 무기로 쉬지 않고 떠들며 힘을 쓸 때마다 인간이었던 시절의 기억을 조금씩 잃는다.",
  "kim-doa": "메이드 카페에서 일하는 랭킹 52위 마법소녀, 정해진 시간 동안 179cm 정도의 남성형으로 변신하면 요리 솜씨까지 달라진다.",
  "yu-chaerin": "학생위원회에서 정보 정리를 맡은 랭킹 31위, 자신이 가장 어두운 별의 여신에게 선택받았다고 믿으며 오래된 창고를 꾸민 비밀기지를 운영한다.",
  "yoon-majo": "고위험 임무에 먼저 지원하는 랭킹 46위 마법소녀, 평범한 일상이 지루하고 시한부 진단을 받아 매 순간을 최대 강도로 살려 한다.",
  "cheon-sion": "소문 속에서만 랭킹 0위로 불리는 정체불명의 소녀, 학장과 직접 접촉하며 능글맞게 반말을 쓰고 대단한 비밀도 농담처럼 말한다.",
  "lee-areum": "발광 버섯과 이계 점액 젤리를 즐겨 먹는 랭킹 88위 낙천적인 마법소녀, 호기심이 많고 가족의 행동을 사랑의 표현으로 받아들인다.",
  "nam-sei": "랭킹 57위의 마법소녀, 말한 문장이 약한 현실 간섭을 일으키는 능력 때문에 수화와 스마트폰으로만 소통한다.",
  "jang-yura": "돌격 전력으로 뛰는 랭킹 16위 마법소녀, 자신의 영역에 들어온 대상의 거리감과 출구를 왜곡하며 실종 사건마다 납치 소문이 따라붙는다.",
  noah: "아카데미와 기업 연합이 만든 인공 전투력 프로젝트의 완성형, 생일을 진심으로 좋아하며 축하받는 법보다 축하를 준비하는 법을 먼저 배웠다.",
  "mizuno-saki": "일본에서 혼자 건너와 장학 전형으로 입학한 랭킹 72위 닌자식 잠입 전문가, 가난 때문에 물건을 훔치는 버릇이 생겼지만 소중한 물건은 건드리지 않는다.",
  "seo-nayun": "무면허로 자전거를 타는 랭킹 99위 마법소녀, 자신이 약하다는 것을 알면서도 도움을 청하는 사람에게 가장 먼저 달려간다.",
  "park-sion": "이계 생물 척살을 맡은 랭킹 9위 특수 전력, 이계에 대한 증오가 강해 입이 험하지만 동료가 다치면 누구보다 먼저 몸을 던진다.",
  "do-yeonhwa": "무협소설을 읽고 스스로 협객이 된 랭킹 43위 마법소녀, 하오체로 말하며 미지의 스승에게 검을 배웠다고 주장한다.",
  adelia: "과거 랭킹 5위였던 마법소녀, 기사도를 신조로 삼아 약자를 지키고 적에게도 정당한 승부의 예를 지켰으며 지금은 기록으로만 남아 있다.",
  "shin-yuan": "공식 기록에서 순위가 삭제된 과거 랭킹 3위, 아카데미 내부 반역자로 불리며 레이나에게 가장 인간다운 방식의 복수를 준비한다.",
  "ryu-seogyeong": "아카데미 전술 교관, 자신의 작전 결정으로 가족을 잃은 뒤 결정마다 희생을 숫자로 저울질하며 체계의 가장 충실한 집행자로 산다.",
  "kang-taeo": "아카데미 외부 감독관, 랭킹제를 악용해 낮은 랭커의 장비와 의료 지원을 줄이고 그 모든 일을 성과 관리라고 부른다.",
  "ophelia-jin": "마법소녀 연예 에이전시의 실세, 한때 정상의 스타였다가 추문으로 나락에 떨어진 뒤 불행이 가장 잘 팔리는 상품이라는 결론을 얻었다.",
  celestis: "칠왕정의 정점인 이계의 왕, 칠좌에게 직위를 내리는 초월적 지성이며 이계와 지구를 하나의 세계로 통합하려 한다.",
  arbel: "칠좌의 제1좌 교만, 처음부터 완성되어 있던 존재로 모든 생명과 문명에 등급을 매기고 낮은 등급의 몸을 개조한다.",
  merkan: "칠좌의 제2좌 탐욕, 쓰러진 상대에게 계약서를 내밀며 모든 것에는 반드시 대가가 따른다고 믿는다.",
  sitriel: "칠좌의 제3좌 색욕, 이계 극장의 유명 배우였던 도파민 추구자로 진심으로 원하는 관심은 오직 셀레스티스의 것뿐이다.",
  neisa: "칠좌의 제4좌 질투, 타인의 고유능력을 모방해 원본보다 낫게 다듬는 천재로 남의 능력을 아직 고쳐지지 않은 초안으로 본다.",
  orgam: "칠좌의 제5좌 폭식, 악의 없는 포식자로 남의 소중한 기억을 맛있는 음식처럼 이야기한다.",
  lagbar: "칠좌의 제6좌 분노, 칠좌 가운데 순수 전투력이 가장 강하며 강한 적에게는 존중을 보이고 충돌 자체를 원한다.",
  nemuri: "칠좌의 제7좌 나태, 영원히 자기 위해 칠좌 가운데 가장 열심히 인간계를 공략하며 아카데미 전학생으로 지낸다.",
  "rain-starfall": "경계 붕괴 현상을 추적하는 경계인 유랑자, 이계 침략에 중립이며 경계의 붕괴를 감지하는 능력 때문에 왕과 아카데미가 모두 찾는다.",
  "yuda-istarod": "모두에게 배신자로 불리는 경계인 중재자, 이계 침략에 중립이며 양측이 외면한 계약의 조건을 별자리처럼 드러낸다.",
  "min-rahee": "악역 전문 마법소녀 배우, 화면 속에서는 잔혹하고 도도하지만 카메라 밖에서는 예의 바르고 낯을 가린다.",
  "lee-yeonha": "활동을 멈추지 못하는 마법소녀, 광고와 방송과 현장 작전을 병행하며 밝게 웃으면서 부상과 피로를 숨긴다.",
  "kang-myeongju": "기업 연합 의장, 초능력이 아니라 현장을 다니며 직원의 이름과 사정을 반복해 확인하는 수고로 사람을 기억한다.",
  "yoon-sehyeok": "기업 연합의 전략총괄, 회사를 하나의 생물로 보고 조직과 데이터 흐름을 설계하며 자신의 몸도 신경 인터페이스로 개조했다.",
  billion: "기업 연합 소속의 유쾌한 현장 호위 로봇, 영화 속 히어로처럼 자신을 소개하며 인공 전투력 프로젝트의 프로토타입이다.",
  "jang-miryeong": "기업 연합 감사실장, 원칙주의자이지만 이상주의자는 아니며 공개와 은폐의 경계에서 고통스러운 결정을 내린다.",
  "han-taegeon": "갱생한 전직 폭주족 출신의 독립 용병, 정당한 대가를 받고 정당한 일만 하며 한번 맡은 일은 끝까지 한다.",
  "baek-nari": "아카데미를 중퇴한 독립 용병, 마법소녀처럼 보인다는 말을 모욕으로 받아들이며 계약 조건과 보수를 꼼꼼히 따진다.",
  "jin-seoyun": "저격수이자 정찰 전문가인 독립 용병, 전투 전에 탈출 경로와 민간인 위치를 먼저 확인한다.",
};

// 능력 설명 가운데 「한계」로 옮길 문장(문장에 들어 있는 말)
var LIMIT = {
  "kang-doyun": ["근육에 과부하가 걸려"], "yu-haram": ["복제하지는 못하며"], "moon-bora": ["강제로 개심시키지는 못한다"],
  "seo-rian": ["통증과 감각이 사라지지 않아"], "jeong-haeun": ["계산 능력이 흔들린다"],
  "evelyn-rose": ["돌아오는 것은 불가능하다", "기억이 조금씩 지워진다", "전투 기술과 감각은 남지만"],
  "kim-doa": ["변신 시간은 최대"], "yu-chaerin": ["오판이 능력의 정확도를"], "yoon-majo": ["심장과 신경계에 부담을"],
  "cheon-sion": ["시간 역행은 불가능하며"], "lee-areum": ["무엇이든 먹을 수 있는 것은"], "mizuno-saki": ["훔치기 어렵다"],
  "park-sion": ["판단이 흔들릴 수 있다"], celestis: ["전능자가 아니며"], "yuda-istarod": ["마음대로 깨는 능력은"],
  "lee-yeonha": ["회복 효율이 급격히 떨어진다"], "jang-miryeong": ["자동으로 알려 주지는"], "jin-seoyun": ["근접전에서는 약하다"],
};

// 비고에서 싣는 문장(문장에 들어 있는 말, "*" 는 전부). 나머지는 작가용 설명이라 싣지 않는다.
var NOTE = {
  MG01: ["*"], MG02: ["TS 변신은", "성인이다"], MG03: ["*"], MG04: ["*"], MG05: ["*"], MG06: ["*"], MG07: ["*"], MG08: ["*"],
  MG10: ["*"], MG11: ["*"], MG12: ["본인은 본인의 외모보다"], MG13: ["*"], MG14: ["*"], MG15: ["*"], MG17: ["지나치게 강한 능력"],
  MG18: ["*"], MG19: ["*"], MG20: ["*"], MG25: ["*"],
  AV01: ["과거 랭킹 3위였으나"], AV03: ["사연 없는 악당이다"], AV04: ["*"],
  IW00: ["직접 대면한", "현계(인간 세계)에", "본래 이름과", "칠좌가 왕을 두려워하는"],
  BR01: ["*"], BR02: ["*"], ENT01: ["*"], ENT02: ["연예계 마법소녀이자"], COR01: ["*"], COR02: ["단순한 미치광이"], COR04: ["*"],
  MER01: ["*"], MER02: ["*"], MER03: ["*"],
};

// 가려진 기록. [id, 등급(1 내부용, 2 기밀), 주제, 칸, [문장에 들어 있는 말]]
// 칸: past 과거, now 지금, personality 성격, appearance 외형, notes 덧붙임. 같은 인물의 같은 주제는 한 건으로 묶인다.
var HIDDEN = [
  ["jeong-haeun", 2, "전쟁 당시의 대면", "past", ["셀레스티스와 직접 대면한"]],
  ["celestis", 2, "전쟁 당시의 대면", "notes", ["직접 대면한"]],
  ["cheon-sion", 2, "이계인에 가까운 존재", "past", ["본질은 이계인에 가깝다", "인간의 나이로는 설명되지 않는", "훨씬 전부터 이어진 관계"]],
  ["cheon-sion", 2, "미지의 스승", "past", ["정체이기도 하다"]],
  ["do-yeonhwa", 2, "미지의 스승", "past", ["그 스승의 정체는"]],
  ["do-yeonhwa", 2, "미지의 스승", "notes", ["스승에 관한 이야기만큼은"]],
  ["adelia", 1, "칠왕정 첩보 임무", "past", ["스파이로 잠입했다가", "도망치는 대신"]],
  ["adelia", 2, "죽음의 진상", "past", ["기습을 받아 사망했다", "육체를 가져가"]],
  ["neisa", 2, "아델리아의 죽음과 몸", "appearance", ["아델리아의 육체를 사용하고 있어"]],
  ["neisa", 2, "아델리아의 죽음과 몸", "now", ["네이사가 그 직후를 기습해", "육체를 가져가", "기습한 이유는"]],
  ["elise-de-armand", 2, "아델리아의 죽음의 진상", "past", ["결투 직후 네이사가 기습했다는 진상"]],
  ["reina-de-rose", 2, "신유안의 희생", "past", ["레이나를 믿고 대신 무너졌지만"]],
  ["shin-yuan", 2, "메르칸과의 계약", "past", ["메르칸과 마주쳤을 때", "살려 보내는 값", "계약은 정확히 지켜졌다", "메르칸의 힘에 침식", "유안을 구하러 가지 않았고", "빈 자리를 딛고"]],
  ["lee-areum", 2, "양부모의 정체", "personality", ["부모가 인간이 아니며"]],
  ["lee-areum", 2, "양부모의 정체", "notes", ["양부모의 애정은", "침략에 협력한다는 사실과"]],
  ["cha-yuri", 2, "이아름의 생체 정보", "past", ["이아름의 생체 정보에서"]],
  ["park-sion", 2, "이아름의 비밀", "past", ["이아름의 비밀을"]],
  ["billion", 2, "개조 전", "past", ["큰 부상을 입은 인간 병사", "로봇으로 개조되었고", "개조 이전을 기억하지 못한다"]],
  ["noah", 1, "기동일 수정", "past", ["기동일이 두 번 수정"]],
  ["evelyn-rose", 1, "엘리제에게 숨김", "past", ["엘리제에게 가볍게 말하거나 숨기려"]],
  ["jang-yura", 2, "아카데미의 기록", "past", ["불법 구금과 고문"]],
  ["yu-chaerin", 1, "별이 떨어진 밤", "past", ["그 사람은 경계 붕괴를 추적하던"]],
  ["yu-chaerin", 1, "별이 떨어진 밤", "notes", ["여신의 사자로 대할"]],
  ["rain-starfall", 1, "별이 떨어진 밤", "notes", ["어린 유채린을 잔해 밖으로"]],
  ["yu-haram", 2, "방송 기록", "past", ["자기 방송 기록이 배신의 증거"]],
  ["mizuno-saki", 2, "훔친 기록", "past", ["훔친 기록 덕분에"]],
  ["nemuri", 2, "잠입 조사", "now", ["전학생으로 위장해"]],
  ["oh-yunseo", 1, "지워진 전쟁 기록", "past", ["전쟁의 실체를 알고 있지만"]],
];

// 관계 단추. [누구, 상대, 문장]
var RELATIONS = [
  ["reina-de-rose", "jeong-haeun", "관리 불가능한 변수로 여긴다."],
  ["jeong-haeun", "reina-de-rose", "말 많은 관리자 정도로 생각한다."],
  ["reina-de-rose", "shin-yuan", "과거 가장 가까웠던 선배."],
  ["shin-yuan", "reina-de-rose", "레이나가 쌓아 올린 이름과 신뢰와 자리를 하나씩 무너뜨리려 한다."],
  ["kang-doyun", "jeong-haeun", "롤모델이다."],
  ["jeong-haeun", "oh-yunseo", "오윤서만이 하은을 단순한 전력으로 취급하지 않는다."],
  ["oh-yunseo", "jeong-haeun", "하은이 겪은 전쟁의 실체를 알고 있다."],
  ["elise-de-armand", "evelyn-rose", "성검이자 파트너."],
  ["evelyn-rose", "elise-de-armand", "사용자이자 파트너."],
  ["elise-de-armand", "adelia", "과거 랭킹 5위 아델리아와 가까운 사이였다."],
  ["elise-de-armand", "lagbar", "아델리아를 죽인 것이 라그바르라고 믿고 그를 원수로 삼는다."],
  ["moon-bora", "yoon-majo", "억지로 고치려 하지 않고, 자극 없는 시간도 함께 견디려 한다."],
  ["moon-bora", "seo-nayun", "비살상 구조 훈련을 함께한다."],
  ["seo-nayun", "moon-bora", "비살상 구조 훈련을 함께한다."],
  ["yu-haram", "nam-sei", "메시지 로그를 방송 소재로 삼으려다 사생활 침해 문제로 크게 다툰다."],
  ["mee", "cha-yuri", "연구용 간식이 맛있다는 이유로 자주 연구실에 간다."],
  ["cha-yuri", "mee", "메에를 연구 대상으로 여긴다."],
  ["kang-taeo", "reina-de-rose", "서로의 가치를 인정하지만, 둘 다 상대가 자기 위에 서는 것은 원하지 않는다."],
  ["ophelia-jin", "kang-taeo", "함께 움직이지만 서로 신뢰하지 않는다."],
  ["ophelia-jin", "min-rahee", "에이전시 소속 랭커를 관리한다."],
  ["ophelia-jin", "lee-yeonha", "에이전시 소속 랭커를 관리한다."],
  ["rain-starfall", "yuda-istarod", "같은 경계인 출신의 친구."],
  ["yuda-istarod", "rain-starfall", "같은 경계인 출신의 친구."],
  ["yoon-sehyeok", "kang-myeongju", "기업 연합 안에서 서로 견제한다."],
  ["kang-myeongju", "yoon-sehyeok", "기업 연합 안에서 서로 견제한다."],
  ["jang-miryeong", "kang-myeongju", "협력하지만, 회장이 감정적 이유로 결정을 미루면 정면으로 비판한다."],
  ["billion", "noah", "노아의 프로토타입이다."],
  ["noah", "billion", "프로토타입은 기업 연합 소속 로봇 빌리온이다."],
  ["han-taegeon", "baek-nari", "자주 팀을 이루지만 자주 말다툼을 한다."],
  ["baek-nari", "han-taegeon", "자주 팀을 이루지만 자주 말다툼을 한다."],
  ["arbel", "merkan", "존재의 서열과 힘의 가격을 두고 충돌한다."],
  ["merkan", "arbel", "존재의 서열과 힘의 가격을 두고 충돌한다."],
  ["sitriel", "neisa", "무엇에도 들뜨지 않는 네이사를 지루해한다."],
  ["neisa", "sitriel", "시트리엘의 능력을 고칠 데가 너무 많다고 평가한다."],
  ["orgam", "merkan", "모든 것을 먹어 소유하려는 폭식과 모든 것을 거래로 묶으려는 탐욕의 대립."],
  ["lagbar", "arbel", "완벽한 통제를 두고 충돌한다."],
  ["arbel", "lagbar", "통제된 완벽함과 통제 불가능한 전투력의 충돌."],
  ["nemuri", "lagbar", "행동을 늦추는 패시브와 전쟁을 고조시키는 패시브가 상극이다."],
  ["nemuri", "sitriel", "욕망을 증폭하는 힘과 행동 의지를 꺾는 힘은 서로의 효과를 상쇄하거나 뒤틀 수 있다."],
];

/* ───── 읽기 ───── */
var md = fs.readFileSync(SRC, "utf8").split("\n");
var sec = {}, cur = null;
md.forEach(function (line) {
  var m = line.match(/^## ((?:MG|AV|IW|SE|BR|ENT|COR|MER)\d+) — /);
  if (m) { cur = m[1]; sec[cur] = {}; return; }
  if (/^## 기록 — 아델리아/.test(line)) { cur = "AD"; sec[cur] = {}; return; }
  if (/^#{1,2} /.test(line)) { cur = null; return; }
  if (cur) { var k = line.match(/^- \*\*(.+?)\*\*: (.*)$/); if (k) sec[cur][k[1]] = k[2]; }
});
var keywords = {};
md.forEach(function (line) {
  var m = line.match(/^\| (MG\d\d) \| [^|]+ \| [^|]+ \| [^|]+ \| ([^|]+) \|$/);
  if (m) keywords[m[1]] = m[2].trim().split(/,\s*/);
});

var josa = function (word, pair) {
  var c = word.charCodeAt(word.length - 1), has = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
  return { "은": has ? "은" : "는", "는": has ? "은" : "는", "이": has ? "이" : "가", "가": has ? "이" : "가", "을": has ? "을" : "를", "를": has ? "을" : "를", "과": has ? "과" : "와", "와": has ? "과" : "와" }[pair];
};
var clean = function (s) {
  s = String(s || "").replace(/`/g, "");
  s = s.replace(/\((?:MG|AV|IW|SE|BR|ENT|COR|MER)\d+\)/g, "");
  s = s.replace(/((?:MG|AV|IW|SE|BR|ENT|COR|MER)\d\d)(은|는|이|가|을|를|과|와)?/g, function (m, code, j) {
    if (!NAME[code]) throw new Error("이름을 모르는 코드 " + code);
    return NAME[code] + (j ? josa(NAME[code], j) : "");
  });
  return s.replace(/\s{2,}/g, " ").trim();
};
var unmarked = function (s) { return clean(s).replace(/\s*[♡♧♤]/g, ""); };
var undefinedValue = function (s) { return !s || /^\(미정\)/.test(s); };
var sentences = function (s) { return split(s); };

/* ───── 만들기 ───── */
var old = (function () {
  var sb = { window: {} };
  try { vm.runInNewContext(fs.readFileSync(OUT, "utf8"), sb); } catch (e) { return {}; }
  var o = {};
  (sb.window.CHARACTERS || []).forEach(function (c) { o[c.id] = c; });
  return o;
})();

var people = ROSTER.map(function (r, i) {
  var code = r[0], id = r[1], s = sec[code];
  if (!s) throw new Error(code + " 구역이 정리본에 없습니다.");
  var c = { id: id, no: i + 1, name: r[2], alias: r[3] || null, kind: r[5], role: r[6], faction: r[4], rank: r[7] == null ? null : r[7], badge: r[8] || null };
  c.traits = (/^MG/.test(code) ? keywords[code] : TRAITS[id] || []).filter(function (t) { return (TRAIT_DROP[id] || []).indexOf(t) === -1; });
  if (!c.traits) throw new Error(id + " 성격 태그 없음");
  c.summary = SUMMARY[id];
  if (!c.summary) throw new Error(id + " 개요 없음");

  var abName = s["고유능력명"], abText = s["능력설명"] || s["고유능력"];
  if (!undefinedValue(abName) && abText && !undefinedValue(abText)) {
    var sent = sentences(clean(abText)), lim = [], keep = [];
    sent.forEach(function (t) { ((LIMIT[id] || []).some(function (k) { return t.indexOf(k) !== -1; }) ? lim : keep).push(t); });
    (LIMIT[id] || []).forEach(function (k) { if (!lim.some(function (t) { return t.indexOf(k) !== -1; })) throw new Error(id + " 한계 문장 없음: " + k); });
    c.ability = { name: clean(abName), text: keep.join(" ") };
    if (lim.length) c.ability.limit = lim.join(" ");
  }
  Object.keys(s).forEach(function (k) {
    if (k.indexOf("왕의 패시브") === 0) c.passive = { name: clean(k.split("—")[1] || "").trim(), text: clean(s[k]) };
  });
  var list = function (v) { return undefinedValue(v) ? [] : sentences(clean(v)); };
  if (s["외형"] && !undefinedValue(s["외형"])) c.appearance = list(s["외형"]);
  if (s["성격"] && !undefinedValue(s["성격"])) c.personality = list(s["성격"]);
  if (s["말투"] && !undefinedValue(s["말투"])) c.voice = { text: unmarked(s["말투"]) };
  var q = Object.keys(s).filter(function (k) { return k.indexOf("대표 대사") === 0; })[0];
  if (q && !undefinedValue(s[q])) c.quote = clean(s[q]).replace(/[“”]/g, "");
  var past = list(s["관계·서사"] || s["과거"]);
  var labeled = function (label, v) { var l = list(v); if (l.length) l[0] = label + ": " + l[0]; return l; };
  var now = list(s["현재·악행"]).concat(labeled("목표", s["목표"]), labeled("잠입 임무", s["잠입 임무"]));
  var notes = list(s["비고"]).filter(function (t) { return (NOTE[code] || []).some(function (k) { return k === "*" || t.indexOf(k) !== -1; }); });
  if (id === "billion") { var all = list(s["비고"]); past = all.slice(0, 5); notes = []; }
  if (id === "ryu-seogyeong") {
    // 이름 미정 전술 교관. 예전 류서경의 역할을 이어받는다.
    past = ["아카데미 전술 교관이다.", "자신이 내린 작전 결정 때문에 가족을 잃었다.", "결정의 갈림길마다 희생을 숫자로 저울질했고, 그 숫자가 틀렸다면 가족은 헛되이 죽은 것이 된다.", "그래서 그녀는 체계를 의심하지 않고, 그 가장 충실한 집행자가 되었다."];
    c.ability = { name: "저울눈", text: old["ryu-seogyeong"] ? old["ryu-seogyeong"].ability.text : "", limit: old["ryu-seogyeong"] ? old["ryu-seogyeong"].ability.limit : "" };
    c.voice = { text: "낮고 고른 존댓말. 반박하지 않고 숫자로 답한다." };
    notes = [];
  }
  c.past = past; if (now.length) c.now = now; if (notes.length) c.notes = notes;
  c.relations = RELATIONS.filter(function (r) { return r[0] === id; }).map(function (r) { return { id: r[1], note: r[2] }; });
  c.internal = []; c.secret = [];
  var o = old[id];
  if (o) ["color", "image", "imageFocus", "emotes"].forEach(function (k) { if (o[k] != null) c[k] = o[k]; });
  return c;
});
var byId = {}; people.forEach(function (c) { byId[c.id] = c; });
people.forEach(function (c) { c.relations.forEach(function (r) { if (!byId[r.id]) throw new Error(c.id + " 관계 상대 없음 " + r.id); }); });

// 가려진 기록
var used = {};
HIDDEN.forEach(function (h) {
  var c = byId[h[0]], field = h[3];
  if (!c) throw new Error("없는 인물 " + h[0]);
  var rec = c[h[1] === 2 ? "secret" : "internal"].filter(function (r) { return r.topic === h[2]; })[0];
  if (!rec) { rec = { topic: h[2], text: "", _t: [] }; c[h[1] === 2 ? "secret" : "internal"].push(rec); }
  h[4].forEach(function (k) {
    var hit = false;
    (c[field] || []).forEach(function (t, i) {
      var text = typeof t === "string" ? t : t.t;
      if (text.indexOf(k) === -1) return;
      hit = true;
      c[field][i] = { t: text, ref: h[2] };
      if (rec._t.indexOf(text) === -1) rec._t.push(text);
    });
    if (!hit) throw new Error(c.id + " " + field + " 에서 못 찾음: " + k);
  });
});
people.forEach(function (c) {
  ["internal", "secret"].forEach(function (k) { c[k].forEach(function (r) { r.text = r._t.join(" "); delete r._t; }); });
});

var json = JSON.stringify(people, null, 1).replace(/\n\s*\{\n\s*"t": ("(?:[^"\\]|\\.)*"),\n\s*"ref": ("(?:[^"\\]|\\.)*")\n\s*\}/g, "\n  { \"t\": $1, \"ref\": $2 }");
var head = [
  "// 인물 49인 데이터. 이 파일이 사이트의 인물 정본이다.",
  "// 원문은 docs/source/settings-integrated.md(캐릭터 설정 통합 정리본)이고, 이 파일은 tools/qa/build-canon.js 가 만든다. 손으로 고치지 않는다.",
  "// 고칠 때는 build-canon.js 의 표(개요, 분류, 가릴 문장)나 정리본을 바꾸고 `node tools/qa/build-canon.js` 를 다시 돌린다.",
  "// 열람 등급 기준",
  "//   공개   : 대화를 시작하기 전에 알아도 되는 것.",
  "//   내부용 : 아카데미 안이나 가까운 사람이라면 아는 것. internal 에 넣는다.",
  "//   기밀   : 본인이나 소수만 알거나, 사건의 진상에 해당하는 것. secret 에 넣는다.",
  "//   한 사실은 사이트 어디에서나 같은 등급이어야 한다.",
  "// 칸: summary 개요, traits 성격 태그, personality 성격, past 과거, now 지금(칠좌와 왕), appearance 외형, notes 덧붙임, voice 말투,",
  "//   ability 능력(name, text, limit), passive 왕의 패시브(칠좌), quote 카드의 대표 대사.",
  "// personality, past, now, appearance, notes 는 정리본을 문장 경계에서만 나눈 목록이다. 이어 쓰면 정리본과 같다.",
  "//   항목이 글자면 공개 문장이고, { t, ref } 면 같은 인물의 가려진 기록(주제 ref)과 같은 등급으로 먹칠되어 함께 열린다.",
  "// color 는 인물 고유색(프로필 카드의 서명 색), image 는 평상시 표정 그림 경로, emotes 는 표정 그림, imageFocus 는 목록 카드의 사진 맞춤값이다.",
  "// 표정·기술 그림 규격: 가로 3:2(권장 1536x1024), 글자 없음. 목록 카드의 작은 사진은 세로 칸이라 얼굴을 그림 가운데 절반 안에 둔다.",
  "window.CHARACTERS = " + json + ";",
  "",
].join("\n");
fs.writeFileSync(OUT, head);
var h = 0; people.forEach(function (c) { h += c.internal.length + c.secret.length; });
console.log("인물 " + people.length + "인, 가려진 기록 " + h + "건");
