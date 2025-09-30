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
    // đọc body thủ công (đảm bảo hoạt động trên Vercel)
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const bodyText = Buffer.concat(buffers).toString();

    // Expect JSON from frontend: { username, password }
    const { username, password } = JSON.parse(bodyText || "{}");

    if (!username || !password) {
      return res.status(400).json({ error: "Thiếu username hoặc password" });
    }

    // Tạo body x-www-form-urlencoded giống curl
    const params = new URLSearchParams({
      type: "Login",
      username: username,
      password: password
    });

    // Gửi request tới endpoint bằng fetch (giống curl bạn gửi)
    const response = await fetch("https://www.nso9x.com/assets/ajaxs/Xulylog.php", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.122 Mobile/15E148 Safari/604.1",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params,
      redirect: "manual"
    });

    // Lấy header Set-Cookie (nếu có)
    const setCookie = response.headers.get("set-cookie") || "";

    // (Tùy chọn) lấy body text để debug nếu cần
    const rawBody = await response.text();

    // Trả về cookie cho frontend (và raw body để debug nếu muốn)
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
      cookie: setCookie,
      raw: rawBody // bạn có thể xóa field này sau khi test xong
    });

  } catch (err) {
    console.error("login proxy error:", err);
    return res.status(500).json({ error: "Lỗi login proxy: " + err.message });
  }
}
