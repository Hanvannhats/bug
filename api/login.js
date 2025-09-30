// api/login.js
export default async function handler(req, res) {
  // CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Chỉ hỗ trợ POST" });
  }

  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "Thiếu username hoặc password" });
    }

    // Body x-www-form-urlencoded giống curl
    const params = new URLSearchParams({
      type: "Login",
      username,
      password
    });

    // Gửi POST tới nso9x
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
      body: params,
      redirect: "follow"
    });

    const raw = await response.text();
    const setCookieHeader = response.headers.get("set-cookie") || "";

    // Lọc PHPSESSID và token nếu có
    let cookie = "";
    const matchPHP = setCookieHeader.match(/PHPSESSID=[^;]+/);
    const matchToken = setCookieHeader.match(/token=[^;]+/);
    cookie = [matchPHP && matchPHP[0], matchToken && matchToken[0]].filter(Boolean).join("; ");

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
      ok: true,
      cookie,
      setCookieHeader,
      raw
    });

  } catch (err) {
    console.error("Login error:", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Lỗi login proxy: " + err.message });
  }
}
