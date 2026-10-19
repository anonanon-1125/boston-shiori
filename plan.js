// =============================================================
//  ボストン栞：予定データ
// -------------------------------------------------------------
//  予定が変わったら、基本はこのファイルだけ書き換えて push すればOK。
//
//  書き方のきまり
//  ・日付は "11-07" のように「月-日」。曜日は自動でつきます。
//  ・2日以上にまたがるときは to: "11-08" を足す。
//  ・日付が決まっていないものは date のかわりに when: "日にち 未定" など。
//    （スペースのところで改行されます）
//  ・cal: "到着" をつけると、カレンダーにその文字で印がつきます。
//    big: true にすると、カレンダーで丸がついて目立ちます。
//  ・tags に使える札: "無料" "要予約" "要確認" "元気なら" "未定" "チーズ"
//    （それ以外の文字も書けます。色はふつうの札になります）
//  ・link: { url: "...", label: "公式" } で「くわしく」リンク。
//  ・goto: "#portsmouth" でページ内の章へのリンク。
//  ・写真は photos.js の名前で指定します。予定ひとつに photo: "名前" を足すと、その予定に写真が付きます。
//  ・文字列の中では <b>太字</b> などのHTMLも使えます。
//  ・書き間違えるとページに赤いお知らせが出ます（カンマの付け忘れに注意）。
// =============================================================

const TRIP = {
  title: "11月のボストン",
  year: 2026,
  start: "11-06",
  end: "11-29",
  cover: "cover-acorn-street", // 表紙の写真（photos.js の名前）
  updated: "2026-10-19", // 書き換えたら日付も更新すると、ページ下に出ます
  // カレンダーで日付を赤くする祝日
  holidays: [
    { date: "11-11", label: "祝日" },
    { date: "11-26", label: "祝日" },
  ],
};

