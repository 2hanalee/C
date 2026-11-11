// 웹툰 데이터.
// sample: true 인 동안에는 화면에 "견본" 안내가 뜬다. 실제 회차를 넣으면 false 로 바꾼다.
// cover 와 thumb 는 16:9 그림 경로, cuts 는 세로로 이어 붙일 컷 그림 경로 목록.
// 그림 경로가 비어 있으면 자리 표시 판으로 대신한다.
window.WEBTOON = {
  sample: true,
  title: "제목 미정",
  genre: "어반 판타지",
  schedule: "연재 요일 미정",
  intro: "웹툰 소개 문구가 들어갈 자리입니다.",
  cover: "",
  episodes: [
    { no: 1, title: "회차 제목", date: "업로드 날짜", thumb: "", cuts: ["", "", ""] },
    { no: 2, title: "회차 제목", date: "업로드 날짜", thumb: "", cuts: ["", "", ""] },
    { no: 3, title: "회차 제목", date: "업로드 날짜", thumb: "", cuts: ["", "", ""] },
  ],
};
