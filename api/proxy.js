// api/proxy.js
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Chỉ hỗ trợ POST" });

  try {
    const payload = req.body || {};
    const cookie = payload.cookie || "";
    const params = payload.params || {};

    // Allow some keys; but allow dynamic too
    const form = new URLSearchParams();
    for (const k of Object.keys(params)) {
      if (params[k] !== undefined && params[k] !== null) form.append(k, String(params[k]));
    }

    const response = await fetch("https://www.nso9x.com/assets/ajaxs/Xulylog.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.122 Mobile/15E148 Safari/604.1",
        "Cookie": cookie
      },
      body: form,
      redirect: "manual"
    });

    const text = await response.text().catch(()=>"");
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (response.ok) {
      return res.status(200).json({ ok: true, message: "Yêu cầu gửi thành công.", raw: text });
    } else {
      return res.status(500).json({ ok: false, message: "Server gốc trả lỗi", status: response.status, raw: text });
    }
  } catch(err) {
    console.error("proxy error:", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ ok: false, error: err.message });
  }
}
