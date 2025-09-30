// File: api/login.js
export default async function handler(req, res) {
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
    // Đọc body thủ công (đảm bảo hoạt động trên môi trường Vercel)
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const bodyText = Buffer.concat(buffers).toString();
    // Expect JSON from frontend: { username, password }
    const { username, password } = JSON.parse(bodyText);

    // Tạo form body giống curl bạn cung cấp
    const params = new URLSearchParams({
      type: "Login",
      username: username,
      password: password
    });

    // Gửi request tới site gốc (theo lệnh curl bạn đưa)
    const response = await fetch("https://www.nso9x.com/assets/ajaxs/Xulylog.php", {
      method: "POST",
      headers: {
        "Host": "www.nso9x.com",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "Accept-Language": "vi-VN,vi;q=0.9",
        "Sec-Fetch-Mode": "cors",
        "Origin": "https://www.nso9x.com",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.122 Mobile/15E148 Safari/604.1",
        "Referer": "https://www.nso9x.com/",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
      },
      body: params,
      redirect: "manual"
    });

    // Lấy cookie từ header Set-Cookie (nếu có)
    // Node fetch có thể trả null nếu không có set-cookie
    const setCookie = response.headers.get("set-cookie") || "";

    // Nếu server trả JSON body kèm thông tin session, bạn cũng có thể parse response.text() hoặc response.json()
    const textBody = await response.text();

    // Trả về cookie (thô) và (tuỳ chọn) body gốc để debug
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
      cookie: setCookie,
      raw: textBody // bạn có thể xoá "raw" sau khi confirm hoạt động
    });
  } catch (err) {
    return res.status(500).json({ error: "Lỗi login proxy: " + err.message });
  }
}