// ---------- 週ごとの予定 ----------
const WEEKS = [
  {
    id: "week1",
    label: "1週目",
    from: "11-06",
    to: "11-12",
    theme: "慣れる週",
    lead: "時差ぼけをなおしながら、近所から少しずつ。",
    photos: ["w1-charles-river", "w1-mit-museum", "w1-gardner"],
    items: [
      {
        date: "11-06",
        title: "到着",
        cal: "到着",
        big: true,
        text: "Logan空港からUberで家へ（20〜30分ほど）。夜は近所でゆっくり。",
        goto: "#life",
      },
      {
        date: "11-08",
        time: "夜",
        title: "Boston Lights",
        cal: "ランタン",
        photo: "w1-boston-lights",
        text: "Franklin Park Zooのランタン展。この日が最終日（$31.95）。行き帰りはUberが楽。",
        link: { url: "https://www.thebostoncalendar.com/events/boston-lights-2026-a-lantern-experience-at-franklin-park-zoo", label: "Boston Lights" },
      },
      {
        date: "11-09",
        title: "MIT案内",
        cal: "MIT案内",
        photo: "w1-mit-dome",
        text: "Great Dome、Killian Court、Stata Center、チャールズ川沿い。しめくくりにMIT Museum（学生証で同伴1人まで無料、10〜17時）。",
        tags: ["無料"],
        link: { url: "https://mitmuseum.mit.edu/visit/hours-admission-directions", label: "MIT Museum" },
      },
      {
        when: "いつでも 18時ごろ",
        title: "Snowport（Seaportの冬マーケット）",
        photo: "w2-snowport",
        text: "気が向いた日の夕方に、ふらっと。平日は15〜20時、入場無料で予約なし。月曜は17時から生演奏も。",
        tags: ["無料"],
        link: { url: "https://www.boston25news.com/news/local/snowport-holiday-market-returning-boston-seaport-2026-holiday-season/VOOAPT3EP5FXRI4SVYFRFDNRO4/", label: "記事" },
      },
      {
        date: "11-12",
        time: "夜",
        title: "ガードナー美術館",
        cal: "美術館",
        text: "毎週木曜17〜21時は無料。チケットは2日前の火曜（11/10）10時に公開。",
        tags: ["無料", "要予約"],
        link: { url: "https://www.gardnermuseum.org/sites/default/files/2026-06/Free-Thursday-Nights-Press-Release-20260623.pdf", label: "お知らせ" },
      },
    ],
  },

  {
    id: "week2",
    label: "2週目",
    from: "11-13",
    to: "11-19",
    theme: "旅行の週",
    lead: "週末はハーバードと市内さんぽ、週のなかばに港町へ1泊。",
    photos: ["w2-public-garden", "w2-harvard-art", "w2-library", "w2-newbury", "w2-mfa"],
    items: [
      {
        date: "11-14",
        to: "11-15",
        title: "Harvard案内（どちらか1日）",
        cal: "Harvard",
        text: "CentralからRed Lineで1駅。Harvard Yardの散歩、Harvard Art Museums（いつでも無料、火〜日）、本屋めぐり。",
        tags: ["無料"],
        link: { url: "https://www.thebostoncalendar.com/events/harvard-art-museums-at-night--85", label: "美術館" },
      },
      {
        date: "11-14",
        to: "11-15",
        title: "市内さんぽ（もう1日）",
        cal: "散歩",
        text: "ビーコンヒル → パブリックガーデン → ボストン公共図書館 → Newbury St。",
      },
      {
        date: "11-18",
        to: "11-19",
        title: "ポーツマスに1泊",
        cal: "旅行",
        big: true,
        text: "ニューハンプシャーの港町。雑貨屋さんとレンガの街並み。",
        goto: "#portsmouth",
      },
      {
        date: "11-19",
        time: "夜",
        title: "元気ならMFA（ボストン美術館）",
        text: "MIT学生証の本人は無料（受付で見せるだけ）。学生証なしは、第3木曜の夜（17–22時）なら$5以上の好きな額、ふだんは$30。火曜休館。",
        tags: ["元気なら", "要確認"],
        link: { url: "https://www.mfa.org/visit", label: "公式" },
      },
    ],
  },

  {
    id: "week3",
    label: "3週目",
    from: "11-20",
    to: "11-24",
    theme: "ホリデー気分の週",
    lead: "街にマーケットとツリーが出はじめるころ。",
    photos: ["w3-sowa", "w3-faneuil-tree", "w3-quincy-market"],
    items: [
      {
        date: "11-20",
        open: true,
        title: "SoWa Winter Market",
        text: "サウスエンドの冬マーケット（〜12/27）。",
      },
      {
        date: "11-21",
        to: "11-22",
        title: "電車で日帰り",
        cal: "日帰り",
        text: "近郊電車が土日$10で乗り放題（mTicketアプリで買う。券売機では買えない）。",
        tags: ["未定"],
        link: { url: "https://www.thebostoncalendar.com/events/10-commuter-rail-weekends-and-holidays--99", label: "$10パス" },
        bubble: "どっちにする？",
        choices: [
          {
            name: "プロビデンス",
            text: "Wickenden Streetの雑貨・古着・陶芸ギャラリー、美大RISDのまわり。",
            photo: "w3-providence",
            link: { url: "https://www.visitrhodeisland.com/things-to-do/trip-ideas-getaways/village-experiences-shops/wickenden-street-providence/", label: "Wickenden St" },
          },
          {
            name: "ニューベリーポート",
            text: "レンガの港町。本屋さんやカフェ。",
            photo: "w3-newburyport",
          },
        ],
      },
      {
        when: "日にち 未定",
        title: "ファニエルホールのツリー点灯",
        text: "2025年は11/22(土)だった。2026年はまだ発表なし。",
        tags: ["要確認"],
      },
      {
        date: "11-24",
        title: "ケーキの買い出し",
        cal: "買い物",
        text: "翌日はThanksgiving前日でスーパーが混むので、前の日に。",
        goto: "#anniversary",
      },
    ],
  },

  {
    id: "week4",
    label: "最後の数日",
    from: "11-25",
    to: "11-29",
    theme: "記念日と、のんびりの週",
    lead: "ケーキを作って、イルミネーションを見て。",
    photos: ["last-seaport"],
    items: [
      {
        date: "11-25",
        title: "記念日",
        cal: "記念日",
        big: true,
        text: "昼からいちごのショートケーキを作る日。",
        goto: "#anniversary",
      },
      {
        date: "11-26",
        title: "家でのんびり",
        text: "Thanksgivingの祝日で、美術館もお店もほとんどお休み。ケーキの残りを食べながらゆっくり。",
      },
      {
        date: "11-28",
        time: "17:00",
        title: "船のイルミネーション点灯",
        cal: "点灯",
        photo: "last-stars",
        text: "SeaportのMartin's Parkで「Lighting of the Ship」→ そのままSnowportで最後の夜。",
        link: { url: "https://www.boston.gov/node/10836", label: "Boston.gov" },
      },
      {
        date: "11-29",
        title: "帰国",
        cal: "帰国",
        big: true,
        text: "空港へはUberで。",
      },
    ],
  },
];

