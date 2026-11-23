// 정리본에 없어서 지운 설정과 기호가 사이트에 남았는지 훑는다. 남은 곳을 파일과 줄로 알려 준다.
//   node tools/qa/scan-removed.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const WORDS = ['칠월의 밤', '안개고개', '휴전', '회색 구역', '예고 장부', '임시 봉합', '방위청', '판정위원회', '홍보팀', '권도하', '온새별', '마노 아키라', '최소라', '윤하진', '진가온',
  '파스텔', '녹 구역', '고철동', '부평', '송도', '월미', '신포동', '340미터', '4,172', '만석동', '시안 v0', '열두 명', '라명숙'];
// 말투 기호와 능력계열 기호. 이름과 대사 안의 기호(임무 완료☆, 주인님♡)는 허용한다
const SYMBOLS = /[♧♤○●◇□■★△◐]|☆(?!")|♡(?!")/;
const ALLOW = ['임무 완료☆', '주인님♡'];
const files = ['index.html', 'world.html', 'timeline.html', 'characters.html', 'webtoon.html'].concat(fs.readdirSync(path.join(ROOT, 'assets/js')).filter((f) => f.endsWith('.js')).map((f) => 'assets/js/' + f));
let bad = 0;
files.forEach((f) => {
  fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n').forEach((line, i) => {
    let t = line; ALLOW.forEach((a) => { t = t.split(a).join(''); });
    if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
    WORDS.forEach((w) => { if (t.indexOf(w) !== -1) { bad++; console.log(`${f}:${i + 1} 「${w}」 ${line.trim().slice(0, 80)}`); } });
    if (SYMBOLS.test(t) && !/^\s*\/\//.test(line)) { bad++; console.log(`${f}:${i + 1} 기호 ${line.trim().slice(0, 80)}`); }
  });
});
console.log(bad ? '남은 곳 ' + bad + '건' : '남은 곳 없음');
process.exit(bad ? 1 : 0);
