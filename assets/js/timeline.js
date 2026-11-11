// 연표와 지도 데이터.
// level: 0 공개, 1 내부용, 2 기밀. 사건 자체의 level 이 1 이상이면 날짜만 보이고 내용은 통째로 가린다.
// more 는 공개 사건에 딸린 가려진 덧붙임.
window.ERAS = [
  {
    id: "before", title: "이전",
    events: [
      { when: "약 300년 전", title: "첫 균열", level: 2, text: "경계에 처음 금이 간다. 이계의 왕과 인간 쪽 증인이 「임시 봉합」 계약을 맺는다.", topic: "seal" },
    ],
  },
  {
    id: "war", title: "전쟁기",
    events: [
      { when: "20년 전", day: "7월 12일", title: "칠월의 밤", level: 0, text: "하란항 상공이 찢어져 7시간 동안 이계 생물이 쏟아진다. 사망·실종 4,172명. 열두 명이 처음으로 마법소녀가 된다. 회색 구역이 생긴다.",
        people: ["oh-yunseo", "park-sion"], place: "haran-port", topic: "july-night",
        more: [{ level: 1, text: "천시온이 부두에서 학장 라명숙을 구한다." }] },
      { when: "16년 전", title: "랭킹제 도입", level: 0, text: "방위청이 예산 배분 기준으로 랭킹제를 들인다.", topic: "academy" },
      { when: "15년 전", title: "첫 비공식 접촉", level: 1, text: "왕과 아카데미가 처음으로 비공식 접촉을 한다. 열아홉의 유다 이스타로드가 통역을 맡는다.", people: ["yuda-istarod"], topic: "seal" },
      { when: "12년 전", title: "산업연합 회장 취임", level: 0, text: "강명주가 하란 산업연합 회장이 된다.", people: ["kang-myeongju"], topic: "consortium" },
      { when: "8년 전", title: "월곶 하수 터널", level: 1, text: "월곶 해안 하수 터널 소탕 작전에서 강세아가 동료 둘을 잃고 홀로 살아남는다.", people: ["kang-sea"], place: "wolgot" },
      { when: "7년 전", title: "윤하진 데뷔", level: 0, text: "열일곱의 윤하진이 아이돌 마법소녀로 데뷔한다.", people: ["yoon-hajin"] },
      { when: "6년 전", day: "9월 4일", title: "안개고개 전투", level: 0, text: "열여덟의 정하은이 균열을 멈춰 세운다. 36명 중 11명이 돌아오고 하늘에 340미터의 흉터가 남는다. 오르텐 마을이 사라진다. 휴전이 시작된다.",
        people: ["jeong-haeun", "maria-orten", "jin-gaon", "mee"], place: "angae", topic: "truce",
        more: [
          { level: 1, text: "이계의 왕 셀레스티스가 처음으로 직접 모습을 드러낸다." },
          { level: 2, text: "아카데미는 협상 시간을 벌려고 오르텐 마을의 대피령을 사흘 늦췄다." },
        ] },
    ],
  },
  {
    id: "truce", title: "휴전기",
    events: [
      { when: "5년 전", title: "경계의 울음", level: 1, text: "레인 스타폴이 경계가 무너지는 곳을 쫓기 시작한다.", people: ["rain-starfall"] },
      { when: "4년 전", title: "칠좌 재편", level: 0, text: "이계의 칠좌가 재편되고 라그바르가 제6좌에 오른다.", people: ["lagbar"], topic: "thrones",
        more: [
          { level: 1, text: "같은 해 강태오가 외부 감독관으로 감독부에 파견된다." },
          { level: 2, text: "늦가을, 이서현이 지하 공동구에서 이계 기생체 쿠오와 계약한다." },
        ] },
      { when: "3년 전", title: "폐항 사건", level: 0, text: "폐쇄 부두에서 사건이 일어난다. 상세는 공개되지 않았다.", place: "closed-pier",
        more: [{ level: 1, text: "이계인 포로가 석 달 동안 구금됐다." }] },
      { when: "3년 전", day: "겨울", title: "체육관 오염 사고", level: 0, text: "하란시립체육관 지하 창고에서 이계 오염 사고가 난다. 복서 강도윤의 몸이 바뀐다.", people: ["kang-doyun"], place: "gym",
        more: [{ level: 1, text: "같은 해 인공 마법소녀 노아가 기동하고, 윤마조가 시한부 진단을 받는다." }] },
      { when: "2년 전", day: "11월 20일", title: "제3구 지하상가 대피전", level: 0, text: "제3구 지하상가에서 대피전이 벌어진다. 이 사건 뒤 3위가 말소된다.", people: ["reina-de-rose", "shin-yuan"], place: "district-3",
        more: [
          { level: 1, text: "안쪽 B동에 남은 일곱 명이 「자진 이탈자」로 분류되고 송하연이 사망한다. 3위 신유안이 반역한다." },
          { level: 2, text: "위원회는 이 사건을 「현장 판단」으로 종결했다." },
        ] },
      { when: "1년 전", day: "3월", title: "5위 전사", level: 0, text: "5위 권도하가 전사한다. 5위는 공석이 된다.", topic: "academy",
        more: [
          { level: 1, text: "칠왕정에 잠입하는 첩보 임무였다. 제6좌 라그바르와의 결투에서 전사했다." },
          { level: 2, text: "감독부가 위협 등급 4를 3으로 공시해 지원이 줄었다." },
        ] },
      { when: "올봄", title: "휴전 기념식", level: 0, text: "휴전을 기념하는 행사가 열린다.", topic: "truce",
        more: [{ level: 1, text: "기념식장 뒤편에서 오윤서와 마리아 오르텐이 마주친다." }] },
      { when: "3개월 전", title: "전학생", level: 2, text: "제7좌 네무리가 전학생으로 아카데미에 잠입한다.", people: ["nemuri"] },
    ],
  },
];

