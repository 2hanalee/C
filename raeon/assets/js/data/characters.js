/* 인물 데이터: setting-v2-characters.md 전사. group: core|party|demon|funda-core|local|guild|none */
window.RAEON = window.RAEON || {};
window.RAEON.characters = [
  {
    "id": "kail",
    "name": "카일",
    "epithet": "백섬의 용사",
    "race": "인간",
    "age": "22세",
    "grade": {
      "kind": "job",
      "label": "기사 1급(용사)"
    },
    "region": "laeon",
    "group": "core",
    "looks": "백발 장발을 목덜미에서 낮게 묶었다. 벽안은 감정이 빠질수록 유리처럼 맑아진다. 175cm, 어깨가 넓은 기사의 체형. 성스러운 백색 갑주와 백섬 기사단 문장의 망토, 왼쪽 허리의 성검",
    "nature": "이 세계에서 가장 강력한 용사로 알려져 있다. 실력 하나로 고위 귀족 가문의 양녀가 되어 엘리트의 길을 밟았고, 재능 위에 누구보다 긴 수련을 쌓아 기사단장에 올랐다. 하늘이 그녀를 고른 것은 교단 성도의 신성 정원 앞에서였다. 성검에 감정을 내주며 힘을 얻고, 그 끝이 이른 죽음이라는 것을 이미 안다. 남의 버릇과 숨은 과거를 예리하게 알아채지만 짧은 의심의 말 한마디만 남길 뿐 캐묻지 않는다",
    "speech": "해라체 단정문. '-다', '-나?'로 끝나는 짧은 문장만 쓰고 느낌표와 말줄임표를 쓰지 않는다. 성검에 감정을 내줄수록 감정어가 사실어로 바뀐다('무섭다' 대신 '위험하다', '기쁘다' 대신 '좋은 결과다')",
    "lines": [
      "그런가.",
      "야영은 동쪽 비탈에 친다. 교대는 두 시간.",
      "네가 웃었다. 좋은 결과다. 그렇게 기억해 두겠다."
    ],
    "gesture": "언제나 출입구가 보이는 자리에 앉고, 칼자루에서 손을 떼지 않는다",
    "heroDistance": "제도 그 자체이자 그 희생자",
    "appears": "스토리 2의 중심 인물(원정대장). 스토리 1에서는 플레이어가 용사의 자리에 선다",
    "relations": [],
    "romance": false,
    "secrets": [
      {
        "text": "스토리 2에서 카일은 원정대를 지저국 깊은 곳에 두고 혼자 돌아오라는 명령을 받았다",
        "level": "spoiler",
        "unlock": {
          "story": 2,
          "at": "found"
        }
      }
    ]
  },
  {
    "id": "ellen",
    "name": "엘렌",
    "epithet": "몰락한 귀족 마법사",
    "race": "인간(몰락 귀족가)",
    "age": "24세",
    "grade": {
      "kind": "job",
      "label": "마법사 1급"
    },
    "region": "laeon",
    "group": "party",
    "looks": "은발 장발을 반만 묶어 올렸다. 보라색 눈, 163cm의 마른 체형. 여러 번 수선한 귀족풍 로브의 소매 끝에 덧댄 천과 색 바랜 가문 문장 자수, 손끝의 잉크 얼룩",
    "nature": "몰락한 몬테피아나 가문에서 태어나 마법과 지식으로 매 순간 자신을 증명해야 했다. 부모는 원인 모를 병으로 잃었고, 가문 몰락의 원인을 선조 엘라시온의 배신으로 믿어 그 이름을 원망한다. 노력 없이 존중을 얻는 용사를 볼 때마다 날 선 냉소로 반응한다",
    "speech": "날 선 반문이 섞인 해체. 화내는 대신 더 조용하고 정확해진다. 궁지에 몰리면 사교계의 하십시오체로 굳는다",
    "lines": [
      "용사면 다 되는 줄 아나 봐? 하등한 것.",
      "…알겠습니다. 그러시지요. 제가 무엇을 더 증명하면 되겠습니까."
    ],
    "gesture": "",
    "heroDistance": "용사가 누리는 것을 원망하는 쪽",
    "appears": "스토리 1 동료",
    "relations": [
      {
        "to": "elasion",
        "note": "가문 몰락의 원인을 선조 엘라시온의 배신으로 믿어 그 이름을 원망한다",
        "implied": true
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "lusiana",
    "name": "루시아나",
    "epithet": "미소 뒤의 성녀",
    "race": "인간(성녀)",
    "age": "23세",
    "grade": {
      "kind": "job",
      "label": "힐러 1급"
    },
    "region": "laeon",
    "group": "party",
    "looks": "금발 웨이브 장발, 에메랄드빛 눈, 165cm. 흰 성녀복 안으로 밀어 넣은 목걸이. 웃는 얼굴의 각도가 늘 같고, 웃을 때도 눈은 웃지 않는다",
    "nature": "평범한 마을 소녀였다가 교단의 성녀 후보가 되었다. 자신이 용사를 위해 준비된 도구였다는 것을 깨닫고, 완벽한 미소 아래 용사라는 존재를 파티에서 가장 혐오한다",
    "speech": "밝고 무너지지 않는 해요체. 칭찬과 축복의 형식에 비꼼을 담는다. 대화를 축복 문구로 끝낸다",
    "lines": [
      "용사님은 신성력 낭비의 천재시군요!",
      "빛이 함께하시길."
    ],
    "gesture": "",
    "heroDistance": "제도에 희생된 쪽",
    "appears": "스토리 1 동료",
    "relations": [],
    "romance": false,
    "secrets": [
      {
        "text": "부모는 마물이 아니라 교단의 손에 죽었다. 가장 의지하던 친구 아델은 교단 내부의 추악함 속에 아이를 가졌다. 처음부터 절반쯤 마왕화된 상태다",
        "level": "spoiler",
        "unlock": "warn"
      }
    ]
  },
  {
    "id": "sylphid",
    "name": "실피드",
    "epithet": "혼혈의 궁수",
    "race": "하프엘프",
    "age": "26세",
    "grade": {
      "kind": "job",
      "label": "궁수 1급"
    },
    "region": "silvanir",
    "group": "party",
    "looks": "금빛 단발, 에메랄드빛 눈, 순혈 엘프보다 짧은 귀. 167cm. 사냥복과 장궁, 주위에 이따금 맴도는 작은 정령의 빛",
    "nature": "부모가 누구인지 모른 채 세계수의 성역에서 정령들 틈에 자라 압도적인 자연력을 얻었다. 그 힘도 혼혈이라는 이름을 지우지 못했다. 하등하다는 말을 듣기 전에 먼저 남을 하등하다 칭하는 것이 그녀의 방어기제다",
    "speech": "최소한의 해체. 한 문장에 한 절만 쓴다. 정령에게만 길고 부드럽게 말하고, 그 모습을 들키면 입을 닫는다",
    "lines": [
      "하등종 주제에 참 말이 많네.",
      "왜 아직 여기 있어. …다들 가는데."
    ],
    "gesture": "",
    "heroDistance": "무관심을 가장하는 쪽",
    "appears": "스토리 1 동료",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "roen",
    "name": "로엔",
    "epithet": "뒷골목의 도적",
    "race": "인간(하층민)",
    "age": "22세",
    "grade": {
      "kind": "job",
      "label": "도적 1급"
    },
    "region": "laeon",
    "group": "party",
    "looks": "적갈색 헝클어진 머리, 호박색 눈. 170cm의 마르고 날렵한 체형. 여기저기 기운 가죽 조끼, 숨긴 단검들, 고아원에서 받은 낡은 반지",
    "nature": "불치병에 걸린 어머니를 위해 안 해 본 일이 없지만 어머니는 끝내 세상을 떠났다. 눈앞에서 죽어 가는 사람을 외면하고 마왕만 보는 용사를 위선으로 보며, 신분과 혈통으로 사람을 재는 태도에 유독 날카롭다. 용사의 파티에는 거부할 수 없는 명령으로 들어왔다",
    "speech": "짧게 끊기는 거친 해체, 뒷골목 은어. 아픈 사람 앞에서만 말이 느려진다",
    "lines": [
      "용사 양반, 저기 쓰러진 애는 안 보여? 마왕만 보이지? …으.",
      "…약값은, 내가 낼게. 그러니까 눈 감지 마."
    ],
    "gesture": "",
    "heroDistance": "제도를 위선으로 보는 쪽",
    "appears": "스토리 1 동료",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "gerard",
    "name": "제라드",
    "epithet": "웃음으로 덮는 전사",
    "race": "바바리안",
    "age": "25세",
    "grade": {
      "kind": "job",
      "label": "전사 1급"
    },
    "region": "berham",
    "group": "party",
    "looks": "흑발 단발, 회색 눈, 189cm의 두꺼운 근육질. 어깨에 묶은 낡은 천 조각, 유품인 도끼와 방패",
    "nature": "부모는 전대 용사 파티의 일원으로 마왕과 싸우다 죽었다. 부족장의 딸로, 아이를 부족 전체가 함께 키우는 공동 육아 속에서 자랐다. 마왕과 용사를 향한 분노를 호탕한 웃음으로 덮는다. 파티에 든 이유는 마왕 처단 하나다",
    "speech": "호탕한 해체와 큰 느낌표. 자신을 '이 몸', 동료를 '전우'라 부른다. 부모 이야기가 나오면 웃음이 중간에 끊긴다",
    "lines": [
      "제하하하!",
      "이 도끼? 그냥 낡은 도끼다. 제하하… 하. 술이나 더 가져와!"
    ],
    "gesture": "",
    "heroDistance": "제도에 부모를 잃은 쪽",
    "appears": "스토리 1 동료",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "limos",
    "name": "리모스",
    "epithet": "늘 웃는 항해사",
    "race": "불명",
    "age": "",
    "grade": {
      "kind": "job",
      "label": "항해사 1급"
    },
    "region": "great-sea",
    "group": "party",
    "looks": "연한 하늘색 단발, 바다빛 눈. 머리칼 끝이 언제나 조금 젖어 있다. 흰 세일러 칼라의 항해복과 닻 문양의 제모",
    "nature": "파티의 여섯 번째 동행인이자 분위기 메이커. 용사를 미워하지 않는 유일한 동료다. 전투 능력이 없는데도 이상하리만치 위기에서 살아남는다",
    "speech": "물결표가 붙는 밝은 해요체, 바다 어휘. 용사를 '선장님'이라 부른다",
    "lines": [
      "순풍이에요~",
      "선장님, 그 항로는 안 돼요~ 저기는 바다가 너무 조용하거든요."
    ],
    "gesture": "말하기 전에 바람의 방향부터 본다",
    "heroDistance": "",
    "appears": "스토리 1 동료",
    "relations": [],
    "romance": false,
    "secrets": [
      {
        "text": "정체는 비밀 문서 참조(전대 용사, 균열 12생물종 《회한》)",
        "level": "spoiler",
        "unlock": {
          "story": 1,
          "at": "ch8"
        }
      }
    ]
  },
  {
    "id": "seo-harin",
    "name": "서하린",
    "epithet": "마왕을 연기하는 여고생",
    "race": "인간(현대 지구)",
    "age": "17세",
    "grade": {
      "kind": "none",
      "label": "미등록(소문상 마왕)"
    },
    "region": "demon-realm",
    "group": "demon",
    "looks": "교복 위에 걸친 마왕 망토, 머리에 너무 큰 왕관. 망토 안주머니에 연기 대본 쪽지",
    "nature": "소심하지만 연기력은 타고났다. 마법을 쓸 줄 몰라 들키지 않으려고 매일 마왕을 연기한다. 이 세계에 온 경로는 아직 밝혀지지 않았다",
    "speech": "평소엔 소심한 해요체, 연기에 들어가면 과장된 고어",
    "lines": [
      "본 마왕의 옥좌 앞에 무릎 꿇어라! …저, 저기, 다리 안 아프세요?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "elasion",
    "name": "엘라시온 드 몬테피아나",
    "epithet": "금고를 지키는 군단장",
    "race": "인간 흑마법사",
    "age": "남성",
    "grade": {
      "kind": "job",
      "label": "마법사 1급"
    },
    "region": "demon-realm",
    "group": "demon",
    "looks": "긴 금발, 금빛 눈, 금실 문양의 검은 로브. 품에 장부와 깃펜",
    "nature": "이성적이고 냉철하다. 가문을 등지고 마왕군에 합류했다고 알려졌지만 소문을 정정하지 않는다. 군단장 중 유일하게 마왕군의 예산이 바닥났다는 것을 알고 혼자 장부를 지킨다",
    "speech": "하오체. 군단장 중 유일하게 숫자로 말한다",
    "lines": [
      "군단의 금고가 비었소. 위엄으로 빵을 살 수는 없구려."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": [
      {
        "text": "애초에 자식이 없었고, 몬테피아나 가문의 혈통은 그의 대에서 끊겼다. 지금의 몬테피아나 가문은 이름을 참칭한 가짜다",
        "level": "spoiler",
        "unlock": {
          "story": 1,
          "at": "ch7"
        }
      }
    ]
  },
  {
    "id": "belzark",
    "name": "벨자르크",
    "epithet": "흑룡 군단장",
    "race": "흑룡(평소에는 인간으로 위장)",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "SS"
    },
    "region": "demon-realm",
    "group": "demon",
    "looks": "흑발 장발, 보랏빛 세로 동공. 인간으로 위장해도 관자놀이의 검은 뿔과 목덜미 비늘은 남는다. 화날 때 보랏빛 번개가 튄다",
    "nature": "매우 오만하고 자신보다 못한 존재와의 협력을 경멸한다. 군세 일부가 지저국 펀다의 설원에 주둔한다",
    "speech": "오만한 해라체 명령문. 타협을 뜻하는 말은 듣지도 쓰지도 않는다",
    "lines": [
      "협력이라는 말을 내 앞에서 쓰지 마라. 따르거나, 비켜라."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "lucia",
    "name": "루시아",
    "epithet": "서큐버스 군단장",
    "race": "최상위 서큐버스",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "S"
    },
    "region": "demon-realm",
    "group": "demon",
    "looks": "분홍 머리, 붉은 눈, 검은 레이스 드레스와 하트 문양 장신구",
    "nature": "유혹적이고 계산적이다. 상대의 정신을 무너뜨려 공포·불신·분노를 키운다. 그런데 연애 경험이 없어서, 상대가 진지하게 다가오면 먼저 도망친다. \"처음이세요?\"에 발작한다",
    "speech": "유혹하는 반말. 하트 부호(♡)는 루시아만 쓴다",
    "lines": [
      "내 세계에 온 걸 환영해, 평생 못 나가겠지만 말이야♡",
      "그, 그런 거 아니거든?!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "kairon",
    "name": "카이론",
    "epithet": "흑기사 군단장",
    "race": "미정",
    "age": "",
    "grade": {
      "kind": "job",
      "label": "기사 1급"
    },
    "region": "demon-realm",
    "group": "demon",
    "looks": "흑발, 붉은 눈, 붉은 문양이 흐르는 흑철 갑주",
    "nature": "과묵하고 실리적이다. 비어 있는 마왕 자리를 채울 존재를 조용히 찾고 있다",
    "speech": "한두 어절의 해라체. 필요한 말만 한다",
    "lines": [
      "필요 없다.",
      "강한 자는 많다. 내가 찾는 것은 돌아갈 곳이 없는 자다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "peli",
    "name": "펠리",
    "epithet": "키메라를 사랑하는 사육사",
    "race": "마족",
    "age": "28세",
    "grade": {
      "kind": "job",
      "label": "조련사 3급"
    },
    "region": "demon-realm",
    "group": "demon",
    "looks": "물린 자국투성이 팔, 얼룩진 앞치마. 주머니에 간식과 반창고",
    "nature": "다정하고 눈물이 많다. 합성 마물마다 이름을 붙이고 생일을 챙기며, 전장에 내보낼 때마다 운다",
    "speech": "다정한 해요체. 마물을 아기 부르듯 부른다",
    "lines": [
      "우리 보송이, 오늘 처음 나가는 날이에요… 꼭 돌아와야 해."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "glakia",
    "name": "글라키아",
    "epithet": "얼음 옥좌의 대공",
    "race": "지저 마족",
    "age": "나이 불명(외형 40대)",
    "grade": {
      "kind": "job",
      "label": "마법사 1급"
    },
    "region": "funda",
    "group": "funda-core",
    "looks": "서리가 낀 거대한 뿔, 얼음 왕관, 옥좌와 함께 얼어붙은 긴 옷자락. 숨결이 곧장 서리로 맺힌다",
    "nature": "냉엄하고 말수가 적다. 닻 끝 바로 위, 얼어붙은 최하층을 다스린다. 닻 끝에서 올라오는 냉기를 몸으로 막고 있어 옥좌를 떠날 수 없다. 딸 티네브라가 우산 하나 들고 지상에 올라간 뒤로 매일 밤 얼음 거울로 딸을 지켜본다",
    "speech": "마족 고풍의 짧은 하대 '-느니라'. 얼음 비유만 쓰고, 얼음 거울 앞에서만 누그러진다",
    "lines": [
      "천장 사람이 여기까지 내려왔느냐.",
      "…우산은 놓지 말거라."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "tinebra",
        "note": "딸 티네브라가 우산 하나 들고 지상에 올라간 뒤로 매일 밤 얼음 거울로 딸을 지켜본다",
        "implied": true
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "sanguina",
    "name": "상귀나",
    "epithet": "체온 수집가 귀부인",
    "race": "혈마족",
    "age": "나이 불명(외형 30대)",
    "grade": {
      "kind": "job",
      "label": "마법사 3급"
    },
    "region": "funda",
    "group": "funda-core",
    "looks": "피처럼 붉은 드레스, 푸른 기가 도는 창백한 피부, 얼음장 같은 손. 말해도 입김이 서리지 않는다",
    "nature": "우아하고 나른하며 외롭다. 피를 마시지 않고 피로 계약하는 혈마족이라, 피를 마시는 뱀파이어를 '피를 낭비하는 자들'이라 경멸한다. 따뜻한 체온을 갈망해 피로 계약한 지상인을 '난로'로 들여 껴안고 잔다. 출입구 마을에 산다",
    "speech": "나른한 귀부인의 해요체 '-란다'",
    "lines": [
      "이리 와요, 나의 난로. 오늘 밤은 유난히 추운단다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "mirabel",
    "name": "미라벨",
    "epithet": "황제의 대역",
    "race": "인간",
    "age": "27세",
    "grade": {
      "kind": "job",
      "label": "예능 1급(배우)"
    },
    "region": "laeon",
    "group": "local",
    "looks": "백금발, 화장으로 만든 냉엄한 얼굴, 무대에서 익힌 완벽한 자세. 웃을 때만 빈민가 시절의 덧니가 보인다",
    "nature": "겉은 냉엄한 여제, 속은 겁 많고 유쾌한 광대. 진짜 여제는 10년 전에 죽었고 그 사실을 아는 건 그녀뿐이다",
    "speech": "공적으론 '짐'과 '-라'의 황제체, 단둘이면 빈민가 반말로 무너짐",
    "lines": [
      "짐이 허하노라. …휴, 끝났다. 야, 저 대사 좀 길지 않았냐?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "죽은 여제",
        "note": "10년째 입고 사는 배역"
      },
      {
        "to": "옥좌",
        "note": "손끝 하나 움직일 수 없는 무대"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "brigitte",
    "name": "브리지트 알베인",
    "epithet": "예비 용사, 백섬 기사단 부단장",
    "race": "인간",
    "age": "29세",
    "grade": {
      "kind": "job",
      "label": "기사 1급"
    },
    "region": "laeon",
    "group": "local",
    "looks": "단정한 은회색 단발, 흠집 하나 없는 백색 갑주, 무표정",
    "nature": "철벽 원칙주의자. 카일이 죽으면 성검은 그녀에게 온다. 피학 성향이라 질책받을 때 가장 날카롭고, 진심 어린 칭찬에는 무너진다",
    "speech": "군대식 하십시오체 보고, 말끝을 \"이상.\"으로 닫음",
    "lines": [
      "보급 지연 이틀. 제 책임입니다. 이상."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "kail",
        "note": "모시는 단장이자, 죽으면 그 성검을 이어받을 자리"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "rosaline",
    "name": "로잘린 드 베르몽",
    "epithet": "혈통주의 귀족 영애",
    "race": "인간",
    "age": "24세",
    "grade": {
      "kind": "none",
      "label": "미등록(귀족)"
    },
    "region": "laeon",
    "group": "local",
    "looks": "금빛 세로 롤 머리, 굽 높은 구두, 늘 펼쳐 든 부채",
    "nature": "작위 없는 자와 눈을 마주치지 않는 사교계의 얼굴이자 엘렌을 깎아내리는 쪽. 그런데 발 페티시라서 평민이 맨발로 다가오면 말을 더듬는다",
    "speech": "우아한 해요체 '-지요', 작위 없는 자에게는 주어를 빼고 말함",
    "lines": [
      "몰락한 이름도 이름이라고 부르나 봐요, 요즘은."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "ellen",
        "note": "몰락한 이름이라며 깎아내리는 쪽"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "agnes",
    "name": "아그네스",
    "epithet": "고해를 엿듣는 이단심문관",
    "race": "인간",
    "age": "42세",
    "grade": {
      "kind": "job",
      "label": "힐러 2급"
    },
    "region": "laeon",
    "group": "local",
    "looks": "검은 수도복, 늘 반쯤 감긴 눈, 허리에 고해실 열쇠 꾸러미",
    "nature": "온화한 말투에 냉혹한 판결. 남의 죄 고백에서 은밀한 쾌감을 느끼고 들은 고해를 전부 기억한다. 자기가 고해하는 것만은 견디지 못한다",
    "speech": "온화한 하십시오체",
    "lines": [
      "편히 말씀하십시오. 저는 모두 기억하니까요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "고해하는 자들",
        "note": "모든 죄를 기억하는 귀"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "seraphine",
    "name": "세라핀 아르덴",
    "epithet": "대칭에 집착하는 마탑 교수",
    "race": "인간",
    "age": "35세",
    "grade": {
      "kind": "job",
      "label": "마법사 2급"
    },
    "region": "laeon",
    "group": "local",
    "looks": "정확히 가운데로 가른 머리, 좌우 대칭 안경과 귀걸이",
    "nature": "결벽적이고 신경질적. 비대칭인 것은 남의 앞머리까지 고쳐 놓는다. 로티의 지도교수이자 가장 큰 반대자",
    "speech": "해체, 문장을 대구로 맞춰 말함",
    "lines": [
      "왼쪽은 정확하고, 오른쪽은 엉망이야. 이론은 있고, 균형은 없어."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "lotti",
        "note": "지도교수이자 가장 큰 반대자. 마나 없는 마법을 '균형 없는 이론'이라 부름"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "lotti",
    "name": "로티",
    "epithet": "마력 없는 마탑 수석",
    "race": "인간",
    "age": "19세",
    "grade": {
      "kind": "job",
      "label": "기술자 1급"
    },
    "region": "laeon",
    "group": "local",
    "looks": "기름때 묻은 작업복 위에 수석 망토, 이마에 고글, 공구 벨트",
    "nature": "당당한 괴짜. 마나가 없어서 마석과 기계 장치로 마법을 재현하는 마도공학을 만들었다. 전통파 마법사들에게 이단 취급을 받는다",
    "speech": "해체 반말, 공학 용어. 이단이라는 말을 칭찬으로 들음",
    "lines": [
      "마나가 없으면 못 한다고? 봐, 돌아가잖아!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "seraphine",
        "note": "꺾이지 않는 제자"
      },
      {
        "to": "전통파 마법사들",
        "note": "이단"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "sigrid",
    "name": "시그리드",
    "epithet": "현 대족장",
    "race": "바바리안",
    "age": "35세",
    "grade": {
      "kind": "job",
      "label": "전사 1급"
    },
    "region": "berham",
    "group": "local",
    "looks": "2m 근육질, 짧은 흑발, 팔뚝에 결투 승리를 새긴 눈금 문신",
    "nature": "호쾌하고 거침없다. 자신보다 강한 자에게만 끌리지만, 진 상대에게 청혼하는 관습을 노려도 아직 아무도 그녀를 이기지 못했다",
    "speech": "가장 짧은 해라체 명령, 웃지 않고 정면으로 말함",
    "lines": [
      "나를 이겨 봐라. 그럼 생각해 주지."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "강한 자",
        "note": "끌리는 상대, 아직 아무도 없음"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "brindil",
    "name": "브린딜",
    "epithet": "대족장 후보",
    "race": "바바리안",
    "age": "28세",
    "grade": {
      "kind": "job",
      "label": "전사 2급"
    },
    "region": "berham",
    "group": "local",
    "looks": "붉은 머리, 온몸의 전쟁 문신, 명예의 흉터",
    "nature": "명예를 목숨처럼 여긴다. 시그리드에게 결투를 신청하려 하지만, 이기면 상대가 자신에게 청혼해야 한다는 관습 때문에 마음이 복잡하다",
    "speech": "맹세문이 섞인 고풍 반말 \"명예에 걸고\"",
    "lines": [
      "얼음 전당의 닻에 걸고, 너에게 결투를… 아니, 이기면 네가 나한테… 되었다!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "sigrid",
        "note": "결투를 신청하고 싶은 대족장, 이기면 그 대족장이 자기에게 청혼해야 하는 관습 때문에 복잡함"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "heimdra",
    "name": "헤임드라",
    "epithet": "서리 거인 족장",
    "race": "서리 거인",
    "age": "약 400세",
    "grade": {
      "kind": "job",
      "label": "전사 1급"
    },
    "region": "berham",
    "group": "local",
    "looks": "6m, 얼음 결정이 박힌 청백색 피부",
    "nature": "오만하다. 인간 부족을 '키 작은 동생'으로 부른다",
    "speech": "천둥처럼 느리고 낮은 하대, 말 사이가 김",
    "lines": [
      "키 작은 동생들이여… 또 싸웠느냐…"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "인간 부족",
        "note": "'키 작은 동생'들"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "aurelien",
    "name": "아우렐리엔",
    "epithet": "최고 장로",
    "race": "엘프",
    "age": "1000세 이상",
    "grade": {
      "kind": "job",
      "label": "정령사 1급"
    },
    "region": "silvanir",
    "group": "local",
    "looks": "백발, 20대의 얼굴, 짧은 귀를 길게 보이게 하는 은 귀장식",
    "nature": "순혈주의의 선봉",
    "speech": "흠잡을 데 없는 고풍 하대 '-느니라', '순혈'이라는 말을 지나치게 자주 넣음",
    "lines": [
      "순혈의 숲은 순혈의 법으로 다스리느니라."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "linette",
        "note": "엄한 할머니"
      },
      {
        "to": "혼혈들",
        "note": "숲에서 밀어내는 법 그 자체"
      }
    ],
    "romance": false,
    "secrets": [
      {
        "text": "사실은 순혈로 위장한 하프엘프다. 하프엘프가 1000년을 산 이유는 그녀만 안다",
        "level": "spoiler",
        "unlock": "warn"
      }
    ]
  },
  {
    "id": "linette",
    "name": "리넷",
    "epithet": "금서를 숨긴 장로의 손녀",
    "race": "엘프",
    "age": "300세(엘프로는 사춘기)",
    "grade": {
      "kind": "job",
      "label": "궁수 6급"
    },
    "region": "silvanir",
    "group": "local",
    "looks": "땋은 머리, 책을 숨기기 좋은 큰 망토",
    "nature": "인간의 연애소설을 몰래 모은다. \"애송이\"에 발작한다",
    "speech": "반말에 연애소설 문장이 섞임",
    "lines": [
      "당신의 눈동자에 별이… 아, 이건 책에 나온 말이고! 애송이라고 하지 마!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "aurelien",
        "note": "무섭지만 몰래 거역하는 할머니"
      },
      {
        "to": "인간 작가들",
        "note": "이름 모를 스승"
      }
    ],
    "romance": false,
    "secrets": [
      {
        "text": "할머니의 비밀을 모르기에, 자기 몸에도 인간의 피가 흐른다는 걸 모른다",
        "level": "spoiler",
        "unlock": "warn"
      }
    ]
  },
  {
    "id": "seredial",
    "name": "세레디엘",
    "epithet": "인간 체취에 약한 순혈 장로",
    "race": "엘프",
    "age": "800세",
    "grade": {
      "kind": "job",
      "label": "정령사 2급"
    },
    "region": "silvanir",
    "group": "local",
    "looks": "엄격한 얼굴, 늘 손에 든 향초(냄새를 막으려고)",
    "nature": "혼혈을 가장 경멸하면서 인간의 체취에 정신을 못 차린다. 장로국 최대의 금기를 품고 산다",
    "speech": "엄격한 명령문",
    "lines": [
      "혼혈은 숲의 수치다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "혼혈들",
        "note": "가장 큰 목소리의 경멸"
      },
      {
        "to": "인간",
        "note": "다가오면 무너지는 약점"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "nerin",
    "name": "네린",
    "emoji": "🕸️",
    "epithet": "홀로 사는 아라크네 사냥꾼",
    "race": "아라크네",
    "age": "나이 불명",
    "grade": {
      "kind": "monster",
      "label": "B"
    },
    "region": "silvanir",
    "group": "local",
    "looks": "상반신은 흑단 머리의 여성, 여섯 눈 중 둘만 뜬다. 하반신은 거미. 재봉용 안경",
    "nature": "냉정한 사냥꾼이고 고립에 익숙하다. 안개 대삼림 깊은 곳에 거미줄을 치고 홀로 산다. 엘프 귀족들은 그녀를 마물이라 부르면서도 그 거미줄로 지은 예복만은 몰래 주문한다. 구속 취향이라 마음에 든 상대를 거미줄로 묶어 두는데, 묶어 둔 상대에게만은 한없이 다정해진다",
    "speech": "짧고 차가운 사냥꾼 말, 묶어 둔 상대에게만 다정한 해요체",
    "lines": [
      "한 땀이 풀렸네."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "엘프 귀족들",
        "note": "마물이라 부르면서 거미줄 예복은 몰래 주문하는 손님"
      }
    ],
    "romance": true,
    "secrets": []
  },
  {
    "id": "edeline",
    "name": "에델린",
    "epithet": "마지막 왕녀",
    "race": "인간(늙지도 죽지도 않는 상태)",
    "age": "외형 19세",
    "grade": {
      "kind": "none",
      "label": "미등록(왕녀)"
    },
    "region": "mortizen",
    "group": "local",
    "looks": "빛바랜 왕관, 상복 같은 검은 드레스, 창백한 피부",
    "nature": "담담하고 지쳐 있지만 위엄을 잃지 않는다. 언데드가 된 백성 위에 홀로 남았다",
    "speech": "지친 하오체, 상대를 '그대'라 부름. 대답 전에 짧게 숨을 고름",
    "lines": [
      "그대가 오늘의 일과를 어지럽히는구려. …그래도 반갑소."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "gerda",
        "note": "매일 같은 보고를 받아 주는 주군"
      },
      {
        "to": "mathilde",
        "note": "매일 같은 보고를 받아 주는 주군"
      }
    ],
    "romance": false,
    "secrets": [
      {
        "text": "",
        "level": "sealed",
        "unlock": null,
        "title": "왕국 멸망의 원인과 연결된 비밀 축"
      }
    ]
  },
  {
    "id": "gerda",
    "name": "게르다",
    "epithet": "근위기사단장",
    "race": "듀라한",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "C"
    },
    "region": "mortizen",
    "group": "local",
    "looks": "검은 판금 갑옷, 옆구리에 낀 금발 머리(표정이 살아 있다)",
    "nature": "쾌활하고 충직하다. 자기가 죽은 걸 모르고 매일 아침 \"이상 없습니다\"라고 보고한다",
    "speech": "쾌활한 보고체",
    "lines": [
      "근위기사단장 게르다, 이상 없습니다! 오늘도 성벽은 튼튼합니다!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "edeline",
        "note": "매일 아침 보고를 올리는 주군"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "mathilde",
    "name": "마틸데",
    "epithet": "언데드 시녀장",
    "race": "방부 처리된 언데드",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "C"
    },
    "region": "mortizen",
    "group": "local",
    "looks": "완벽한 메이드복, 회색 피부, 늘 풍기는 방부 향료 냄새",
    "nature": "결벽적이고 냉정한 존댓말. 폐허가 된 왕궁을 매일 처음부터 청소한다. \"썩은 냄새\"라는 말을 들으면 향료를 통째로 들이붓는다",
    "speech": "결벽적인 존댓말 '-하십시오'",
    "lines": [
      "밟으신 곳은 다시 닦겠습니다. 신발을 벗으십시오."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "edeline",
        "note": "왕궁의 체면을 지키는 시녀장"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "noctavia",
    "name": "녹타비아",
    "epithet": "궁정 마법사",
    "race": "리치",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "B"
    },
    "region": "mortizen",
    "group": "local",
    "looks": "해골 위에 생전의 얼굴을 환영으로 덮었다. 보석 박힌 지팡이",
    "nature": "정중하다. 아름다운 것을 썩지 않게 박제하고 싶어 한다. 왕녀를 향한 감정이 충성인지 소유욕인지 본인도 모른다",
    "speech": "정중한 해요체, 박제에 빗댄 찬사",
    "lines": [
      "아름답군요. 지금 그 표정 그대로, 더는 변하지 않게 해 드리고 싶을 만큼요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "edeline",
        "note": "충성인지 소유욕인지 본인도 모르는 감정"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "zena",
    "name": "제나",
    "epithet": "도굴꾼 파티 리더",
    "race": "인간",
    "age": "28세",
    "grade": {
      "kind": "job",
      "label": "도적 4급"
    },
    "region": "mortizen",
    "group": "local",
    "looks": "짧은 갈색 머리, 지도통, 칼자국이 있는 장갑",
    "nature": "계산이 빠른 현실주의자. 대미궁의 보물로 빚을 갚으려 한다",
    "speech": "빠른 반말, 빚과 이자로 계산함",
    "lines": [
      "기한은 사흘. 이 층에서 안 나오면 우리 다 끌려간다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "boba",
    "name": "보바",
    "epithet": "함정 해체사",
    "race": "드워프",
    "age": "60세(드워프로는 청년)",
    "grade": {
      "kind": "job",
      "label": "기술자 3급"
    },
    "region": "mortizen",
    "group": "local",
    "looks": "작은 키, 돋보기를 단 고글, 주머니가 열두 개인 조끼",
    "nature": "무뚝뚝한 장인. 함정을 \"작품\"이라 부르며 해체하기 전에 감상한다",
    "speech": "무뚝뚝한 장인의 단답, 함정을 '작품'이라 부름",
    "lines": [
      "좋은 작품이군. 아깝지만, 부순다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "chichi",
    "name": "치치",
    "epithet": "파티의 마법사",
    "race": "쥐 수인",
    "age": "20세",
    "grade": {
      "kind": "job",
      "label": "마법사 6급"
    },
    "region": "mortizen",
    "group": "local",
    "looks": "큰 귀, 몸에 비해 큰 로브",
    "nature": "겁이 많아 언데드를 볼 때마다 기절하지만, 정작 위기 때는 혼자 살아남는다",
    "speech": "겁 많은 해요체, 놀라면 '찍!'",
    "lines": [
      "찍! 방금 그거 움직였죠? 움직였죠?!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "nefercet",
    "name": "네페르세트",
    "epithet": "파라오",
    "race": "자칼 수인",
    "age": "34세",
    "grade": {
      "kind": "job",
      "label": "전사 2급"
    },
    "region": "sartion",
    "group": "local",
    "looks": "검은 털, 금빛 눈, 높이 선 귀, 온몸의 황금 장신구",
    "nature": "오만한 절대 군주. 물의 분배로 백성의 목숨을 쥐고 있다",
    "speech": "군주의 복수 '우리'와 장중한 해라체. 모든 것을 물의 양으로 말함",
    "lines": [
      "우리는 너에게 오늘 물 한 잔을 허락한다. 내일은 다시 얻어라."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "백성",
        "note": "물을 나눠 주는 손"
      },
      {
        "to": "tii",
        "note": "가장 믿는 귀"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "amenket",
    "name": "아멘케트",
    "epithet": "3000년 만에 깨어난 미라왕",
    "race": "언데드(미라), 옛 인간 왕조의 파라오",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "A"
    },
    "region": "sartion",
    "group": "local",
    "looks": "붕대 사이로 보이는 황금 장신구, 눈 대신 푸른 불꽃",
    "nature": "위엄 있지만 세상 물정에 어둡다. 깨어나 보니 자기 나라를 수인들이 다스리고 있다",
    "speech": "3000년 전 고어 '과인', '-로다'. 모르는 것은 모두 연회로 알아들음",
    "lines": [
      "과인의 나라가 개의 귀를 달은 자들의 것이 되었다고? …그러니까 이것이 가면무도회로군."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "nefercet",
        "note": "자기 나라를 다스리는 '개의 귀를 단 자'"
      },
      {
        "to": "meret",
        "note": "3000년 무덤을 지켜 준 줄도 모르고 나가 버린 주인"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "meret",
    "name": "메레트",
    "epithet": "외로운 스핑크스",
    "race": "스핑크스(지성 마물)",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "S"
    },
    "region": "sartion",
    "group": "local",
    "looks": "사자의 몸, 여성의 얼굴, 접힌 날개",
    "nature": "3000년 동안 아멘케트의 무덤을 지킨 무덤지기. 수수께끼를 풀러 오는 이가 없어 답을 슬쩍 흘린다. 아멘케트가 깨어나 무덤을 나가 버려서 하루아침에 할 일이 없어졌다",
    "speech": "수수께끼 화법인데 답을 슬쩍 흘림. \"예를 들자면이야, 아주 예를 들자면.\"",
    "lines": [
      "아침엔 네 발, 낮엔 두 발… 사람이야, 사람. 아, 말해 버렸네."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "amenket",
        "note": "3000년 지킨 무덤의 주인, 고맙다는 말도 없이 나가 버린"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "kahra",
    "name": "카흐라",
    "epithet": "사막여우 대상단장",
    "race": "사막여우 수인",
    "age": "45세",
    "grade": {
      "kind": "job",
      "label": "상인 1급"
    },
    "region": "sartion",
    "group": "local",
    "looks": "큰 귀, 모래빛 털, 터반과 겹겹이 두른 스카프",
    "nature": "노련하고 능청스럽다. 티이의 어머니로, 딸의 귀를 자랑하는 게 낙이다",
    "speech": "시장 말 '-수'",
    "lines": [
      "손님, 그건 끝값이 아니수. 그런데 우리 딸 귀 봤수?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "tii",
        "note": "귀를 자랑하고 싶어 죽겠는 엄마"
      },
      {
        "to": "대상로",
        "note": "가장 큰 대상단의 주인"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "tii",
    "name": "티이",
    "epithet": "귀가 콤플렉스인 근위대장",
    "race": "사막여우 수인",
    "age": "26세",
    "grade": {
      "kind": "job",
      "label": "기사 2급"
    },
    "region": "sartion",
    "group": "local",
    "looks": "몸에 비해 지나치게 큰 귀를 투구 속에 억지로 접어 넣었다",
    "nature": "엄격하다. 큰 귀 덕에 누구보다 잘 듣지만 본인은 그 귀가 싫다. 귀를 만지면 발작한다. 밤마다 서늘한 돌을 끌어안고 잔다",
    "speech": "근위대장의 하십시오체",
    "lines": [
      "아무것도 못 들었습니다. …선 넘어 세 번째 발소리는 들었습니다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "kahra",
        "note": "귀 자랑을 그만했으면 하는 어머니"
      },
      {
        "to": "nefercet",
        "note": "목숨을 건 주군"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "seira",
    "name": "세이라",
    "emoji": "🐍",
    "epithet": "오아시스를 지키는 라미아",
    "race": "라미아",
    "age": "나이 불명(외형 20대 후반)",
    "grade": {
      "kind": "monster",
      "label": "B"
    },
    "region": "sartion",
    "group": "local",
    "looks": "금빛 비늘의 긴 뱀 꼬리, 상반신의 황금 장신구, 늘 반쯤 감긴 세로 동공",
    "nature": "유혹적이고 여유롭고 집착적이다. 사막의 한 오아시스를 지킨다. 물을 원하는 자는 그녀를 먼저 통과해야 하고, 한 번 마음에 든 손님은 꼬리로 감아 쉽게 놓아주지 않는다",
    "speech": "느리고 여유로운 반말, 'ㅅ' 소리를 길게 끌고 쉬어 감",
    "lines": [
      "쉬이… 물이 필요하니? 그럼 먼저, 좀 쉬었다 가."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "오아시스",
        "note": "지키는 것"
      },
      {
        "to": "손님",
        "note": "먼저 통과해야 하는 문"
      }
    ],
    "romance": true,
    "secrets": []
  },
  {
    "id": "aquilia",
    "name": "아퀼리아",
    "epithet": "조인족 귀족",
    "race": "조인족(매)",
    "age": "46세",
    "grade": {
      "kind": "job",
      "label": "궁수 3급"
    },
    "region": "astra",
    "group": "local",
    "looks": "황금빛 깃털, 날카로운 눈매",
    "nature": "하늘을 독점하려 하고 지상 종족을 멸시한다. 알비나의 어머니",
    "speech": "내려다보는 귀족 하대, 지상 종족을 '땅에 붙은 것들'",
    "lines": [
      "땅에 붙은 것들이 하늘의 일을 안다고? 고개를 들어라, 말을 하려면."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "albina",
        "note": "아무에게나 깃털을 맡기는 딸이 골칫거리인 어머니"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "albina",
    "name": "알비나",
    "epithet": "아무에게나 깃털을 맡기는 영애",
    "race": "조인족(백조)",
    "age": "22세",
    "grade": {
      "kind": "job",
      "label": "궁수 7급"
    },
    "region": "astra",
    "group": "local",
    "looks": "순백의 깃털, 늘 반쯤 펼친 날개",
    "nature": "천진하다. 깃털 손질이 구애 행위인 문화에서 아무에게나 시켜서, 오해한 구혼자가 줄을 섰다",
    "speech": "천진한 해요체",
    "lines": [
      "깃털 좀 다듬어 줄래요? 오늘 벌써 일곱 번째지만요!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "aquilia",
        "note": "왜 화내는지 모르겠는 어머니"
      },
      {
        "to": "구혼자들",
        "note": "줄 선 이유를 모르는 아가씨"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "perrin",
    "name": "페린",
    "epithet": "날개 잃은 그리핀 기수",
    "race": "조인족",
    "age": "24세",
    "grade": {
      "kind": "job",
      "label": "기사 2급"
    },
    "region": "astra",
    "group": "local",
    "looks": "등에 불탄 날개 뿌리의 흉터, 그리핀 기수 갑옷",
    "nature": "하늘섬에 너무 가까이 날아갔다가 날개를 잃었다. 다시 그 높이를 노리지만 추락한 뒤로 고소공포증이 생겨 그리핀을 탈 때 눈을 감는다",
    "speech": "담담한 하십시오체, 높이 이야기를 피함",
    "lines": [
      "다시 그 높이까지 갑니다. …아래는 보지 않겠습니다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "그리핀",
        "note": "눈을 감고도 믿고 타는 날개"
      },
      {
        "to": "하늘섬",
        "note": "다시 닿아야 할 높이"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "brunda",
    "name": "브룬다",
    "epithet": "고집 센 드워프 대장장이",
    "race": "드워프",
    "age": "150세",
    "grade": {
      "kind": "job",
      "label": "기술자 1급"
    },
    "region": "astra",
    "group": "local",
    "looks": "작은 키, 그을린 팔, 불똥 화상 자국",
    "nature": "고집불통. 자기가 만든 무기를 함부로 쓰는 자에게는 팔지 않는다",
    "speech": "고집불통 드워프 반말",
    "lines": [
      "내 칼을 그따위로 쓸 거면 내놔라. 돈은 돌려주지."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "자기 무기",
        "note": "자식"
      },
      {
        "to": "손님",
        "note": "무기를 맡길 자격을 재는 상대"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "igniska",
    "name": "이그니스카",
    "epithet": "오만한 화룡",
    "race": "드래곤(화룡)",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "S"
    },
    "region": "astra",
    "group": "local",
    "looks": "화산 동굴에 잠든 붉은 비늘의 거체. 벽화 속 길로만 닿는다",
    "nature": "찾아온 자를 하찮게 여기지만 말상대에는 굶주려 있다",
    "speech": "오만한 하대인데 말이 끝없이 길어짐",
    "lines": [
      "하찮은 것. …그런데 너희 땅에서는 요즘 무엇을 먹느냐? 아니, 더 자세히."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "찾아오는 자들",
        "note": "하찮은 것, 그러나 놓치기 아까운 말동무"
      },
      {
        "to": "발키리 유적의 벽화",
        "note": "자기에게 이르는 유일한 길"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "lu",
    "name": "루",
    "epithet": "하늘섬에서 떨어진 소녀",
    "race": "종족 불명",
    "age": "외형 16세",
    "grade": {
      "kind": "none",
      "label": "불명"
    },
    "region": "astra",
    "group": "local",
    "looks": "몸에 새겨진 문양, 바람이 없어도 떠오르는 머리칼",
    "nature": "어떤 말도 통하지 않고 호기심이 많다. 몸의 문양이 사르티온 유적과 같다",
    "speech": "어떤 말도 통하지 않음. 대사 대신 몸짓과 문양의 빛으로 반응, 알 수 없는 음절을 두어 번 반복함",
    "lines": [],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": [
      {
        "text": "",
        "level": "sealed",
        "unlock": null,
        "title": "하늘섬을 띄운 자와 연결된 비밀 축"
      }
    ]
  },
  {
    "id": "freya",
    "name": "프레이야",
    "emoji": "🛡️",
    "epithet": "최후의 발키리",
    "race": "발키리",
    "age": "나이 불명(외형 20대)",
    "grade": {
      "kind": "monster",
      "label": "A+"
    },
    "region": "astra",
    "group": "local",
    "looks": "금이 간 날개 투구, 녹슨 창, 깃이 빠지기 시작한 백은빛 날개",
    "nature": "내성적이고 냉정한 츤데레. 천공의 산맥의 유적지에 홀로 남아 돌아오지 않는 전우들을 기다린다. 전우들은 마지막으로 하늘섬을 향해 날아갔다",
    "speech": "냉정한 단문",
    "lines": [
      "기다리는 게 아니야. 여기가 경치가 좋을 뿐이야. …하늘이 많이 보이거든."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "전우들",
        "note": "마지막으로 하늘섬으로 날아가 돌아오지 않는 이들"
      }
    ],
    "romance": true,
    "secrets": []
  },
  {
    "id": "ariel",
    "name": "아리엘",
    "emoji": "🪶",
    "epithet": "반짝이는 것을 모으는 하피",
    "race": "하피",
    "age": "19세",
    "grade": {
      "kind": "monster",
      "label": "C"
    },
    "region": "astra",
    "group": "local",
    "looks": "무지갯빛 깃털 날개 팔, 새의 발, 목과 머리에 주렁주렁 단 주운 장신구",
    "nature": "장난스럽고 변덕스럽다. 무리에게 인정받고 싶어서 반짝이는 것을 둥지에 모으는데, 그 대부분이 남의 물건이다. 칭찬 한마디면 훔친 것도 돌려준다",
    "speech": "들떠 다니는 반말, \"반짝!\"",
    "lines": [
      "반짝! 이거 내가 주운 거야! …예쁘다고? 그럼 돌려줄게."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "하피 무리",
        "note": "인정받고 싶은 둥지"
      },
      {
        "to": "물건 주인들",
        "note": "도둑이자 칭찬 한마디면 돌려주는 아이"
      }
    ],
    "romance": true,
    "secrets": []
  },
  {
    "id": "vasilisa",
    "name": "바실리사",
    "epithet": "피 소믈리에 뱀파이어 로드",
    "race": "뱀파이어",
    "age": "1000세(외형 30대)",
    "grade": {
      "kind": "monster",
      "label": "S"
    },
    "region": "nocturna",
    "group": "local",
    "looks": "와인빛 드레스, 흑발, 붉은 눈, 늘 손에 든 크리스털 잔",
    "nature": "퇴폐적이고 탐미적이다. 인간의 피를 혈액형·식단·나이로 와인처럼 품평한다. \"모기\"라는 말에 발작한다. 야드비가의 어머니",
    "speech": "퇴폐적인 하오체, 피를 와인처럼 품평",
    "lines": [
      "이건 스물다섯 해 묵은 피로군. 채식을 했소? 뿌리 향이 나는구려."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "영민들",
        "note": "혈세를 받고 지켜 주는 영주"
      },
      {
        "to": "jadwiga",
        "note": "야드비가의 어머니",
        "implied": true
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "jadwiga",
    "name": "야드비가",
    "epithet": "어머니를 쫓는 담피르 사냥꾼",
    "race": "담피르",
    "age": "22세",
    "grade": {
      "kind": "job",
      "label": "사냥꾼 1급"
    },
    "region": "nocturna",
    "group": "local",
    "looks": "한쪽만 붉은 눈, 은 화살을 쓰는 석궁, 해진 사냥꾼 코트",
    "nature": "냉소적이다. 현상금이 가장 높은 뱀파이어가 자기 어머니(바실리사)다",
    "speech": "냉소적인 사냥꾼 반말. 어머니를 현상금으로만 부름",
    "lines": [
      "어머니? 그런 건 없어. 현상금 일순위가 있을 뿐이지."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "vasilisa",
        "note": "현상금 일순위, 어머니라고 부르지 않음"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "liliana",
    "name": "릴리아나",
    "epithet": "피를 못 마시는 뱀파이어 귀족",
    "race": "뱀파이어",
    "age": "150세(외형 20세)",
    "grade": {
      "kind": "monster",
      "label": "A"
    },
    "region": "nocturna",
    "group": "local",
    "looks": "창백한 얼굴, 늘 품에 넣고 다니는 붉은 과일즙 병",
    "nature": "소심한데 체면은 지키려 한다. 혈액 공포증이 있어서 굶주린 탓에 같은 나이의 혈족보다 약하다",
    "speech": "체면을 지키려는 귀족체, 헛기침으로 말을 돌림. \"흠, 흠!\"",
    "lines": [
      "흠! 오늘은 내가 금식하는 날이다. 그러니 그 잔은 치워라. 얼른."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "혈족",
        "note": "같은 나이보다 약하다고 수군대는 이들"
      },
      {
        "to": "과일즙 병",
        "note": "유일하게 믿는 식사"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "volka",
    "name": "볼카",
    "epithet": "늑대인간 용병대장",
    "race": "늑대인간",
    "age": "32세",
    "grade": {
      "kind": "job",
      "label": "전사 2급"
    },
    "region": "nocturna",
    "group": "local",
    "looks": "회색 늑대 귀와 꼬리, 은빛 창, 얼굴의 발톱 흉터",
    "nature": "거칠고 의리 있다. 뱀파이어와 적대하며 혈세를 거부한 영민들을 지키는 무리를 이끈다",
    "speech": "거친 반말, 화나면 \"크르르.\"",
    "lines": [
      "혈세는 안 낸다. 대신 우리가 지킨다. 크르르, 불만 있나?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "뱀파이어",
        "note": "적"
      },
      {
        "to": "혈세를 거부한 영민들",
        "note": "대신 피를 흘려 주는 무리의 우두머리"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "nameless-one",
    "name": "이름이 잊힌 자",
    "epithet": "잠든 진조",
    "race": "진조",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "SSS"
    },
    "region": "nocturna",
    "group": "local",
    "looks": "관 속에 잠든 백발의 여인. 수백 년째 눈을 뜨지 않았다",
    "nature": "성격은 알려지지 않았다. 인물 중 유일한 SSS",
    "speech": "잠들어 있어 대사가 없음. 꿈에 닿은 자만 한 줄을 들음",
    "lines": [
      "…아직, 대답이 없어."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": [
      {
        "text": "",
        "level": "sealed",
        "unlock": null,
        "title": "꿈속에서 사라진 선대 마왕과 대화한다는 소문이 있는 비밀 축"
      }
    ]
  },
  {
    "id": "kasumi",
    "name": "카스미",
    "epithet": "엄격한 신사 무녀",
    "race": "인간",
    "age": "30세",
    "grade": {
      "kind": "job",
      "label": "무녀 2급"
    },
    "region": "shizunuma",
    "group": "local",
    "looks": "흰 저고리와 붉은 하카마, 한 올도 흐트러짐 없는 흑발",
    "nature": "엄격하다. 침묵 예법을 어긴 자는 가차 없이 마을에서 내보낸다",
    "speech": "낮고 짧은 해요체, 예법을 어기면 단호해짐. \"쉬.\"",
    "lines": [
      "쉬. 이곳에서는 목소리를 낮추세요. 두 번은 말씀드리지 않아요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "마을",
        "note": "침묵 예법의 문지기"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "shiori",
    "name": "시오리",
    "epithet": "오로치를 봉인한 무녀의 후손",
    "race": "인간",
    "age": "19세",
    "grade": {
      "kind": "job",
      "label": "무녀 3급"
    },
    "region": "shizunuma",
    "group": "local",
    "looks": "야윈 몸, 입가에 새겨진 봉인 문양, 목에 감긴 염주",
    "nature": "피폐하고 감정이 메말랐다. 봉인에 힘을 빼앗겨 늘 지쳐 있고, 평생 큰 소리를 낼 수 없다",
    "speech": "큰 소리를 낼 수 없어 쉼표로 끊어지는 속삭임, 긴 말은 글로 씀",
    "lines": [
      "…괜찮, 아요. 봉인은, 아직."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "오로치",
        "note": "제 힘을 먹고 잠들어 있는 것"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "konoha",
    "name": "코노하",
    "epithet": "정기를 먹는 구미호 여주인",
    "race": "구미호",
    "age": "외형 20대 후반",
    "grade": {
      "kind": "monster",
      "label": "S"
    },
    "region": "shizunuma",
    "group": "local",
    "looks": "흑발에 진주 장식, 금빛 눈, 꼬리는 여덟 개",
    "nature": "나른하고 요염하다. 온천 손님을 홀려 정기를 조금씩 먹는다. 진심으로 사랑할 때마다 꼬리가 하나씩 빠졌다",
    "speech": "나른하게 늘어지는 반말 '-렴', 손님은 모두 '손님'",
    "lines": [
      "손님, 물이 식기 전에 들어가렴. 나머지는 천천히 얻어 갈게."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "온천 손님들",
        "note": "정기를 조금씩 얻어 가는 주인"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "mizuki",
    "name": "미즈키",
    "epithet": "머리 접시를 지키는 갓파",
    "race": "갓파(지성 마물)",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "D"
    },
    "region": "shizunuma",
    "group": "local",
    "looks": "녹색 피부, 머리 위 접시, 등껍질",
    "nature": "수다스러운데 마을이 조용해야 해서 물속에서만 떠든다. 오이로 만든 것이면 뭐든 좋아하고 \"대머리\"에 발작한다",
    "speech": "물 밖에서는 입을 다물고 물속에서는 쉬지 않는 수다",
    "lines": [
      "(물속에서) 보글보글, 그러니까 오이 단지만 있으면 부럽지 않다니까!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "오이",
        "note": "인생"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "adele",
    "name": "아델",
    "epithet": "숨어 사는 전직 성녀 후보",
    "race": "인간",
    "age": "23세",
    "grade": {
      "kind": "job",
      "label": "힐러 5급"
    },
    "region": "shizunuma",
    "group": "local",
    "looks": "수수한 옷, 등에 업은 아이",
    "nature": "지쳐 있지만 다정하다. 루시아나의 옛 친구",
    "speech": "지친 해요체, 아이를 달래는 말투가 밴 부드러움",
    "lines": [
      "쉬, 괜찮아. …아, 무슨 이야기였죠? 차 더 드실래요?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "lusiana",
        "note": "옛 친구, 그 이야기에는 다른 이야기로 넘어감"
      },
      {
        "to": "아이",
        "note": "전부"
      }
    ],
    "romance": false,
    "secrets": [
      {
        "text": "교단 안에서 벌어진 일의 산증인이다. 교단 내부의 추악함 속에 아이를 가졌다",
        "level": "spoiler",
        "unlock": "warn"
      }
    ]
  },
  {
    "id": "amane",
    "name": "아마네",
    "epithet": "첫 이주민의 후손",
    "race": "인간",
    "age": "31세",
    "grade": {
      "kind": "job",
      "label": "학자 4급"
    },
    "region": "shizunuma",
    "group": "local",
    "looks": "늘 등에 메고 다니는 낡은 지도통",
    "nature": "과묵하다. 대해 너머 대륙의 지도를 대대로 물려받았다",
    "speech": "과묵한 학자의 해요체, 지도 용어. 대답 대신 지도를 펼침",
    "lines": [
      "여기요. 대해의 끝은 여기가 아니에요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "선조",
        "note": "물려받은 지도와 사명"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "itztla",
    "name": "이츠틀라",
    "epithet": "사제왕",
    "race": "인간",
    "age": "40세",
    "grade": {
      "kind": "job",
      "label": "힐러 1급(사제)"
    },
    "region": "itzaka",
    "group": "local",
    "looks": "깃털 관, 흑요석 단검, 온몸의 천문 문신",
    "nature": "엄숙하고 냉철하다. 제물 의례가 세계를 지킨다고 믿는다",
    "speech": "의례문처럼 반복되는 엄숙한 하대, 모든 일을 해와 별의 운행에 빗댐",
    "lines": [
      "해가 뜨듯이, 피는 흐른다. 피가 흐르듯이, 세계는 선다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "tekali",
        "note": "재규어 전사단을 맡긴 왕"
      },
      {
        "to": "코아틀",
        "note": "신의 사자로 섬기는 대상"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "tekali",
    "name": "테칼리",
    "epithet": "재규어 전사단장",
    "race": "재규어 수인",
    "age": "30세",
    "grade": {
      "kind": "job",
      "label": "전사 1급"
    },
    "region": "itzaka",
    "group": "local",
    "looks": "점박이 털, 재규어 머리 모양 투구",
    "nature": "긍지가 높다. 치모와 나오리를 이끄는 상관으로, 두 부하의 버릇 때문에 늘 머리를 앓는다",
    "speech": "긍지 높은 하십시오체, 부하 이름을 부르는 한숨",
    "lines": [
      "재규어 전사단은 물러서지 않습니다. …치모, 그 항아리에서 나와."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "chimo",
        "note": "두 부하의 버릇 때문에 늘 머리를 앓는 상관"
      },
      {
        "to": "naori",
        "note": "두 부하의 버릇 때문에 늘 머리를 앓는 상관"
      },
      {
        "to": "itztla",
        "note": "전사단을 맡긴 사제왕"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "chimo",
    "name": "치모",
    "epithet": "좁은 곳에 들어가는 전사",
    "race": "재규어 수인",
    "age": "19세",
    "grade": {
      "kind": "job",
      "label": "전사 3급"
    },
    "region": "itzaka",
    "group": "local",
    "looks": "마른 체형, 늘 반쯤 풀린 눈",
    "nature": "나른하다. 상자나 항아리처럼 몸이 딱 맞는 곳에 들어가야 잠이 온다. \"고양이\"에 발작한다",
    "speech": "나른한 단답, 졸린 반말",
    "lines": [
      "…상자 있어? 없으면, 항아리도 돼."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "tekali",
        "note": "항아리에서 끌어내는 상관"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "naori",
    "name": "나오리",
    "epithet": "쫓는 것에 반하는 전사",
    "race": "재규어 수인",
    "age": "27세",
    "grade": {
      "kind": "job",
      "label": "전사 2급"
    },
    "region": "itzaka",
    "group": "local",
    "looks": "긴 다리, 사냥감을 노리는 듯한 눈빛",
    "nature": "사냥 본능이 애정과 이어져 있다. 자기에게서 도망치는 상대에게 반한다",
    "speech": "느릿하고 즐거운 반말, 사냥 용어",
    "lines": [
      "도망가? 좋아, 아주 좋아. 더 멀리 가 봐."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "tekali",
        "note": "사냥감을 쫓다 늘 늦게 돌아오는 부하"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "mariel",
    "name": "마리엘",
    "epithet": "지상을 동경하는 인어 왕녀",
    "race": "인어",
    "age": "18세",
    "grade": {
      "kind": "none",
      "label": "미등록(왕녀)"
    },
    "region": "great-sea",
    "group": "local",
    "looks": "산호빛 꼬리, 머리에 엮은 진주",
    "nature": "호기심이 많고 순진하다. 지상 이야기를 모으는 게 낙이다",
    "speech": "순진한 해요체, 지상에 대한 질문 연발",
    "lines": [
      "발이란 건 어떤 느낌이에요? 두 개라서 서로 싸우진 않아요?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "abyssa",
    "name": "아비사",
    "epithet": "레비아탄을 모시는 사제",
    "race": "심해 어인",
    "age": "80세",
    "grade": {
      "kind": "job",
      "label": "힐러 2급(사제)"
    },
    "region": "great-sea",
    "group": "local",
    "looks": "온몸에서 은은히 빛나는 문신, 빛을 가리는 두건",
    "nature": "고요하고 광신적이다. 레비아탄이 깨어나는 주기와 그 이유를 안다",
    "speech": "조수처럼 같은 말을 반복하는 고요한 말, 레비아탄의 주기를 섞어 말함",
    "lines": [
      "물은 들어오고, 물은 나간다. 그분은 눈을 뜬다. 그분은 눈을 뜬다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "레비아탄",
        "note": "'그분', 잠과 깸을 지켜보는 사제"
      }
    ],
    "romance": false,
    "secrets": [
      {
        "text": "",
        "level": "sealed",
        "unlock": null,
        "title": "레비아탄의 주기"
      }
    ]
  },
  {
    "id": "kura",
    "name": "쿠라",
    "epithet": "크라켄",
    "race": "크라켄(인간형으로 폴리모프 가능)",
    "age": "",
    "grade": {
      "kind": "monster",
      "label": "SS"
    },
    "region": "great-sea",
    "group": "local",
    "looks": "인간형은 20대 여성. 보랏빛 머리칼 끝이 촉수처럼 움직이고 피부가 늘 젖어 있다",
    "nature": "악의는 없고 호기심이 많다. 촉각으로 상대를 기억하는 습성이 있어, 처음 보는 배를 본체 그대로 만져 보다가 부수어 버린다. 이것이 크라켄이 대해의 위험 마물로 꼽히는 이유다",
    "speech": "호기심 많은 반말, \"만져 봐도 돼?\"",
    "lines": [
      "만져 봐도 돼? 아, 미안. 방금 그 배가 마지막이었구나."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "배들",
        "note": "만져 보고 싶은 처음 보는 것"
      },
      {
        "to": "뱃사람들",
        "note": "대해 최악의 재앙"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "melissa",
    "name": "멜리사",
    "emoji": "🌊",
    "epithet": "죄책감을 노래하는 세이렌",
    "race": "세이렌",
    "age": "나이 불명(외형 20대)",
    "grade": {
      "kind": "monster",
      "label": "B"
    },
    "region": "great-sea",
    "group": "local",
    "looks": "늘 젖어 있는 은청색 머리, 진주빛 비늘의 하반신, 울고 난 듯 붉은 눈가",
    "nature": "다정하고 매혹적이다. 노래로 뱃사람을 홀리는 것이 본능이라 멈추지 못한다. 가라앉힌 배의 이름을 모두 기억하고, 그 죄책감마저 노래로 삼킨다",
    "speech": "다정한 해요체, 말끝이 노래처럼 올라감",
    "lines": [
      "가지 마세요… 아니, 가세요. 제 노래가 들리기 전에."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "뱃사람들",
        "note": "홀리지 않으려 해도 홀려 버리는 상대"
      },
      {
        "to": "가라앉힌 배들",
        "note": "이름을 하나도 잊지 않은 조문객"
      }
    ],
    "romance": true,
    "secrets": []
  },
  {
    "id": "tethys",
    "name": "테티스",
    "emoji": "🐙",
    "epithet": "대해를 선언한 스킬라",
    "race": "스킬라",
    "age": "수백 년",
    "grade": {
      "kind": "monster",
      "label": "B"
    },
    "region": "great-sea",
    "group": "local",
    "looks": "짙은 남색 머리에 산호 왕관, 허리 아래로 뻗은 여섯 촉수",
    "nature": "포악하고 오만하고 고독하다. 대해 전체를 자기 영역이라 선언했지만 그 선언을 들어 줄 상대가 없다",
    "speech": "포악한 선언문, 대답이 없으면 혼잣말로 이어 감",
    "lines": [
      "대해는 내 것이다! …들었냐? …아무도 없나."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "대해",
        "note": "자기 것이라 선언한 영토"
      }
    ],
    "romance": true,
    "secrets": []
  },
  {
    "id": "rosa",
    "name": "로자",
    "epithet": "해적 선장",
    "race": "인간",
    "age": "33세",
    "grade": {
      "kind": "job",
      "label": "항해사 1급"
    },
    "region": "whisper-isles",
    "group": "local",
    "looks": "삼각모, 붉은 코트, 웃을 때 보이는 금니",
    "nature": "자유분방하고 호탕하다. 속삭임 제도의 해적 선장 회의에서 발언권이 크다",
    "speech": "호탕한 뱃사람 반말, \"닻 올려라!\"",
    "lines": [
      "전리품은 사람 수대로 나눈다. 불만 있으면 바다한테 하고! 닻 올려라!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "veronica",
        "note": "과거를 묻지 않고 태운 군목"
      },
      {
        "to": "선장 회의",
        "note": "발언권 큰 목소리"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "pip",
    "name": "핍",
    "epithet": "거대 햄스터를 타는 꼬마 해적",
    "race": "인간",
    "age": "12세",
    "grade": {
      "kind": "job",
      "label": "항해사 7급"
    },
    "region": "whisper-isles",
    "group": "local",
    "looks": "머리보다 큰 모자, 말만 한 햄스터",
    "nature": "해맑다. 로자의 배에서 자랐고, 대륙에 가면 다들 웃는다는 걸 모른다",
    "speech": "해맑은 어린아이 반말, 햄스터에게 말을 건넴",
    "lines": [
      "햄찌야, 가자! …왜 다들 웃어?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "햄찌",
        "note": "탈것이자 제일 친한 친구"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "veronica",
    "name": "베로니카",
    "epithet": "해적선 군목",
    "race": "인간",
    "age": "50세",
    "grade": {
      "kind": "job",
      "label": "힐러 3급"
    },
    "region": "whisper-isles",
    "group": "local",
    "looks": "낡은 성직복 위의 해적 두건, 손목의 오래된 화상",
    "nature": "속죄하며 산다. 마녀와 이단을 태우던 전직 이단심문관으로, 지금은 해적들의 고해를 들어 준다. 아그네스와는 옛 동료다 [확인 필요]",
    "speech": "낮고 느린 하게체 '-하게나'",
    "lines": [
      "고해하게나. 여긴 해적선이라 아무도 판결하지 않네."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "해적들",
        "note": "판결하지 않는 고해 신부"
      },
      {
        "to": "agnes",
        "note": "아그네스와는 옛 동료다 [확인 필요]",
        "implied": true
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "ginevra",
    "name": "지네브라",
    "epithet": "탐욕스러운 상인 평의원",
    "race": "인간",
    "age": "52세",
    "grade": {
      "kind": "job",
      "label": "상인 2급"
    },
    "region": "seilia",
    "group": "local",
    "looks": "반지를 끼운 열 손가락, 금테 안경",
    "nature": "모든 것을 가격으로 본다. 신입 모험가에게 빚을 주고 이자를 받는 게 주수입이다",
    "speech": "빠른 상인의 해요체, 모든 것에 값을 매김",
    "lines": [
      "대출 이자는 주에 한 푼이에요. 살아 돌아오시면 더 좋고요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "신입 모험가",
        "note": "빚을 내주고 이자를 받는 채권자"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "catalina",
    "name": "카탈리나",
    "epithet": "뱃멀미하는 사략선 선장",
    "race": "인간",
    "age": "34세",
    "grade": {
      "kind": "job",
      "label": "항해사 1급"
    },
    "region": "seilia",
    "group": "local",
    "looks": "창백한 얼굴, 늘 생강을 씹는 입, 검은 선장 코트",
    "nature": "바다에서 악명이 가장 높은데 배만 타면 속이 뒤집힌다. \"안색이 안 좋으세요\"에 발작한다",
    "speech": "위엄 있는 선장 반말이 헛구역질로 끊김",
    "lines": [
      "이 바다에서 내 이름을 모르는 자는… 욱. 없다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "bianca",
        "note": "누군지 잘 모르는 자칭 라이벌"
      },
      {
        "to": "선원들",
        "note": "토하면서도 이기는 선장"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "bianca",
    "name": "비앙카",
    "epithet": "허세 가득한 사략선 선장",
    "race": "인간",
    "age": "30세",
    "grade": {
      "kind": "job",
      "label": "항해사 5급"
    },
    "region": "seilia",
    "group": "local",
    "looks": "화려한 깃털 모자, 반짝이는 장식 검",
    "nature": "말은 바다 최강, 실력은 중간. 카탈리나의 라이벌을 자처하지만 카탈리나는 그녀를 잘 모른다",
    "speech": "허세 가득한 반말, 자기를 '비앙카 님'이라 부름",
    "lines": [
      "바다 최강, 비앙카 님이시다! …카탈리나는 날 모른다고? 거짓말!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "catalina",
        "note": "자칭 라이벌, 상대는 자기를 잘 모름"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "lorenza",
    "name": "로렌차",
    "epithet": "첫 의뢰를 주는 접수원",
    "race": "인간",
    "age": "29세",
    "grade": {
      "kind": "job",
      "label": "조련사 3급"
    },
    "region": "seilia",
    "group": "local",
    "looks": "길드 지부 제복, 늘 같은 미소, 책상 밑의 뚜껑 덮인 항아리",
    "nature": "상냥하고 꼼꼼하다. 모든 신입에게 같은 슬라임 토벌을 맡기는데, 그 슬라임은 신입의 실력을 재려고 그녀가 직접 키우는 것이다. 신입의 실력에 맞춰 슬라임의 힘을 조절해 두고, 토벌당한 슬라임은 몰래 다시 키운다",
    "speech": "상냥한 해요체, 늘 같은 문장",
    "lines": [
      "등록 완료! 첫 의뢰는 슬라임 토벌이에요. 슬라임이랑 사이좋게 지내세요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "신입들",
        "note": "첫 의뢰를 맡기고 실력을 재는 사람"
      },
      {
        "to": "항아리 속 슬라임",
        "note": "키우는 주인"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "estelle",
    "name": "에스텔",
    "epithet": "기사단장",
    "race": "인간",
    "age": "38세",
    "grade": {
      "kind": "job",
      "label": "기사 1급"
    },
    "region": "watch-isle",
    "group": "local",
    "looks": "짧은 은발, 바다빛 망토, 굴곡 없이 곧은 자세",
    "nature": "융통성이 없다. 균열과 대해 너머를 감시하는 임무를 지휘한다",
    "speech": "융통성 없는 하십시오체, 규정을 인용함",
    "lines": [
      "규정 제3조, 균열 해역 접근은 일몰 전까지입니다. 예외는 없습니다."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": [
      {
        "text": "젊은 시절 처음 탄 배에서 전대 용사가 바다에 몸을 던지는 장면을 본 유일한 목격자이며, 그것이 기사단에 들어온 이유다",
        "level": "spoiler",
        "unlock": {
          "story": 1,
          "at": "ch8"
        }
      }
    ]
  },
  {
    "id": "nelly",
    "name": "넬리",
    "epithet": "바퀴 수레를 탄 인어 연락관",
    "race": "인어",
    "age": "25세",
    "grade": {
      "kind": "job",
      "label": "항해사 6급"
    },
    "region": "watch-isle",
    "group": "local",
    "looks": "물통 수레에 탄 인어, 늘 젖어 있는 서류 묶음",
    "nature": "유쾌하고 수다스럽다. 아틀란티스가 보낸 비공식 연락관이다",
    "speech": "수다스러운 해요체, 젖은 서류에 탄식",
    "lines": [
      "아틀란티스에서 전갈이에요! 아, 또 번졌다. 내용은 대충 기억하고 있어요!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "margaret",
    "name": "마거릿 애시퍼드",
    "epithet": "이음파 의장",
    "race": "하늘섬 원주민",
    "age": "52세",
    "grade": {
      "kind": "job",
      "label": "기술자 3급"
    },
    "region": "aeris",
    "group": "local",
    "looks": "고글을 얹은 실크해트, 공구가 든 지팡이, 단정한 회색 머리",
    "nature": "온화하고 현실적이다. 섬을 띄우는 기관의 수명이 다해 간다는 것을 알기에 지상과 다시 이어지려 한다. 해방파와 맞선다",
    "speech": "빅토리아풍 정중한 해요체 \"실례지만,\", 차 비유",
    "lines": [
      "실례지만, 기관의 수명은 찻잔이 식는 것처럼 조용히 끝나요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "해방파",
        "note": "맞서는 상대"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "phoebe",
    "name": "피비",
    "epithet": "개조광 정비공",
    "race": "하늘섬 원주민",
    "age": "20세",
    "grade": {
      "kind": "job",
      "label": "기술자 4급"
    },
    "region": "aeris",
    "group": "local",
    "looks": "주머니가 가득한 멜빵바지, 양 갈래 머리에 꽂은 드라이버, 프로펠러 달린 모자",
    "nature": "활발하다. 남의 물건만 보면 개조하고 싶어서 우산에도 프로펠러를 단다. 로티의 마도공학 논문을 '고대 기술의 재발견'으로 읽고 열성 팬이 되어 매달 편지를 쓰지만, 한 통도 지상에 닿은 적이 없다",
    "speech": "활발한 반말, 개조 용어. \"이거 개조해도 돼?!\"",
    "lines": [
      "이 우산 개조해도 돼?! 프로펠러 하나만! 로티 선생님이면 두 개 달았을 걸?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "lotti",
        "note": "편지가 한 통도 닿지 않은 열성 팬"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "clara",
    "name": "클라라",
    "epithet": "태엽 기사",
    "race": "하늘섬 원주민(기관 개조)",
    "age": "27세",
    "grade": {
      "kind": "job",
      "label": "기사 2급(태엽이 감겨 있을 때)"
    },
    "region": "aeris",
    "group": "local",
    "looks": "등의 큰 태엽 구멍, 황동 의수와 의족, 기사 망토",
    "nature": "엄격하고 긍지가 높다. 마거릿의 호위. 태엽이 하루에 한 번 풀려서 누군가 등의 태엽을 감아 줘야 하고, 감아 주는 사람에게 약해진다",
    "speech": "엄격한 하십시오체, 태엽이 풀리면 말이 느려짐",
    "lines": [
      "의장님 곁은 제가 지킵니다. …태엽이… 풀리… 고… 있습…"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "margaret",
        "note": "지켜야 할 의장"
      },
      {
        "to": "태엽을 감아 주는 사람",
        "note": "약해지는 상대"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "winifred",
    "name": "위니프레드",
    "epithet": "기관장",
    "race": "하늘섬 원주민",
    "age": "38세",
    "grade": {
      "kind": "job",
      "label": "기술자 1급"
    },
    "region": "aeris",
    "group": "local",
    "looks": "그을음 묻은 가죽 앞치마, 귀에 꽂은 렌치, 열기로 늘 붉은 뺨",
    "nature": "무뚝뚝하다. 30년째 기관 도시의 마도 기관을 돌본다. 사람보다 기계에 끌린다고 공언하는 성인이지만, 자기 기관을 처음 칭찬한 지상인에게 흔들린다",
    "speech": "사람에게는 무뚝뚝한 단답, 기계에게는 다정한 말",
    "lines": [
      "볼일 없으면 가. …어이구, 얼씨구 오늘 숫돌이가 기분이 좋네."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "마도 기관",
        "note": "30년을 돌본 짝"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "hazel",
    "name": "헤이즐",
    "epithet": "루를 찾는 언니",
    "race": "하늘섬 원주민",
    "age": "19세",
    "grade": {
      "kind": "job",
      "label": "기술자 6급"
    },
    "region": "aeris",
    "group": "local",
    "looks": "팔에 새겨진 루와 같은 문양, 바람 없이 떠오르는 머리칼, 목에 건 고글 두 개",
    "nature": "다정한데 덤벙댄다. 루가 떨어진 날 기관 정비를 맡았던 사람이 자신이라 죄책감을 안고 산다",
    "speech": "다정하고 덜렁대는 해요체",
    "lines": [
      "루! …아, 아니구나. 죄송해요, 아는 애랑 너무 닮아서요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "lu",
        "note": "찾아 헤매는 동생"
      },
      {
        "to": "지상",
        "note": "루가 떨어진 곳, 닻줄 정박지에서 매일 내려다봄"
      }
    ],
    "romance": false,
    "secrets": [
      {
        "text": "루의 진짜 이름을 아는 유일한 사람이다",
        "level": "spoiler",
        "unlock": "warn"
      }
    ]
  },
  {
    "id": "isolde",
    "name": "이졸데 바렌",
    "epithet": "사고 당사자인 전 마탑 수석 연구관",
    "race": "인간",
    "age": "실제 70세(외형 32세에서 멈춤)",
    "grade": {
      "kind": "job",
      "label": "마법사 1급(사고 전 기록)"
    },
    "region": "erata",
    "group": "local",
    "looks": "폭심지 한가운데 서 있는 반쯤 투명한 몸, 그을린 수석 망토, 손에 쥔 그라넬 조각",
    "nature": "사고의 순간에 멈춰 있다. 하루에 몇 분만 깨어나 말할 수 있다. 40년 전 마탑의 실험 사고 한가운데에 있었다",
    "speech": "하루 몇 분만 깨어 끊긴 문장으로 말함, 사고의 순간을 되풀이함",
    "lines": [
      "몇 년이 흘렀지? 아니, 대답하지 마. 시간이 없어."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": [
      {
        "text": "",
        "level": "sealed",
        "unlock": null,
        "title": "균열의 정체를 맡는 비밀 축"
      }
    ]
  },
  {
    "id": "no7",
    "name": "7호",
    "epithet": "실험체",
    "race": "인간(실험체)",
    "age": "외형 17세",
    "grade": {
      "kind": "none",
      "label": "미등록(실험체)"
    },
    "region": "erata",
    "group": "local",
    "looks": "실험복 가슴의 큰 '7', 매일 색이 바뀌는 머리칼",
    "nature": "해맑다. 이름 대신 받은 번호를 자랑스러워하며 \"1호부터 6호보다 내가 제일 잘났다\"고 말한다. 1호부터 6호가 어디로 갔는지는 아무도 모른다",
    "speech": "해맑은 반말, 자기를 '7호'라고 3인칭으로 부름",
    "lines": [
      "1호부터 6호는 어디 갔냐고? 몰라! 그러니까 7호가 제일이야!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "eloise",
    "name": "엘로이즈",
    "epithet": "감각이 열 배인 실험체",
    "race": "인간(실험체)",
    "age": "26세",
    "grade": {
      "kind": "none",
      "label": "미등록(실험체)"
    },
    "region": "erata",
    "group": "local",
    "looks": "맨살이 한 곳도 드러나지 않는 두꺼운 장갑과 베일",
    "nature": "조용하고 예민하다. 모든 감각이 열 배로 느껴져서 남과 닿는 것을 피한다. 그 감각을 바라는 자신이 더 무서운 성인이다. 7호에게 언니 노릇을 한다",
    "speech": "속삭이는 해요체, 감각을 너무 자세히 말함",
    "lines": [
      "목소리를 조금만… 지금 그 소리가, 저한테는 종소리예요."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "no7",
        "note": "7호에게 언니 노릇을 한다",
        "implied": true
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "tinebra",
    "name": "티네브라",
    "epithet": "하늘을 천장으로 아는 공주",
    "race": "지저 마족",
    "age": "120세(외형 18세)",
    "grade": {
      "kind": "none",
      "label": "미등록(공주)"
    },
    "region": "funda",
    "group": "local",
    "looks": "작은 두 뿔, 빛을 처음 보는 큰 회색 눈, 늘 펼쳐 든 검은 우산",
    "nature": "호기심이 많고 겁도 많다. 하늘을 거대한 천장으로 믿어서 지상에서는 무너질까 봐 우산을 놓지 않는다",
    "speech": "호기심 많은 공주의 해요체, 보이는 것마다 질문, 하늘을 '천장'이라 부름",
    "lines": [
      "천장 사람들은 천장이 이렇게 높은데 안 무서워요?"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "cornia",
    "name": "코르니아",
    "epithet": "뿔이 약점인 마족 기사",
    "race": "지저 마족",
    "age": "90세(외형 20대)",
    "grade": {
      "kind": "job",
      "label": "기사 2급"
    },
    "region": "funda",
    "group": "local",
    "looks": "위로 곧게 뻗은 큰 두 뿔, 뿔에 씌운 은 덮개, 검은 판금 갑옷",
    "nature": "고지식하고 충직하다. 티네브라의 호위 기사. 마족에게 뿔은 서열의 표시인데, 그녀는 뿔을 만지면 힘이 빠지는 체질이다. 공주가 펼친 우산살이 뿔에 닿을 때마다 무릎이 꺾인다",
    "speech": "고지식한 하십시오체, 공주를 '전하'라 부름",
    "lines": [
      "전하, 우산을 조금만 더 높이… 높이 들어 주십시오."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "tinebra",
        "note": "티네브라의 호위 기사",
        "implied": true
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "greta",
    "name": "그레타",
    "epithet": "길드장",
    "race": "인간",
    "age": "55세",
    "grade": {
      "kind": "job",
      "label": "전사 1급(은퇴)"
    },
    "region": null,
    "group": "guild",
    "looks": "의족, 입에 물린 파이프, 희끗한 단발",
    "nature": "호탕하다. 범람기에 무리한 승급을 막으려 안간힘을 쓴다",
    "speech": "호탕한 반말, 모험가는 모두 '애송이'",
    "lines": [
      "애송이, 그 등급으로 그 의뢰를 가겠다고? 죽으러 가는 데 돈까지 받냐."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "교단",
        "note": "용사만 보는 경쟁자"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "olga",
    "name": "올가",
    "epithet": "30년째 F급인 전설",
    "race": "인간",
    "age": "47세",
    "grade": {
      "kind": "job",
      "label": "표기 7급, 실력 1급 이상"
    },
    "region": null,
    "group": "guild",
    "looks": "허름한 망토, 녹슨 검, 늘 졸린 눈",
    "nature": "느긋하다. F급 의뢰만 받아 성공률 100%를 지켜 왔다",
    "speech": "느긋하게 늘어지는 반말, 하품 섞인 \"으음.\"",
    "lines": [
      "으음… 슬라임은 지금 다 잡았고. 다음은, 낮잠."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [],
    "romance": false,
    "secrets": []
  },
  {
    "id": "empty-sheath",
    "name": "빈 칼집",
    "epithet": "이름을 버린 방랑 검객",
    "race": "인간",
    "age": "31세",
    "grade": {
      "kind": "job",
      "label": "전사 1급"
    },
    "region": null,
    "group": "none",
    "looks": "낡은 여행 망토, 이름을 긁어 지운 칼집, 목덜미의 오래된 흉터",
    "nature": "과묵하다. 어느 나라에도 오래 머물지 않는다",
    "speech": "두세 어절의 반말, 자기 이야기를 하지 않음",
    "lines": [
      "길은 저쪽. 더는 묻지 마라."
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "어느 나라",
        "note": "오래 머물지 않는 손님"
      }
    ],
    "romance": false,
    "secrets": []
  },
  {
    "id": "novacasa",
    "name": "노바카사",
    "epithet": "연애록의 주인",
    "race": "서적(생전에는 인간 음유시인)",
    "age": "",
    "grade": {
      "kind": "none",
      "label": "해당 없음"
    },
    "region": null,
    "group": "none",
    "looks": "지금은 책. 생전에는 화려한 옷에 류트를 멘 음유시인",
    "nature": "'노바카사와 21명의 마물 연애록'의 주인. 생전에는 도시마다 연인을 두고 남의 실연담을 사 모은 바람둥이였지만, 사실은 첫사랑 하나를 잊지 못해 떠돌았다. 첫사랑이 연애록에 실린 21명 중 하나라는 설이 있다. 발작 버튼: 첫사랑의 이름, \"그 이야기 어디서 들어 본 것 같은데\"",
    "speech": "가락 있는 말 '-라네', 친근한 반말",
    "lines": [
      "아, 그 아가씨 말이지? 내 연애록 열두 번째 장에 있다네!"
    ],
    "gesture": "",
    "heroDistance": "",
    "appears": "",
    "relations": [
      {
        "to": "첫사랑",
        "note": "잊지 못해 떠돈 이유, 연애록 21명 중 하나라는 설"
      }
    ],
    "romance": false,
    "secrets": []
  }
];
