// File: api/proxy.js
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
    // Đọc body thủ công (phòng trường hợp req.body undefined)
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = JSON.parse(Buffer.concat(buffers).toString());

    const { cookie, reward, quantity } = data;

    const params = new URLSearchParams({
      type: "spin",
      reward,
      quantity,
      name: "Chuy%2525E1%2525BB%252583n%252BTinh%252BTh%2525E1%2525BA%2525A1ch"
    });

    const response = await fetch("https://www.nso9x.com/assets/ajaxs/Xulylog.php", {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_0 like Mac OS X)",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookie
      },
      body: params
    });

    const text = await response.text();

    return res.status(200).json({
  message: "Đã gửi item vào hành trang. Vui lòng kiểm tra !"
});
  } catch (err) {
    return res.status(500).json({ error: "Lỗi Proxy: " + err.message });
  }
}
