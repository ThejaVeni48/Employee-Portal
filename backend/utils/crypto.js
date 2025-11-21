// utils/crypto.js
const CryptoJS = require("crypto-js");
const SECRET = process.env.CRYPTO_SECRET || "change-this-secret";

function encrypt(text) {
  return CryptoJS.AES.encrypt(text || "", SECRET).toString();
}
function decrypt(cipher) {
  if (!cipher) return "";
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };
