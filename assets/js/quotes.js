// 입장 연출에 쓰는 인물 대사.
// 처음 방문하면 first 가 true 인 대사를 보여 주고, "다시 보기"를 누를 때마다 나머지 대사를 돌아가며 보여 준다.
// id 는 인물 기록의 id 다. 인물에게 고유색이 있으면 그 색으로 빛나고, 없으면 경계빛으로 빛난다.
// lines 는 한 줄 또는 두 줄. 대사가 한 글자씩 켜진 뒤 정전되고 로고가 떠오른다.
// beats 는 글자마다의 호흡이다. 비워 두면 띄어쓰기와 문장부호를 보고 자동으로 정한다.
//   hold 다음 글자까지의 간격(ms), sweep 빛이 글자를 채우는 시간(초), e 강세(0~1), f 종소리 높이(Hz, 0은 무음), rest 마지막 밝기
// source: "card" 는 프로필 카드의 대사, "canon" 은 설정집에 있는 말, "written" 은 인물 설정에 맞춰 새로 쓴 대사.
window.QUOTES = [
  {
    id: "jeong-haeun", name: "정하은", alias: "제로 나이트", first: true, source: "written",
    lines: ["“끝난 게 아니야.", "잠시 멈춰 있는 거지.”"],
    beats: [
      { hold: 170, sweep: 1.6, e: 0, f: 0 },
      { hold: 290, sweep: 0.5, e: 0.95, f: 523.3 },
      { hold: 165, sweep: 0.5, e: 0.4, f: 466.2 },
      { hold: 330, sweep: 0.7, e: 0.3, f: 440 },
      { hold: 145, sweep: 0.45, e: 0.45, f: 392 },
      { hold: 165, sweep: 0.5, e: 0.55, f: 440 },
      { hold: 380, sweep: 1.0, e: 0.6, f: 349.2 },
      { hold: 1050, sweep: 0.9, e: 0, f: 0 },
      { hold: 230, sweep: 0.65, e: 0.3, f: 392 },
      { hold: 760, sweep: 1.4, e: 0.25, f: 440 },
      { hold: 205, sweep: 0.6, e: 0.6, f: 466.2 },
      { hold: 185, sweep: 0.55, e: 0.45, f: 440 },
      { hold: 145, sweep: 0.45, e: 0.3, f: 392 },
      { hold: 145, sweep: 0.45, e: 0.25, f: 349.2 },
      { hold: 230, sweep: 0.7, e: 0.25, f: 329.6 },
      { hold: 620, sweep: 1.7, e: 0.12, f: 293.7, rest: 0.82, len: 2.6 },
      { hold: 380, sweep: 1.1, e: 0, f: 0, rest: 0.82 },
      { hold: 0, sweep: 1.4, e: 0, f: 0 },
    ],
  },
  { id: "reina-de-rose", name: "레이나 드 로즈", alias: "로즈 세라핌", lines: ["“오늘도 평안한 하루가", "되시기를♡”"], source: "card" },
  { id: "lee-seohyeon", name: "이서현", alias: "트윈 시그널", lines: ["“실례하겠습니다.”"], source: "canon" },
  { id: "oh-yunseo", name: "오윤서", alias: "라스트 라이트", lines: ["“불이 꺼지면 숫자부터 세라.", "돌아온 인원이 맞는지.”"], source: "written" },
];
