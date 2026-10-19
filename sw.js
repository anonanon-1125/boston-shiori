// 一度開いたページを、電波がないときでも見られるようにする小さな仕組み。
// ・ページと予定（html/css/js）は「まずネットから最新を取り、だめなら保存分」
// ・写真とフォントは「保存分をすぐ出して、裏で最新に更新」
// 中身を大きく変えたときは VERSION の数字を上げると、古い保存分が消えます。
const VERSION = "v1";
const CACHE = "shiori-" + VERSION;
const CORE = ["./", "index.html", "style.css", "plan.js", "photos.js", "app.js", "manifest.webmanifest", "icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("shiori-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function save(req, res) {
  if (res && (res.ok || res.type === "opaque")) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isPhoto = sameOrigin && /\/(photos|icons)\//.test(url.pathname);
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";

  if (isPhoto || isFont) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const fresh = fetch(req).then((res) => save(req, res)).catch(() => hit);
        return hit || fresh;
      })
    );
    return;
  }
  if (!sameOrigin) return;

  e.respondWith(
    fetch(new Request(req.url, { cache: "no-cache", credentials: "same-origin" }))
      .then((res) => save(req, res))
      .catch(() => caches.match(req).then((hit) => hit || caches.match("index.html")))
  );
});