// ---------- ポーツマス1泊 ----------
const PORTSMOUTH = {
  from: "11-18",
  to: "11-19",
  lead: "ニューハンプシャー州の小さな港町。雑貨屋さんめぐりと、橋をわたって州境まで。",
  photos: ["pt-market-square", "pt-north-church", "pt-memorial-bridge", "pt-prescott-park"],

  route: [
    { stop: "Central" },
    { ride: "Red Line", note: "約15分", line: "red" },
    { stop: "South Station" },
    { ride: "C&Jバス", note: "約1時間20分・予約制・片道$21〜26くらい", line: "navy" },
    { stop: "ポーツマスのバス停" },
    { ride: "Uber / タクシー", note: "中心から少し離れているので車で5〜10分", line: "walk" },
    { stop: "Market Square" },
  ],
  fare: "交通費の目安：2人往復で$100前後",

  days: [
    {
      label: "1日目（水）",
      theme: "雑貨と港の日",
      rows: [
        { time: "9:30", text: "家を出る → 10時ごろのバス → 11:30ごろ到着。ホテルに荷物を預ける" },
        { time: "12:00", text: "昼：The Goods Market か The Friendly Toast", food: true },
        { time: "13:00", text: "Market Squareのまわりで雑貨めぐり（〜15:30）", shops: true },
        { time: "15:30", text: "港沿いのPrescott Parkへ。16:15ごろ日の入り" },
        { time: "16:30", text: "チェックインしてひと休み" },
        { time: "18:00", text: "夕食：Mamma Luca か Cure", food: true },
        { time: "夜", text: "灯りのついたMarket Squareをおさんぽ" },
      ],
    },
    {
      label: "2日目（木）",
      theme: "州境をまたぐ朝",
      rows: [
        { time: "8:30", text: "朝：Elephantine Bakery（路地の奥）", food: true },
        { time: "9:30", text: "Memorial Bridgeを歩いてメイン州キタリーへ。おやつにLil's Cafeのクルーラー" },
        { time: "11:30", text: "戻ってチェックアウト。買い残しの雑貨屋さん" },
        { time: "12:30", text: "昼：Portsmouth Gas Light Co.", food: true },
        { time: "14:00", text: "バス → 15:30ごろSouth Station → 16時過ぎに帰宅" },
      ],
    },
  ],

  shops: [
    { name: "Gus & Ruby Letterpress", text: "活版印刷のカードと文具（Congress St）" },
    { name: "Off Piste", text: "遊び心のある雑貨（Gus & Rubyのとなり）" },
    { name: "Nahcotta", text: "作家ものの器や文具。ギャラリー兼ショップ" },
    { name: "Pickwicks Mercantile", text: "不思議な雑貨がぎっしり" },
    { name: "RiverRun Bookstore", text: "新刊と古本、修理したタイプライター" },
  ],

  food: [
    { when: "1日目 昼", name: "The Goods Market", text: "Vaughan Mall。ラップやサンドイッチ" },
    { when: "1日目 昼", name: "The Friendly Toast", text: "レトロな店内。朝ごはんメニューが一日中" },
    { when: "1日目 夜", name: "Mamma Luca", text: "111 State St。薪窯のサワードウピザ", tags: ["チーズ"] },
    { when: "1日目 夜", name: "Cure", text: "State St。ロブスターのマック＆チーズ", tags: ["チーズ"] },
    { when: "2日目 朝", name: "Elephantine Bakery", text: "チョコアーモンドクロワッサン" },
    { when: "2日目 朝", name: "Lil's Cafe（キタリー）", text: "おやつにクルーラー" },
    { when: "2日目 昼", name: "Portsmouth Gas Light Co.", text: "パブ風。薪窯ピザもある", tags: ["チーズ"] },
  ],
  foodPhoto: "pt-mac-cheese",
  foodBubble: "チーズ多め！",

  // ホテルが決まったら、ここに足すと「泊まるところ」が出ます（いまは非表示）
  //   hotels: [ { name: "ホテル名", text: "ひとこと", link: { url: "https://...", label: "公式" } } ],

  links: [
    { url: "https://backroadramblers.com/portsmouth-nh-restaurants/", label: "レストラン" },
    { url: "https://thenewenglandguide.substack.com/p/the-best-of-what-to-see-do-and-eat", label: "お店" },
  ],
};

