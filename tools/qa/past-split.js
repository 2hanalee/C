// v3 인물 문단을 문장 경계에서만 나눈다. 글자는 하나도 바꾸지 않는다.
// 경계: 마침표·물음표·느낌표(와 그 뒤의 닫는 따옴표) 다음의 공백 하나.
// 나눈 문장을 공백 하나로 이으면 원문과 같아야 한다.
function split(text) {
  var out = [], re = /[.!?]['"」』)]*(?= )/g, last = 0, m;
  while ((m = re.exec(text))) {
    var end = m.index + m[0].length;
    out.push(text.slice(last, end));
    last = end + 1; // 공백 하나를 건너뛴다
  }
  out.push(text.slice(last));
  if (out.join(" ") !== text) throw new Error("문장 나누기가 원문을 바꿨습니다: " + text.slice(0, 30));
  return out;
}
module.exports = split;
