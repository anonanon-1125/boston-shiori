// =============================================================
//  写真の一覧（名前 → ファイルとクレジット）
// -------------------------------------------------------------
//  plan.js では写真をここの「名前」で呼びます（例: "w1-gardner"）。
//
//  自分たちの写真に差し替えるとき:
//    1. python3 tools/prep_photo.py ~/Desktop/IMG_1234.HEIC w1-gardner
//       → photos/w1-gardner.jpg が上書きされます（縮小・位置情報の削除つき）
//    2. 下の該当する写真の credit: {...} の行を消す
//       （credit がない写真はページ下のクレジットに出ません）
//    3. 必要なら alt（写真の説明。キャプションにも出ます）を書きかえる
//
//  写真を増やすときは、同じ形で1つ追加して plan.js から名前で呼べばOK。
//  pos: "50% 30%" を足すと、トリミングの位置（横 縦）を調整できます。
// =============================================================

const PHOTOS = {
  "cover-acorn-street": {
    src: "photos/cover-acorn-street.jpg",
    alt: "ビーコンヒルのエイコーン通り。石畳とガス灯",
    credit: { title: "Acorn Street, Beacon Hill, Boston.jpg", author: "R Boed", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", page: "https://commons.wikimedia.org/wiki/File:Acorn_Street,_Beacon_Hill,_Boston.jpg" },
  },
  "w1-charles-river": {
    src: "photos/w1-charles-river.jpg",
    alt: "チャールズ川とボストンの街並み、ヨット",
    credit: { title: "Sunset, Boston (7271272646).jpg", author: "Sayamindu Dasgupta from Cambridge, MA, United States", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", page: "https://commons.wikimedia.org/wiki/File:Sunset,_Boston_(7271272646).jpg" },
  },
  "w1-gardner": {
    src: "photos/w1-gardner.jpg",
    alt: "ガードナー美術館の中庭",
    credit: { title: "Isabella Stewart Gardner Museum Boston November 2016 002.jpg", author: "King of Hearts", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Isabella_Stewart_Gardner_Museum_Boston_November_2016_002.jpg" },
  },
  "w1-mit-museum": {
    src: "photos/w1-mit-museum.jpg",
    alt: "MIT Museumの入口",
    credit: { title: "(USA-Massachusetts) MIT Museum Entrance 2024-06-11.jpg", author: "S5A-0043", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", page: "https://commons.wikimedia.org/wiki/File:(USA-Massachusetts)_MIT_Museum_Entrance_2024-06-11.jpg" },
  },
  "w2-public-garden": {
    src: "photos/w2-public-garden.jpg",
    alt: "紅葉のパブリックガーデン",
    credit: { title: "Boston Public Garden November 2016 001.jpg", author: "King of Hearts", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Boston_Public_Garden_November_2016_001.jpg" },
  },
  "w2-library": {
    src: "photos/w2-library.jpg",
    alt: "ボストン公共図書館のベイツ・ホール",
    credit: { title: "Bates Hall - Boston Public Library - edit1.jpg", author: "Hari Krishnan", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Bates_Hall_-_Boston_Public_Library_-_edit1.jpg" },
  },
  "w2-newbury": {
    src: "photos/w2-newbury.jpg",
    alt: "ニューベリー通りのレンガの建物",
    credit: { title: "15-37 Newbury Street near the Public Garden, Boston, Massachusetts.jpg", author: "Daderot at en.wikipedia", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:15-37_Newbury_Street_near_the_Public_Garden,_Boston,_Massachusetts.jpg" },
  },
  "w2-harvard-art": {
    src: "photos/w2-harvard-art.jpg",
    alt: "ハーバード美術館の吹き抜け",
    credit: { title: "Interior view of the Harvard Art Museums - Harvard University - Cambridge, MA - DSC01822.jpg", author: "Daderot", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en", page: "https://commons.wikimedia.org/wiki/File:Interior_view_of_the_Harvard_Art_Museums_-_Harvard_University_-_Cambridge,_MA_-_DSC01822.jpg" },
  },
  "w2-mfa": {
    src: "photos/w2-mfa.jpg",
    alt: "ボストン美術館の展示室",
    credit: { title: "Museum-of-Fine-Arts-Boston-02.jpg", author: "Sintakso", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Museum-of-Fine-Arts-Boston-02.jpg" },
  },
  "w3-sowa": {
    src: "photos/w3-sowa.jpg",
    alt: "SoWaのギャラリー",
    credit: { title: "OCOT SoWa First Friday 5-1-09 172.jpg", author: "SoWa Sundays", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", page: "https://commons.wikimedia.org/wiki/File:OCOT_SoWa_First_Friday_5-1-09_172.jpg" },
  },
  "w3-faneuil-tree": {
    src: "photos/w3-faneuil-tree.jpg",
    alt: "ファニエルホールのツリー",
    credit: { title: "Christmas tree near the Quincy Market.jpg", author: "Das Nili", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", page: "https://commons.wikimedia.org/wiki/File:Christmas_tree_near_the_Quincy_Market.jpg" },
  },
  "w3-quincy-market": {
    src: "photos/w3-quincy-market.jpg",
    alt: "クリスマス飾りのクインシー・マーケット",
    credit: { title: "1408 px -Quincy Market Boston Christmas 2006.JPG", author: "Abhijitsathe", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0", page: "https://commons.wikimedia.org/wiki/File:1408_px_-Quincy_Market_Boston_Christmas_2006.JPG" },
  },
  "w3-providence": {
    src: "photos/w3-providence.jpg",
    alt: "プロビデンスのベネフィット通り",
    credit: { title: "Benefit Street, Providence, RI.jpg", author: "Daniel Case", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:Benefit_Street,_Providence,_RI.jpg" },
  },
  "w3-newburyport": {
    src: "photos/w3-newburyport.jpg",
    alt: "ニューベリーポートのレンガの街並み",
    credit: { title: "2011 Newburyport Massachusetts USA.jpg", author: "openroads.com", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", page: "https://commons.wikimedia.org/wiki/File:2011_Newburyport_Massachusetts_USA.jpg" },
  },
  "last-seaport": {
    src: "photos/last-seaport.jpg",
    alt: "シーポートの港とICA",
    credit: { title: "ICA (36339).jpg", author: "Rhododendrites", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:ICA_(36339).jpg" },
  },
  "pt-market-square": {
    src: "photos/pt-market-square.jpg",
    alt: "冬のポーツマス、マーケット・スクエア",
    credit: { title: "Portsmouth, NH - Market Square.JPG", author: "Daderot", license: "Public domain", licenseUrl: "https://en.wikipedia.org/wiki/Public_domain", page: "https://commons.wikimedia.org/wiki/File:Portsmouth,_NH_-_Market_Square.JPG" },
  },
  "pt-north-church": {
    src: "photos/pt-north-church.jpg",
    alt: "ノース・チャーチの尖塔",
    credit: { title: "Market Square, Portsmouth.jpg", author: "Domenico Convertini", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", page: "https://commons.wikimedia.org/wiki/File:Market_Square,_Portsmouth.jpg" },
  },
  "pt-memorial-bridge": {
    src: "photos/pt-memorial-bridge.jpg",
    alt: "メモリアル・ブリッジ",
    credit: { title: "Memorial Bridge (Portsmouth, New Hampshire) April 2016.JPG", author: "Ken Gallager at English Wikipedia", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", page: "https://commons.wikimedia.org/wiki/File:Memorial_Bridge_(Portsmouth,_New_Hampshire)_April_2016.JPG" },
  },
  "pt-prescott-park": {
    src: "photos/pt-prescott-park.jpg",
    alt: "プレスコット・パークの桟橋と港",
    credit: { title: "Portsmouth Harbor, Prescott Park, Portsmouth, NH - panoramio.jpg", author: "PennyLennox", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0", page: "https://commons.wikimedia.org/wiki/File:Portsmouth_Harbor,_Prescott_Park,_Portsmouth,_NH_-_panoramio.jpg" },
  },
  "pt-mac-cheese": {
    src: "photos/pt-mac-cheese.jpg",
    alt: "マック＆チーズ（イメージ）",
    credit: { title: "Bistro Napa at the Atlantis Casino Resort Spa in Reno, Nevada - July 2021 - Sarah Stierch 11.jpg", author: "Missvain", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", page: "https://commons.wikimedia.org/wiki/File:Bistro_Napa_at_the_Atlantis_Casino_Resort_Spa_in_Reno,_Nevada_-_July_2021_-_Sarah_Stierch_11.jpg" },
  },
  "an-shortcake": {
    src: "photos/an-shortcake.jpg",
    alt: "いちごのショートケーキ",
    credit: { title: "Shortcake slice.jpg", author: "Shisma", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", page: "https://commons.wikimedia.org/wiki/File:Shortcake_slice.jpg" },
  },
  "an-charles-sunset": {
    src: "photos/an-charles-sunset.jpg",
    alt: "チャールズ川の夕焼けとロングフェロー橋",
    credit: { title: "Sunset over the Charles river.jpg", author: "Corey Leopold", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", page: "https://commons.wikimedia.org/wiki/File:Sunset_over_the_Charles_river.jpg" },
  },
  "life-red-line": {
    src: "photos/life-red-line.jpg",
    alt: "雪の日のレッドライン",
    credit: { title: "Outbound MBTA Red Line train on Longfellow Bridge Feb 2025 1.jpg", author: "4300streetcar", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", page: "https://commons.wikimedia.org/wiki/File:Outbound_MBTA_Red_Line_train_on_Longfellow_Bridge_Feb_2025_1.jpg" },
  },
  // ---- ふらっとおでかけスポット ----
  "spot-longfellow": {
    src: "photos/spot-longfellow.jpg",
    alt: "チャールズ川とロングフェロー橋",
    credit: { title: "Longfellow Bridge with Red Line Train Oct 2024.jpg", author: "4300streetcar", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", page: "https://commons.wikimedia.org/wiki/File:Longfellow_Bridge_with_Red_Line_Train_Oct_2024.jpg" },
  },
  "spot-harvard-yard": {
    src: "photos/spot-harvard-yard.jpg",
    alt: "秋のハーバード・ヤード",
    credit: { title: "Harvard Yard in autumn, Boston, Massachusetts, 2015.jpg", author: "Nina R from Africa", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", page: "https://commons.wikimedia.org/wiki/File:Harvard_Yard_in_autumn,_Boston,_Massachusetts,_2015.jpg" },
  },
  "spot-charles-street": {
    src: "photos/spot-charles-street.jpg",
    alt: "ビーコンヒルのチャールズ通り",
    credit: { title: "Looking south down Charles Street from Pinckney Street, Beacon Hill, Boston, 2007.jpg", author: "DimiTalen", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en", page: "https://commons.wikimedia.org/wiki/File:Looking_south_down_Charles_Street_from_Pinckney_Street,_Beacon_Hill,_Boston,_2007.jpg" },
  },
  "spot-bpl-courtyard": {
    src: "photos/spot-bpl-courtyard.jpg",
    alt: "ボストン公共図書館の中庭",
    credit: { title: "Boston Public Library Courtyard in Summer.jpg", author: "Dbli4805", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Boston_Public_Library_Courtyard_in_Summer.jpg" },
  },
  "spot-mfa": {
    src: "photos/spot-mfa.jpg",
    alt: "ボストン美術館",
    credit: { title: "Museum of Fine Arts, Boston in November 2021.jpg", author: "Sdkb", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Museum_of_Fine_Arts,_Boston_in_November_2021.jpg" },
  },
  "spot-gardner": {
    src: "photos/spot-gardner.jpg",
    alt: "ガードナー美術館の中庭",
    credit: { title: "Isabella-Stewart-Gardner-Museum-Courtyard-11.jpg", author: "Sintakso", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Isabella-Stewart-Gardner-Museum-Courtyard-11.jpg" },
  },
  "spot-north-end": {
    src: "photos/spot-north-end.jpg",
    alt: "ノースエンドのHanover Street",
    credit: { title: "2009 HanoverSt Boston.jpg", author: "Tim Sackton from Somerville, MA", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", page: "https://commons.wikimedia.org/wiki/File:2009_HanoverSt_Boston.jpg" },
  },
  "spot-seaport-ica": {
    src: "photos/spot-seaport-ica.jpg",
    alt: "夜のICA（現代美術館）",
    credit: { title: "Institute of Contemporary Art.jpg", author: "Smart Destinations", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", page: "https://commons.wikimedia.org/wiki/File:Institute_of_Contemporary_Art.jpg" },
  },
  "spot-salem-pem": {
    src: "photos/spot-salem-pem.jpg",
    alt: "ピーボディ・エセックス博物館",
    credit: { title: "Interior - Peabody Essex Museum - DSC08063.jpg", author: "Daderot", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en", page: "https://commons.wikimedia.org/wiki/File:Interior_-_Peabody_Essex_Museum_-_DSC08063.jpg" },
  },
  "spot-concord-orchard": {
    src: "photos/spot-concord-orchard.jpg",
    alt: "オーチャード・ハウス（若草物語の家）",
    credit: { title: "OrchardHouseConcord2CMA.jpg", author: "Daderot at English Wikipedia", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", page: "https://commons.wikimedia.org/wiki/File:OrchardHouseConcord2CMA.jpg" },
  },
  "spot-providence": {
    src: "photos/spot-providence.jpg",
    alt: "プロビデンスのWickenden Street",
    credit: { title: "Wickenden Street Providence RI 3.jpg", author: "Swampyank at en.wikipedia", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", page: "https://commons.wikimedia.org/wiki/File:Wickenden_Street_Providence_RI_3.jpg" },
  },
  // ---- 予定ごとの写真 ----
  "w1-mit-dome": {
    src: "photos/w1-mit-dome.jpg",
    alt: "雪のKillian CourtとGreat Dome",
    credit: { title: "Great dome of MIT, Feb 2021 (2) (cropped).jpg", author: "Peacearth", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Great_dome_of_MIT,_Feb_2021_(2)_(cropped).jpg" },
  },
  "w1-boston-lights": {
    src: "photos/w1-boston-lights.jpg",
    alt: "ランタン展のイメージ",
    credit: { title: "China festival of lights", author: "Alias 0591", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", page: "https://www.flickr.com/photos/44206268@N07/4225401715" },
  },
  "w2-snowport": {
    src: "photos/w2-snowport.jpg",
    alt: "Seaportの冬マーケット",
    credit: { title: "Stalls at the Seaport Holiday Market 2024", author: "chris.rycroft", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", page: "https://www.flickr.com/photos/193316968@N06/54500038520" },
  },
  "last-stars": {
    src: "photos/last-stars.jpg",
    alt: "Seaportの冬マーケットの星の灯り",
    credit: { title: "Paper star display", author: "chris.rycroft", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/", page: "https://www.flickr.com/photos/193316968@N06/54497255686" },
  },
};
