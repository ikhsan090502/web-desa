import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchActivities } from '../services/api'

type KegiatanApi = {
  id: number
  judul?: string
  title?: string
  tanggal?: string
  date?: string
  lokasi?: string
  loc?: string
  status?: string
  anggaran?: string | number | null
  budget?: string | number | null
  foto_url?: string | null
  img?: string | null
  ringkasan?: string | null
  excerpt?: string | null
  deskripsi?: string | null
  description?: string | null
  content?: string | null
  created_at?: string
  updated_at?: string

  // ✅ NEW: untuk urutan tampil dari admin
  urutan_tampil?: number | null

  [key: string]: any
}

type Activity = {
  id: number
  title: string
  date: string
  loc: string
  status: string
  budget: string
  img: string
  excerpt: string
  order: number // ✅ untuk sorting
}

const normalizeList = <T,>(res: unknown): T[] => {
  if (Array.isArray(res)) return res as T[]
  if (!res || typeof res !== 'object') return []

  const anyRes = res as any
  if (Array.isArray(anyRes.data)) return anyRes.data as T[]
  if (anyRes.data && Array.isArray(anyRes.data.data)) return anyRes.data.data as T[] // nested
  if (Array.isArray(anyRes.rows)) return anyRes.rows as T[]
  return []
}

const formatDateID = (raw?: string) => {
  if (!raw) return '-'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return String(raw)
  const day = d.toLocaleString('id-ID', { day: '2-digit' })
  const month = d.toLocaleString('id-ID', { month: 'short' })
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * Terima input:
 * - number: 2000000
 * - string angka: "2000000.00", "2.000.000", "2,000,000", "Rp 2.000.000"
 * Output:
 * - "Rp 2.000.000" (format id-ID, tanpa desimal)
 */
const parseToNumber = (v: any): number | null => {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null

  const s = String(v).trim()
  if (!s || s === '-') return null

  let cleaned = s.replace(/[^\d.,-]/g, '')
  if (!cleaned) return null

  // "2000000.00" => dot sebagai desimal
  if (cleaned.includes('.') && !cleaned.includes(',')) {
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : null
  }

  // "2.000.000" / "2,000,000" / campuran => desimal pakai separator terakhir
  const lastComma = cleaned.lastIndexOf(',')
  const lastDot = cleaned.lastIndexOf('.')
  const lastSep = Math.max(lastComma, lastDot)

  if (lastSep >= 0) {
    const intPart = cleaned.slice(0, lastSep).replace(/[.,]/g, '')
    const decPart = cleaned.slice(lastSep + 1).replace(/[^\d]/g, '')
    const normalized = decPart ? `${intPart}.${decPart}` : intPart
    const n = Number(normalized)
    return Number.isFinite(n) ? n : null
  }

  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

const formatRupiah = (v: any) => {
  const n = parseToNumber(v)
  if (n === null) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}

const buildImageUrl = (origin: string, fotoUrl?: string | null) => {
  if (!fotoUrl) return ''
  if (/^https?:\/\//i.test(fotoUrl)) return encodeURI(fotoUrl)

  const cleanOrigin = String(origin || '').replace(/\/+$/, '')
  const path = fotoUrl.startsWith('/') ? fotoUrl : `/${fotoUrl}`
  return encodeURI(`${cleanOrigin}${path}`)
}

const makeExcerpt = (text: string, maxLen = 140) => {
  const clean = (text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!clean) return 'Klik untuk melihat detail kegiatan.'
  if (clean.length <= maxLen) return clean
  return clean.slice(0, maxLen).trimEnd() + '…'
}

const normalizeStatus = (s?: string) => (String(s || '').trim() || 'Info')

const PublicKegiatan: React.FC = () => {
  const navigate = useNavigate()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const ORIGIN =
    (import.meta as any).env?.VITE_PUBLIC_BASE_URL ||
    (import.meta as any).env?.VITE_BASE_URL ||
    window.location.origin

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setErrorMsg(null)

      try {
        const res = await fetchActivities()
        const list = normalizeList<KegiatanApi>(res)

        // fallback order biar stabil kalau urutan_tampil null
        const mapped: Activity[] = list
          .map((k, idx) => {
            const title = (k.judul || k.title || '').trim() || '-'
            const rawDate = k.tanggal || k.date || k.updated_at || k.created_at
            const date = formatDateID(rawDate)

            const loc = (k.lokasi || k.loc || '').trim() || '-'
            const status = normalizeStatus(k.status)

            const budgetRaw = k.anggaran ?? k.budget
            const budget = formatRupiah(budgetRaw)

            const img = buildImageUrl(ORIGIN, (k.foto_url ?? k.img) as any)

            const longText = (k.ringkasan ||
              k.excerpt ||
              k.content ||
              k.deskripsi ||
              k.description ||
              '') as any
            const excerpt = makeExcerpt(String(longText || ''), 150)

            const order =
              typeof k.urutan_tampil === 'number' && Number.isFinite(k.urutan_tampil)
                ? Number(k.urutan_tampil)
                : idx + 1

            return {
              id: Number(k.id),
              title,
              date,
              loc,
              status,
              budget,
              img,
              excerpt,
              order,
            }
          })
          .filter((a) => Number.isFinite(a.id))

        // ✅ urut berdasarkan urutan_tampil dari admin
        mapped.sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999))

        setActivities(mapped)
      } catch (err: any) {
        console.error('Error fetching activities:', err)
        setActivities([])
        setErrorMsg(err?.message || 'Gagal memuat data kegiatan')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [ORIGIN])

  const isEmpty = useMemo(() => !loading && activities.length === 0, [loading, activities.length])

  if (loading) return <div className="p-6">Loading...</div>

  if (errorMsg) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{errorMsg}</div>
      </div>
    )
  }

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
            Informasi Terkini
          </span>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Kabar Rukun Tetangga</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Pantau perkembangan pembangunan wilayah, berita terbaru, dan agenda penting secara transparan di sini.
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center text-slate-600">Belum ada kegiatan yang dipublikasikan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => navigate(`/kegiatan/${act.id}`)}
                className="group cursor-pointer bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                  {act.img ? (
                    <img
                      src={act.img}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                    </div>
                  )}

                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-indigo-700 shadow-sm">
                    {act.status}
                  </div>
                </div>

                <div className="p-10">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.date}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {act.budget !== '-' ? act.budget : ''}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                    {act.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">{act.excerpt}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200/50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span className="text-[10px] font-bold">{act.loc}</span>
                    </div>
                    <span className="material-symbols-outlined text-indigo-600 group-hover:translate-x-2 transition-transform">
                      arrow_forward
                    </span>
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

export default PublicKegiatan
