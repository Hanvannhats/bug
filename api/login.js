// api/login.js
export default async function handler(req, res) {
  // CORS preflight
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
    // Đọc body JSON từ frontend
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const bodyText = Buffer.concat(buffers).toString();
    const { username, password } = JSON.parse(bodyText || "{}");

    if (!username || !password) {
      return res.status(400).json({ error: "Thiếu username hoặc password" });
    }

    // Tạo body x-www-form-urlencoded
    const params = new URLSearchParams({
      type: "Login",
      username,
      password
    });

    // Gửi POST tới site gốc
    const response = await fetch("https://www.nso9x.com/assets/ajaxs/Xulylog.php", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.122 Mobile/15E148 Safari/604.1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params,
      redirect: "manual"
    });

    // Lấy Set-Cookie từ header
    const setCookie = response.headers.get("set-cookie") || "";

    // Lọc chỉ giữ PHPSESSID và token (giả sử site trả token; nếu không có, sẽ giữ nguyên PHPSESSID)
    let cookie = "";
    if (setCookie) {
      const matchPHP = setCookie.match(/PHPSESSID=[^;]+/);
      const matchToken = setCookie.match(/token=[^;]+/);
      cookie = [matchPHP && matchPHP[0], matchToken && matchToken[0]].filter(Boolean).join("; ");
    }

    // Trả về cookie cho frontend
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ cookie });

  } catch (err) {
    console.error("Login proxy error:", err);
    return res.status(500).json({ error: "Lỗi login proxy: " + err.message });
  }
}
