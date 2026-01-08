import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = '/api'

type LoginResponse =
  | { success: true; token?: string; user?: any }
  | { success: false; error?: string }

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      // ✅ aman: kalau bukan json, tidak crash
      let json: LoginResponse | null = null
      try {
        json = (await resp.json()) as LoginResponse
      } catch {
        json = null
      }

      if (!resp.ok || !json || json.success === false) {
        const msg =
          (json && 'error' in json && json.error) ||
          `Gagal login (HTTP ${resp.status}).`
        setError(msg || 'Username atau password salah.')
        return
      }

      // simpan token kalau ada
      const token = (json as any)?.token
      if (token) localStorage.setItem('admin_token', token)

      onLogin()
      navigate('/admin')
    } catch (err: any) {
      setError(err?.message || 'Gagal login. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white mb-6 shadow-xl shadow-blue-100">
              <span className="material-symbols-outlined text-3xl">shield_person</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Admin SI-WARGA</h1>
            <p className="text-sm text-slate-500 mt-2">Silakan masuk untuk mengelola data wilayah</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span> {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-200 py-4 px-6 text-sm font-semibold"
                placeholder="Masukkan username..."
                autoComplete="username"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-200 py-4 px-6 text-sm font-semibold"
                placeholder="Masukkan password..."
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              Kembali ke Portal Publik
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
