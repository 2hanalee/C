// 입장 연출에 쓰는 인물 대사. 모두 캐릭터 설정 통합 정리본(docs/source/settings-integrated.md)의 대표 대사다.
// 처음 방문하면 first 가 true 인 대사를 보여 주고, "다시 보기"를 누를 때마다 나머지 대사를 돌아가며 보여 준다.
// id 는 인물 기록의 id 다. 인물에게 고유색이 있으면 그 색으로 빛나고, 없으면 경계빛으로 빛난다.
// lines 는 한 줄 또는 두 줄. 대사가 한 글자씩 켜진 뒤 정전되고 로고가 떠오른다.
// beats 는 글자마다의 호흡이다. 비워 두면 띄어쓰기와 문장부호를 보고 자동으로 정한다.
//   hold 다음 글자까지의 간격(ms), sweep 빛이 글자를 채우는 시간(초), e 강세(0~1), f 종소리 높이(Hz, 0은 무음), rest 마지막 밝기
window.QUOTES = [
  { id: "jeong-haeun", name: "정하은", alias: "제로 나이트", first: true, source: "canon", lines: ["“1위 보상? 필요 없어.", "방에 인터넷만 잘 들어오면 돼.”"] },
  { id: "reina-de-rose", name: "레이나 드 로즈", alias: "로즈 세라핌", source: "canon", lines: ["“걱정하지 마세요. 여러분이 가장 좋은 선택을", "할 수 있도록, 제가 선택지를 정리해 두었으니까요.”"] },
  { id: "lee-seohyeon", name: "이서현", alias: "트윈 시그널", source: "canon", lines: ["“쿠오, 지금은 조용히 해 주세요.”"] },
  { id: "oh-yunseo", name: "오윤서", alias: "라스트 라이트", source: "canon", lines: ["“영웅 흉내는 그만둬.", "살아남는 건 박수받는 것보다 훨씬 지저분하거든.”"] },
];