// 지도. x, y 는 지도 그림 안의 위치(퍼센트)이며 지금 배치는 임시다.
// 설정집에 방위가 적힌 것은 서해안뿐이라 바다를 서쪽에 두고 나머지는 관계만 맞췄다.
window.PLACES = [
  { id: "haran-port", name: "하란항", x: 39.5, y: 50.5, note: "칠월의 밤의 진원", text: "20년 전 7월 12일 이곳 상공이 찢어졌다. 사람들이 칠월의 밤이라 부르는 하란항 대균열의 한가운데다.", people: ["oh-yunseo", "park-sion"], topic: "july-night" },
  { id: "closed-pier", name: "폐항", x: 38, y: 70, note: "폐쇄 부두", text: "지금은 닫힌 부두. 3년 전 이곳에서 사건이 있었다.", people: [],
    internal: [{ topic: "폐항 사건", text: "이계인 포로가 석 달 동안 구금됐다." }] },
  { id: "grey-zone", name: "회색 구역", x: 50, y: 43, note: "이계 균류 오염지", text: "하란항 일대에 이계 균류가 뿌리내린 땅. 토양과 수계가 잠식됐고 감염자는 손끝부터 회색으로 굳는다.", people: ["kang-myeongju", "yoon-sehyeok", "mano-akira"], topic: "grey-zone" },
  { id: "gocheol", name: "고철동 폐공장 지대", x: 59, y: 30, note: "버려진 공장들", text: "최소라가 자란 동네다. 이아름은 이 폐공장 지대에서 이계인 부부에게 발견돼 그들의 딸로 자랐다.", people: ["choi-sora", "lee-areum"] },
  { id: "district-3", name: "제3구 지하상가", x: 70, y: 59, note: "2년 전 대피전", text: "2년 전 11월 20일 대피전이 벌어진 곳이다.", people: ["reina-de-rose", "shin-yuan"],
    internal: [{ topic: "B동", text: "안쪽 B동에 남은 일곱 명이 「자진 이탈자」로 분류됐고 송하연이 사망했다." }] },
  { id: "gym", name: "하란시립체육관", x: 64, y: 80, note: "3년 전 오염 사고", text: "3년 전 겨울 지하 창고에서 이계 오염 사고가 났다. 전국대회 은메달리스트였던 복서 강도윤의 몸이 이곳에서 바뀌었다.", people: ["kang-doyun"],
    secret: [{ topic: "오염체", text: "지하 창고의 오염체는 제5좌 오르감 계통이다." }] },
  { id: "wolgot", name: "월곶 해안", x: 33.5, y: 20, note: "해수욕장과 하수 터널", text: "하란 서해안의 해수욕장. 강세아가 안전요원으로 일하던 곳이다.", people: ["kang-sea"],
    internal: [{ topic: "하수 터널", text: "8년 전 해안 하수 터널 소탕 작전에서 강세아가 동료 윤새봄과 표나래를 잃었다." }] },
  { id: "academy", name: "마법소녀 아카데미", x: 82, y: 32, note: "교육기관이자 방위조직", text: "성인 마법소녀를 기르는 전문 기관. 학장은 라명숙이다. 학생위원회, 감독부, 위원회, 연구부가 있다.", people: ["reina-de-rose", "jeong-haeun", "oh-yunseo"], topic: "academy" },
  { id: "angae", name: "안개고개", x: 94, y: 9, note: "하란 바깥 · 6년 전 전투지", text: "하란 바깥의 고개. 오르텐 마을과 송씨 농장이 있던 곳이다. 6년 전 9월 4일 정하은이 이곳에서 균열을 멈춰 세웠다.", people: ["jeong-haeun", "maria-orten", "mee"], topic: "truce", off: true },
];
