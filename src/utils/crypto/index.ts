import CryptoJS from "crypto-js"

const CryptoSecret = "__CRYPTO_SECRET__"

export function enCrypto(data: any) {
  const str = JSON.stringify(data)
  return CryptoJS.AES.encrypt(str, CryptoSecret).toString()
}

export function deCrypto(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, CryptoSecret)
  const str = bytes.toString(CryptoJS.enc.Utf8)

  if (str) return JSON.parse(str)

  return null
}

// https://juejin.cn/post/7062240582587908133
export function encryptoPassword(password) {
  return CryptoJS.PBKDF2(password, password, {
    keySize: 64,
    iterations: 500
  })
    .toString()
    .toUpperCase()
}
