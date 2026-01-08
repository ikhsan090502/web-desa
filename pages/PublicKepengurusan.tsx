import React, { useEffect, useMemo, useState } from 'react'
import { fetchKepengurusan } from '../services/api'

type ApiListResponse<T> = T[] | { success?: boolean; data?: T[]; message?: string; error?: string }

type PengurusApi = {
  id: number
  nama_lengkap?: string
  gelar?: string | null
  jabatan?: string
  masa_jabatan?: string
  foto_url?: string | null
  urutan_tampil?: number
  is_aktif?: number
  [key: string]: any
}

type Member = {
  id: number
  name: string
  degree: string
  role: string
  period: string
  img: string
}

const normalizeList = <T,>(res: ApiListResponse<T>): T[] => {
  if (Array.isArray(res)) return res
  if (res && Array.isArray((res as any).data)) return (res as any).data
  return []
}

const PLACEHOLDER = '/assets/avatar-placeholder.jpg'

const buildImageUrl = (origin: string, fotoUrl?: string | null) => {
  if (!fotoUrl) return PLACEHOLDER
  if (/^https?:\/\//i.test(fotoUrl)) return encodeURI(fotoUrl)

  const cleanOrigin = String(origin || '').replace(/\/+$/, '')
  const path = fotoUrl.startsWith('/') ? fotoUrl : `/${fotoUrl}`
  return encodeURI(`${cleanOrigin}${path}`)
}

const PublicKepengurusan: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const ORIGIN =
    (import.meta as any).env?.VITE_PUBLIC_BASE_URL ||
    (import.meta as any).env?.VITE_BASE_URL ||
    window.location.origin

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      setLoading(true)
      setErrorMsg(null)
      try {
        const res = (await fetchKepengurusan()) as ApiListResponse<PengurusApi>
        const list = normalizeList(res)

        const mapped: Member[] = list
          .filter((p) => (typeof p.is_aktif === 'number' ? p.is_aktif === 1 : true))
          .sort((a, b) => (a.urutan_tampil ?? 9999) - (b.urutan_tampil ?? 9999))
          .map((p) => ({
            id: Number(p.id),
            name: (p.nama_lengkap || '').trim() || '-',
            degree: (p.gelar ?? '').toString().trim(),
            role: (p.jabatan || '').trim() || '-',
            period: (p.masa_jabatan || '').trim() || '-',
            img: buildImageUrl(ORIGIN, p.foto_url),
          }))

        if (!cancelled) setMembers(mapped)
      } catch (error: any) {
        console.error('Error fetching kepengurusan:', error)
        if (!cancelled) {
          setMembers([])
          setErrorMsg(error?.message || 'Gagal memuat data kepengurusan')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [ORIGIN])

  const isEmpty = useMemo(() => !loading && members.length === 0, [loading, members.length])

  if (loading) return <div className="p-6">Loading...</div>

  if (errorMsg) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{errorMsg}</div>
      </div>
    )
  }

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
            Pelayan Masyarakat
          </span>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Struktur Pengurus Rukun Tetangga</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Susunan Pengurus Rukun Tetangga yang berdedikasi tinggi dalam mewujudkan pelayanan publik prima dan pembangunan berkelanjutan.
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center text-slate-600">Data kepengurusan belum tersedia.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {members.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 group hover:-translate-y-3 transition-all duration-500 border border-slate-100"
              >
                <div className="aspect-[4/5] overflow-hidden relative bg-slate-100">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1'
                        img.src = PLACEHOLDER
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-8">
                    <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {p.role}
                    </span>
                  </div>
                </div>

                <div className="p-10">
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                    {p.name}
                    {p.degree ? `, ${p.degree}` : ''}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Masa Bakti: {p.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicKepengurusan
