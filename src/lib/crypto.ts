import { hash, genSalt } from 'bcryptjs'

// 盐轮次 — 与小程序 hashPassword 不同（这是真 bcrypt）
export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(10)
  return hash(password, salt)
}

export async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  // 直接按 bcrypt 比较
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(inputPassword, storedHash)
}
