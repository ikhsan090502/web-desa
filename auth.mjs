// auth.mjs
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from './db.mjs'

export async function loginHandler(req, res) {
  try {
    const { username, password } = req.body || {}

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username & password wajib diisi.' })
    }

    const u = String(username).trim()

    const [rows] = await pool.query(
      'SELECT id, username, password_hash, nama_lengkap FROM admin WHERE username = ? LIMIT 1',
      [u]
    )

    const user = rows?.[0]
    if (!user) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' })
    }

    const ok = await bcrypt.compare(String(password), String(user.password_hash))
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' })
    }

    const secret = process.env.JWT_SECRET || 'CHANGE_ME_SECRET'
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      { expiresIn: '7d' }
    )

    // optional update last_login
    await pool.query('UPDATE admin SET last_login = NOW() WHERE id = ?', [user.id])

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap || null,
      },
    })
  } catch (e) {
    console.error('LOGIN ERROR:', e)
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
}