// ---------- 11/25 記念日 ----------
const ANNIVERSARY = {
  date: "11-25",
  title: "記念日",
  lead: "昼から一緒に、いちごのショートケーキ（15cm型）を作る日。",
  photos: ["an-shortcake", "an-charles-sunset"],
  steps: [
    { time: "13:00", title: "スポンジを焼く", text: "生地をまぜてオーブンへ。焼くのは30分ほど。" },
    { time: "15:00", title: "冷ます間におさんぽ", text: "チャールズ川沿いへ。" },
    { time: "16:15", title: "夕焼け", text: "川の向こうに日が沈むころ。", sun: true },
    { time: "17:00", title: "デコレーション", text: "帰って、生クリームといちごで仕上げ。" },
    { time: "夜", title: "おうちでお祝い", text: "" },
  ],
  bubble: "アメリカのオーブンは華氏！<br>170℃ ≒ 340°F",
  // 確認できたら done: true に
  prep: [
    { name: "オーブン", done: false },
    { name: "15cm型", note: "アメリカだと6インチ型", done: false },
    { name: "ハンドミキサー", done: false },
  ],
  shopping: {
    when: "11/24(火)に買い出し",
    items: ["いちご", "生クリーム（heavy whipping cream）", "卵", "薄力粉（cake flour）", "砂糖", "バター", "牛乳"],
  },
};

// ---------- ふらっとおでかけスポット ----------
//  solo: true で「ひとりでもOK」の印。map は Google Maps で検索する場所名（住所は書かない）。
//  写真がない場所は photo のかわりに illust: "market" / "bag" で手描きイラストになります。
const SPOTS = {
  lead: "思い立ったら、ふらっと行けるところ。ひとりでも大丈夫。",
  groups: [
    {
      label: "数時間",
      note: "家から地下鉄で15〜25分",
      items: [
        {
          name: "チャールズ川と橋",
          text: "家から歩いて行ける川沿い。Mass Aveの橋（Harvard Bridge）から見る16時半ごろの夕焼けがきれい。Longfellow Bridgeまで歩くのも。",
          photo: "spot-longfellow",
          solo: true,
          map: "Harvard Bridge Boston",
        },
        {
          name: "Central SquareのH Mart",
          text: "家から歩いても行ける。日本のお菓子や食材もそろうアジア系スーパー。フードコートもある。",
          illust: "bag",
          solo: true,
          map: "H Mart Central Square Cambridge",
        },
        {
          name: "Harvard Square",
          text: "CentralからRed Lineで1駅。Harvard Art Museums（いつでも無料、火〜日）、Harvard Yardの散歩、本屋めぐり。",
          photo: "spot-harvard-yard",
          solo: true,
          map: "Harvard Square Cambridge",
          link: { url: "https://www.thebostoncalendar.com/events/harvard-art-museums-at-night--85", label: "美術館" },
        },
        {
          name: "Beacon Hill と Public Garden",
          text: "Red LineのCharles/MGH駅から。石畳のAcorn Street、アンティークや雑貨の並ぶCharles Street、池のある公園。",
          photo: "spot-charles-street",
          solo: true,
          map: "Charles Street Beacon Hill Boston",
        },
        {
          name: "ボストン公共図書館（Copley）",
          text: "入館無料。天井の高い閲覧室と中庭、カフェ。帰りにNewbury Streetでお買い物。",
          info: "月〜木 9–20時／金土 9–17時／日 11–17時",
          photo: "spot-bpl-courtyard",
          solo: true,
          map: "Boston Public Library Central Library",
          link: { url: "https://www.bpl.org/visit-central-library", label: "公式" },
        },
        {
          name: "Bow Market（Somerville）",
          text: "中庭を囲んで、食べ物・アート・雑貨の小さなお店が30以上。Green LineのUnion Square駅。",
          info: "月〜水は16時から／木は11時から／金〜日は朝から",
          illust: "market",
          map: "Bow Market Somerville",
          link: { url: "https://www.thebostoncalendar.com/events/bow-market-hub-for-local-restaurants-shops-and-happenings-somerville", label: "紹介" },
        },
      ],
    },
    {
      label: "半日",
      note: "お昼すぎから、ゆっくり",
      items: [
        {
          name: "MFA（ボストン美術館）",
          text: "日本美術のコレクションも有名。",
          info: "MIT学生証の本人は無料（受付で見せる）／学生証なしは$30、第3木曜の夜は$5〜／火曜休館／木金は22時まで",
          photo: "spot-mfa",
          solo: true,
          map: "Museum of Fine Arts Boston",
          link: { url: "https://www.mfa.org/visit", label: "公式" },
        },
        {
          name: "ガードナー美術館",
          text: "邸宅の中庭が美しい美術館。",
          info: "MIT学生証の本人は無料（コード「MIT」で予約）／学生証なしは$22、MITACで前もって買えば$8／木曜17–21時は誰でも無料（要予約）／火曜休館",
          photo: "spot-gardner",
          solo: true,
          map: "Isabella Stewart Gardner Museum",
          link: { url: "https://hoodline.com/2026/06/isabella-stewart-gardner-museum-throws-open-doors-for-free-thursday-nights/", label: "木曜夜" },
        },
        {
          name: "North End と Quincy Market",
          text: "イタリア人街のベーカリーと、石畳の路地。Haymarket駅から。",
          photo: "spot-north-end",
          map: "North End Boston",
        },
        {
          name: "Seaport",
          text: "現代美術館ICA、Snowport、港沿いのおさんぽ。夕方〜夜がおすすめ。",
          info: "ICA：MIT学生証の本人は無料（予約）、学生証なしは通常料金、木曜17–21時は誰でも無料／Snowportは〜12/27、平日は15〜20時",
          photo: "spot-seaport-ica",
          map: "Institute of Contemporary Art Boston",
          link: { url: "https://www.boston25news.com/news/local/snowport-holiday-market-returning-boston-seaport-2026-holiday-season/VOOAPT3EP5FXRI4SVYFRFDNRO4/", label: "Snowport" },
        },
      ],
    },
    {
      label: "日帰り",
      note: "近郊電車で、ちょっと遠くへ",
      items: [
        {
          name: "セイラム",
          text: "North Stationから近郊電車（Newburyport/Rockport線）で30分ほど。ハロウィンのあとで街は落ち着いている。",
          info: "ピーボディ・エセックス博物館：木〜月10–17時／大人$25／火水休館",
          photo: "spot-salem-pem",
          map: "Peabody Essex Museum Salem",
          link: { url: "https://www.pem.org/visit", label: "博物館" },
        },
        {
          name: "コンコード",
          text: "近郊電車（Fitchburg線、Red LineのPorter駅からも乗れる）。『若草物語』の家とウォールデン池。駅からはUberが楽。",
          info: "Orchard House：11月の平日は11–15:30／ガイドツアー約45分／大人$15／時間指定チケットを予約",
          photo: "spot-concord-orchard",
          map: "Orchard House Concord MA",
          link: { url: "https://www.louisamayalcott.org/visit", label: "Orchard House" },
        },
        {
          name: "プロビデンス、ニューベリーポート",
          text: "3週目の日帰り候補は、平日にも行ける。",
          info: "平日は片道運賃／土日は$10で乗り放題",
          photo: "spot-providence",
          map: "Wickenden Street Providence",
          link: { url: "https://www.thebostoncalendar.com/events/10-commuter-rail-weekends-and-holidays--99", label: "$10パス" },
        },
      ],
    },
  ],
  solo: {
    title: "ひとりで出かけるときのメモ",
    lines: [
      "乗り換えはGoogle Mapsでそのまま調べられる。地下鉄はタッチ決済で。",
      "暗くなる前（16時半ごろ）に帰る。",
      "出かける前に、帰る時間を連絡し合う。",
      "モバイルバッテリーを持っていく。",
    ],
  },
};

