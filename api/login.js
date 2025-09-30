const params = new URLSearchParams({
  type: "Login",
  username,
  password
});

// URL phải đúng, không thêm user:pass
const response = await fetch("https://www.nso9x.com/assets/ajaxs/Xulylog.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 ..."
  },
  body: params,
  redirect: "follow"
});
