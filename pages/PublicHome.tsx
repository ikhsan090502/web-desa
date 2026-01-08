import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchActivities, fetchHomeHero } from '../services/api'

/* =======================
   TYPES
   ======================= */

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
  excerpt: string
  category?: string
}

/* =======================
   HELPERS
   ======================= */

const normalizeList = <T,>(res: ApiListResponse<T> | any): T[] => {
  if (Array.isArray(res)) return res as T[]
  if (res && Array.isArray(res.data)) return res.data as T[]
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
  const cleaned = s.replace(/[^\d.-]/g, '')
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

const buildImageUrl = (origin: string, path?: string | null) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `${origin.replace(/\/+$/, '')}${p}`
}

const makeExcerpt = (text: string, maxLen = 120) => {
  const clean = (text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!clean) return 'Klik untuk melihat detail kegiatan.'
  if (clean.length <= maxLen) return clean
  return clean.slice(0, maxLen).trimEnd() + '…'
}

const normalizeStatus = (s?: string) => (String(s || '').trim() || 'Info')

/* =======================
   COMPONENT
   ======================= */

const PublicHome: React.FC = () => {
  const navigate = useNavigate()

  const ORIGIN = window.location.origin

  const [heroImage, setHeroImage] = useState<string>('') // ← DARI DB
  const [activitiesPreview, setActivitiesPreview] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  /* ===== LOAD HERO FROM DB ===== */
  useEffect(() => {
    const loadHero = async () => {
      try {
        const res: any = await fetchHomeHero()
        const img = res?.data?.image || ''
        setHeroImage(img)
      } catch (e) {
        console.error('Gagal load hero:', e)
        setHeroImage('')
      }
    }
    loadHero()
  }, [])

  /* ===== LOAD KEGIATAN ===== */
  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true)
      try {
        const res = await fetchActivities()
        const list = normalizeList<KegiatanApi>(res)

        const mapped: Activity[] = list
          .map((k) => {
            const title = (k.judul || k.title || '').trim() || '-'
            const rawDate = k.tanggal || k.date || k.updated_at || k.created_at
            const date = formatDateID(rawDate)
            const loc = (k.lokasi || k.loc || '').trim() || '-'
            const status = normalizeStatus(k.status)
            const budget = formatRupiah(k.anggaran ?? k.budget)
            const img = buildImageUrl(ORIGIN, k.foto_url ?? k.img)
            const excerpt = makeExcerpt(
              (k.ringkasan || k.excerpt || k.content || k.deskripsi || k.description || '').toString()
            )

            return {
              id: Number(k.id),
              title,
              date,
              loc,
              status,
              budget,
              img,
              excerpt,
              category: status,
            }
          })
          .filter((a) => Number.isFinite(a.id))
          .sort((a, b) => b.id - a.id)
          .slice(0, 3)

        setActivitiesPreview(mapped)
      } catch (e) {
        console.error('Error fetching activities:', e)
        setActivitiesPreview([])
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [ORIGIN])

  const isEmpty = useMemo(
    () => !loading && activitiesPreview.length === 0,
    [loading, activitiesPreview.length]
  )

  /* =======================
     RENDER
     ======================= */

  return (
    <div className="space-y-24 pb-24">
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-12 lg:pt-24 px-4 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Portal Resmi Pemerintah Desa
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Membangun Komunitas yang <span className="text-blue-600">Transparan</span> & Harmonis
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Akses informasi resmi desa, pantau perkembangan kegiatan wilayah,
                dan lihat laporan pembangunan secara transparan.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/kegiatan')}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-700"
                >
                  Lihat Kabar RT
                </button>
                <button
                  onClick={() => navigate('/keuangan')}
                  className="px-8 py-4 bg-white border border-slate-200 font-bold rounded-2xl hover:bg-slate-50"
                >
                  Transparansi Dana
                </button>
              </div>
            </div>

            {/* HERO IMAGE FROM DB */}
            <div className="flex-1 relative">
              <div className="aspect-square rounded-[3rem] bg-slate-100 overflow-hidden shadow-2xl rotate-3">
                {heroImage ? (
                  <img
                    src={buildImageUrl(ORIGIN, heroImage)}
                    alt="Hero Desa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Belum ada gambar hero
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KABAR TERBARU ===== */}
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Kabar Rukun Tetangga Terbaru
              </h2>
              <p className="text-slate-500 mt-2">
                Informasi kegiatan dan pembangunan terkini.
              </p>
            </div>
            <button
              onClick={() => navigate('/kegiatan')}
              className="text-blue-600 font-bold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Memuat data…</div>
          ) : !isEmpty ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {activitiesPreview.map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigate(`/kegiatan/${act.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-4 bg-slate-100">
                    {act.img ? (
                      <img
                        src={act.img}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : null}
                  </div>
                  <h4 className="font-bold text-lg">{act.title}</h4>
                  <div className="text-xs text-slate-400 mt-2">{act.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Belum ada kabar terbaru.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default PublicHome
