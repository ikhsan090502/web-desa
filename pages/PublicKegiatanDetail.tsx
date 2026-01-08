import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchActivities } from '../services/api'

type ApiListResponse<T> =
  | T[]
  | { success?: boolean; data?: T[]; message?: string; error?: string }

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
  isi?: string | null
  content?: string | null
  created_at?: string
  updated_at?: string
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
  description: string
  content: string
}

const normalizeList = <T,>(res: ApiListResponse<T>): T[] => {
  if (Array.isArray(res)) return res
  if (res && Array.isArray((res as any).data)) return (res as any).data
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

const parseToNumber = (v: any): number | null => {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null

  const s = String(v).trim()
  if (!s || s === '-') return null

  let cleaned = s.replace(/[^\d.,-]/g, '')
  if (!cleaned) return null

  if (cleaned.includes('.') && !cleaned.includes(',')) {
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : null
  }

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
  const path = fotoUrl.startsWith('/') ? fotoUrl : `/${fotoUrl}`
  return encodeURI(`${origin}${path}`)
}

const pickContent = (k: KegiatanApi) => {
  const c = (k.isi ?? k.content ?? k.deskripsi ?? k.description ?? k.ringkasan ?? k.excerpt ?? '') || ''
  return String(c)
}

const normalizeOne = (k: KegiatanApi, origin: string): Activity => {
  const title = (k.judul || k.title || '').trim() || '-'
  const rawDate = k.tanggal || k.date || k.updated_at || k.created_at
  const date = formatDateID(rawDate)
  const loc = (k.lokasi || k.loc || '').trim() || '-'
  const status = (k.status || '').trim() || 'Info'

  // ✅ selalu format Rupiah
  const budgetRaw = k.anggaran ?? k.budget
  const budget = formatRupiah(budgetRaw)

  const img = buildImageUrl(origin, (k.foto_url ?? k.img) as any)

  const content = pickContent(k)
  const description = content

  return {
    id: Number(k.id),
    title,
    date,
    loc,
    status,
    budget,
    img,
    description,
    content,
  }
}

const splitParagraphs = (text: string) => {
  const clean = (text || '').replace(/\r\n/g, '\n').trim()
  if (!clean) return []
  return clean.split('\n').map((p) => p.trim()).filter(Boolean)
}

const PublicKegiatanDetail: React.FC = () => {
  const { id } = useParams()
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
        const res = (await fetchActivities()) as ApiListResponse<KegiatanApi>
        const list = normalizeList(res)
        const mapped = list.map((k) => normalizeOne(k, ORIGIN)).filter((x) => Number.isFinite(x.id))
        setActivities(mapped)
      } catch (error: any) {
        console.error('Error fetching activities:', error)
        setActivities([])
        setErrorMsg(error?.message || 'Gagal memuat data kegiatan')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [ORIGIN])

  const activity = useMemo(() => {
    const targetId = Number(id)
    if (!Number.isFinite(targetId)) return undefined
    return activities.find((item) => item.id === targetId)
  }, [activities, id])

  if (loading) return <div className="p-6">Loading...</div>

  if (errorMsg) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{errorMsg}</div>
        <div className="mt-4">
          <button onClick={() => navigate('/kegiatan')} className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl shadow-lg">
            Kembali ke Daftar
          </button>
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
        <h2 className="text-2xl font-black text-slate-900">Kabar Tidak Ditemukan</h2>
        <p className="text-slate-500 mt-2 mb-8">Maaf, informasi yang Anda cari mungkin telah dihapus atau dipindahkan.</p>
        <button onClick={() => navigate('/kegiatan')} className="px-8 py-3 bg-indigo-700 text-white font-bold rounded-2xl shadow-lg">
          Kembali ke Daftar
        </button>
      </div>
    )
  }

  const paragraphs = splitParagraphs(activity.content || activity.description || '')

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="border-b border-slate-100 bg-slate-50/50 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <button
            onClick={() => navigate('/kegiatan')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black uppercase text-[10px] tracking-widest transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Kembali ke Kabar Rukun Tetangga
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16">
        <div className="mb-10">
          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              {activity.status}
            </span>
            <span className="px-4 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-widest">
              Dana Desa
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">{activity.title}</h1>

          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Pelaksanaan</p>
                <p className="text-sm font-bold text-slate-800">{activity.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-lg">location_on</span>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Lokasi</p>
                <p className="text-sm font-bold text-slate-800">{activity.loc}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-lg">payments</span>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Anggaran</p>
                <p className="text-sm font-bold text-slate-800">{activity.budget}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border-4 border-white ring-1 ring-slate-100 bg-slate-100">
            {activity.img ? (
              <img
                src={activity.img}
                className="w-full h-full object-cover"
                alt={activity.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-slate-300">image</span>
              </div>
            )}
          </div>
          <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
            Dokumentasi Kegiatan Desa Banjarsari
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="text-slate-600 font-medium leading-[2] text-lg">
            {paragraphs.length ? (
              paragraphs.map((para, i) => (
                <p key={i} className="mb-8">
                  {para}
                </p>
              ))
            ) : (
              <p className="mb-8">Detail kegiatan belum diisi.</p>
            )}
          </div>
        </div>

        <div className="mt-20 p-10 md:p-14 bg-indigo-900 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-indigo-200">
          <div className="max-w-md text-center md:text-left">
            <h4 className="text-2xl font-black mb-3">Transparansi Publik</h4>
            <p className="text-indigo-100 opacity-80 leading-relaxed font-medium">
              Informasi ini dipublikasikan sebagai bentuk keterbukaan informasi publik Pemerintah Desa. Jika ada
              ketidaksesuaian data, silakan lapor kepada admin.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button
              type="button"
              className="px-10 py-4 bg-white text-indigo-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
              onClick={() => alert('Silakan hubungi admin RT melalui kontak resmi.')}
            >
              <span className="material-symbols-outlined">chat</span> Hubungi Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicKegiatanDetail
