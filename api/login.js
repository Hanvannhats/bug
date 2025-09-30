// api/login.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Missing username or password' });
  }

  try {
    const formBody = new URLSearchParams();
    formBody.append('type', 'Login');
    formBody.append('username', username);
    formBody.append('password', password);

    const response = await fetch('https://www.nso9x.com/assets/ajaxs/Xulylog.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.122 Mobile/15E148 Safari/604.1'
      },
      body: formBody.toString(),
      redirect: 'manual'
    });

    const setCookie = response.headers.get('set-cookie') || '';
    const text = await response.text();

    // Kiểm tra login thành công dựa vào response text hoặc cookie
    if (setCookie.includes('PHPSESSID') || /success/i.test(text)) {
      return res.status(200).json({ ok: true, cookie: setCookie });
    } else {
      return res.status(401).json({ ok: false, message: 'Login thất bại, username/password sai' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Lỗi server: ' + err.message });
  }
}
