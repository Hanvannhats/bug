// api/login.js
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Chỉ hỗ trợ POST" });

  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "Thiếu username/password" });

    const form = new URLSearchParams({ type: "Login", username, password });

    const response = await fetch("https://www.nso9x.com/assets/ajaxs/Xulylog.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.122 Mobile/15E148 Safari/604.1",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://www.nso9x.com",
        "Referer": "https://www.nso9x.com/"
      },
      body: form,
      redirect: "follow"
    });

    const raw = await response.text().catch(()=>"");
    const setCookie = response.headers.get("set-cookie") || "";

    // Nếu không có set-cookie -> login thất bại
    if (!setCookie) {
      return res.status(200).json({ ok: false, message: "Login thất bại hoặc server không trả cookie.", raw });
    }

    // Lấy PHPSESSID và token nếu có
    const matchPHP = setCookie.match(/PHPSESSID=[^;]+/);
    const matchToken = setCookie.match(/token=[^;]+/);
    const cookie = [matchPHP && matchPHP[0], matchToken && matchToken[0]].filter(Boolean).join("; ");

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ ok: true, cookie, raw, setCookieHeader: setCookie });
  } catch (err) {
    console.error("login error:", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ ok: false, error: err.message });
  }
}