// ---------- 暮らしのメモ ----------
const LIFE = [
  {
    id: "life-airport",
    title: "空港と家のあいだ",
    icon: "plane",
    wide: true,
    route: [
      { stop: "Logan空港" },
      { ride: "Uber", note: "車で20〜30分ほど（混む時間はもう少し）", line: "car" },
      { stop: "家" },
    ],
    lines: ["空港の乗り場は、Uberアプリの案内どおりに。", "帰国の日（11/29）も、家からUberで空港へ。"],
  },
  {
    id: "life-train",
    title: "電車の乗り方",
    icon: "train",
    wide: true,
    photo: "life-red-line",
    lines: [
      "<b>地下鉄・バス</b>：クレジットカードやスマホのタッチ決済で、そのまま改札を通れる。",
      "<b>近郊電車</b>：mTicketアプリで買う。土日は$10で全線乗り放題。",
    ],
  },
  {
    id: "life-cold",
    title: "寒さ",
    icon: "mitten",
    lines: [
      "最高気温10℃前後。下旬はひとケタ、朝晩は0℃近く。",
      "ダウン、手袋、ニット帽、歩きやすい靴。",
    ],
  },
  {
    id: "life-sunset",
    title: "日没",
    icon: "sun",
    lines: ["16時半ごろ。下旬は16時15分ごろ。", "外を歩くのは昼のうちに。"],
  },
  {
    id: "life-key",
    title: "鍵",
    icon: "key",
    lines: ["鍵はひとつだけ。どちらかが出かける日は、帰る時間を伝え合う。"],
  },
  {
    id: "life-holiday",
    title: "祝日",
    icon: "flag",
    lines: [
      "11/11 Veterans Day",
      "11/26 Thanksgiving（ほぼ全部お休み）",
      "11/27 Black Friday（どこも混む）",
    ],
  },
];
