// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { cookie, reward, quantity, params } = req.body;

  if (!cookie) return res.status(400).json({ ok: false, message: 'Missing cookie' });

  try {
    let formBody = new URLSearchParams();

    if (params && params.type === 'Tanthu') {
      formBody.append('type', 'Tanthu');
      formBody.append('amount', params.amount);
    } else {
      formBody.append('type', 'spin');
      formBody.append('reward', reward);
      formBody.append('quantity', quantity);
    }

    const response = await fetch('https://www.nso9x.com/assets/ajaxs/Xulylog.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.122 Mobile/15E148 Safari/604.1'
      },
      body: formBody.toString()
    });

    const text = await response.text();
    return res.status(200).json({ ok: true, raw: text });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}
