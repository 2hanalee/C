// 연표와 지도 데이터. 원문은 docs/source/settings-integrated.md(캐릭터 설정 통합 정리본)이다.
// 정리본에는 사건의 날짜가 없다. 그래서 날짜 대신 알려진 시기만 적고, 시점이 정해지지 않은 사건은 따로 묶었다.
// level: 0 공개, 1 내부용, 2 기밀. 사건 자체의 level 이 1 이상이면 시기만 보이고 내용은 통째로 가린다.
// more 는 공개 사건에 딸린 가려진 덧붙임.
window.ERAS = [
  {
    id: "before", title: "전쟁기",
    events: [
      { when: "이계 침략 초기", title: "박시온의 가족", level: 0, text: "본인의 가족이 이계 침략 초기에 희생되었다.", people: ["park-sion"] },
      { when: "과거 이계 전쟁", title: "정하은과 셀레스티스", level: 2, text: "전쟁 당시 이계의 왕 셀레스티스와 직접 대면한 적이 있으며, 그 만남의 내용은 공식 기록에 남아 있지 않다.", people: ["jeong-haeun", "celestis"] },
    ],
  },
  {
    id: "open", title: "시점 미정",
    events: [
      { when: "시점 미정", title: "별이 떨어진 밤", level: 0, text: "하늘에서 별처럼 빛나는 마력 덩어리가 쏟아진 사건이다. 경계가 무너지며 일어난 사고였고, 마을은 큰 피해를 입었다.", people: ["yu-chaerin"], topic: "border" },
      { when: "시점 미정", title: "3위의 삭제", level: 0, text: "과거 기록에서 3위는 '삭제'로 처리되었다.", people: ["shin-yuan"], topic: "academy" },
      { when: "시점 미정", title: "5위의 사망", level: 0, text: "5위는 '사망'으로 처리되었다. 5위 공석의 주인은 기사도를 신조로 삼은 정의로운 마법소녀 아델리아였다.", people: ["adelia"], topic: "academy" },
      { when: "시점 미정", title: "10위의 실종", level: 0, text: "10위는 '실종'으로 처리되었다. 10위가 왜, 어떻게 사라졌는지는 아무도 모른다.", people: [], topic: "academy" },
    ],
  },
  {
    id: "now", title: "지금",
    events: [
      { when: "지금", title: "네무리의 전학", level: 0, text: "나태의 좌 네무리가 아카데미 전학생으로 들어와 성실한 학생으로 지낸다.", people: ["nemuri"], topic: "throne" },
    ],
  },
];

// 장소. id 는 주소(timeline.html#id)로 쓰이므로 이름이 바뀌어도 그대로 둔다.
window.PLACES = [
  { id: "academy", name: "하란 아카데미", x: 52, y: 50, note: "인천, 성인 마법소녀 교육기관이자 방위 조직", text: "한국 인천에 있는 성인 마법소녀 전문 교육기관이자 이계 방위 조직이다. 일반 중·고등학교가 아니다.", people: ["reina-de-rose", "jeong-haeun", "oh-yunseo", "kang-taeo"], topic: "academy" },
];
