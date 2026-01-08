import React, { useEffect, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  fetchAllWarga,
  fetchAllKeuangan,
  fetchActivities,
  fetchHomeHero,
  updateHomeHero,
  uploadHeroImage,
} from '../services/api'

type ApiListResponse<T> =
  | T[]
  | { success?: boolean; data?: T[]; message?: string; error?: string }

type WargaApi = Record<string, any>

type KeuanganApi = {
  id?: number
  tipe?: string
  type?: string
  nominal?: number | string | null
  amount?: number | string | null
  tanggal?: string | null
  date?: string | null
  kategori?: string | null
  keterangan?: string | null
  created_at?: string | null
  [key: string]: any
}

type KegiatanApi = {
  id: number
  judul?: string
  title?: string
  tanggal?: string
  date?: string
  lokasi?: string
  loc?: string
  status?: string
  budget?: string
  img?: string
  excerpt?: string
  [key: string]: any
}

type Tx = {
  id: number
  tipe: 'Pemasukan' | 'Pengeluaran'
  nominal: number
  tanggal: string // YYYY-MM-DD
}

const normalizeList = <T,>(res: ApiListResponse<T> | unknown): T[] => {
  if (Array.isArray(res)) return res as T[]
  if (res && typeof res === 'object' && Array.isArray((res as any).data)) return (res as any).data as T[]
  return []
}

const toNumber = (v: any) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const cleaned = v.replace(/[^\d.-]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

const formatCurrency = (amount: number) => `Rp ${Math.round(amount).toLocaleString('id-ID')}`

const pad2 = (n: number) => String(n).padStart(2, '0')

const getMonthKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`
const monthLabel = (monthKey: string) => {
  const [y, m] = monthKey.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
}

const monthShort = (monthKey: string) => {
  const [y, m] = monthKey.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleString('id-ID', { month: 'short' }).replace('.', '')
}

const normalizeTipe = (t: any) => {
  const s = String(t ?? '').toLowerCase()
  if (s.includes('pemasukan') || s === 'masuk') return 'Pemasukan'
  if (s.includes('pengeluaran') || s === 'keluar') return 'Pengeluaran'
  return ''
}

const toISODateOnly = (isoLike: any) => {
  if (!isoLike) return ''
  const s = String(isoLike)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return ''
}

const addMonths = (monthKey: string, delta: number) => {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(y, (m - 1) + delta, 1)
  return getMonthKey(d)
}

const buildMonthOptions = (txs: Tx[]) => {
  const set = new Set<string>()
  txs.forEach((t) => set.add(t.tanggal.slice(0, 7)))
  const nowKey = getMonthKey(new Date())
  set.add(nowKey)
  set.add(addMonths(nowKey, -1))
  return Array.from(set).sort((a, b) => (a < b ? 1 : -1))
}

const getLatestMonthKeyFromTx = (txs: Tx[]) => {
  if (!txs.length) return getMonthKey(new Date())
  const latestDate = txs.reduce((max, t) => (t.tanggal > max ? t.tanggal : max), txs[0].tanggal)
  return latestDate.slice(0, 7)
}

const sumByMonthAndType = (txs: Tx[], monthKey: string, tipe: Tx['tipe']) =>
  txs
    .filter((t) => t.tipe === tipe && t.tanggal.startsWith(monthKey))
    .reduce((acc, t) => acc + t.nominal, 0)

// ===== helper untuk preview absolut =====
const buildAbsolute = (origin: string, maybePath: string) => {
  if (!maybePath) return ''
  if (/^https?:\/\//i.test(maybePath)) return maybePath
  const p = maybePath.startsWith('/') ? maybePath : `/${maybePath}`
  return `${origin.replace(/\/+$/, '')}${p}`
}

const AdminDashboard: React.FC = () => {
  const [residents, setResidents] = useState<WargaApi[]>([])
  const [txs, setTxs] = useState<Tx[]>([])
  const [activities, setActivities] = useState<KegiatanApi[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [selectedMonth, setSelectedMonth] = useState<string>('') // YYYY-MM

  // ===== state untuk HERO setting =====
  const ORIGIN = useMemo(() => window.location.origin, [])
  const [heroCurrent, setHeroCurrent] = useState<string>('') // value dari DB (/hero/xxx.jpg)
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [heroSaving, setHeroSaving] = useState(false)
  const [heroMsg, setHeroMsg] = useState<string>('')

  const loadHero = async () => {
    try {
      const res: any = await fetchHomeHero()
      const img = res?.data?.image || ''
      setHeroCurrent(img)
    } catch (e: any) {
      // jangan bikin admin dashboard gagal total
      setHeroMsg(e?.message || 'Gagal memuat setting hero')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setErrorMsg(null)
      try {
        const [wargaRes, keuRes, kegRes] = await Promise.all([
          fetchAllWarga() as Promise<ApiListResponse<WargaApi>>,
          fetchAllKeuangan() as Promise<ApiListResponse<KeuanganApi>>,
          fetchActivities() as Promise<ApiListResponse<KegiatanApi>>,
        ])

        const wargaList = normalizeList<WargaApi>(wargaRes)
        const keuList = normalizeList<KeuanganApi>(keuRes)
        const kegList = normalizeList<KegiatanApi>(kegRes)

        const mappedTx: Tx[] = keuList
          .map((k) => {
            const tipe = normalizeTipe(k.tipe ?? k.type)
            const tanggal = toISODateOnly(k.tanggal ?? k.date ?? k.created_at)
            const nominal = toNumber(k.nominal ?? k.amount)
            const id = Number(k.id ?? 0)

            if (!id || !tipe || !tanggal) return null
            return { id, tipe: tipe as Tx['tipe'], nominal, tanggal }
          })
          .filter(Boolean) as Tx[]

        setResidents(wargaList)
        setTxs(mappedTx)
        setActivities(kegList)

        const defaultMonth = getLatestMonthKeyFromTx(mappedTx)
        setSelectedMonth(defaultMonth)
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setErrorMsg(err?.message || 'Gagal memuat data admin')
        setResidents([])
        setTxs([])
        setActivities([])
        setSelectedMonth(getMonthKey(new Date()))
      } finally {
        setLoading(false)
      }
    }

    loadData()
    loadHero()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalWarga = residents.length
  const monthOptions = useMemo(() => buildMonthOptions(txs), [txs])

  const activeMonth = useMemo(() => {
    if (selectedMonth) return selectedMonth
    return getLatestMonthKeyFromTx(txs)
  }, [selectedMonth, txs])

  const monthlyIn = useMemo(() => sumByMonthAndType(txs, activeMonth, 'Pemasukan'), [txs, activeMonth])
  const monthlyOut = useMemo(() => sumByMonthAndType(txs, activeMonth, 'Pengeluaran'), [txs, activeMonth])

  const stats = useMemo(
    () => [
      { label: 'Total Warga', value: String(totalWarga), change: 'Terdata Aktif', icon: 'groups' },
      { label: `Pemasukan (${monthShort(activeMonth)})`, value: formatCurrency(monthlyIn), change: 'Kas Masuk', icon: 'payments' },
      { label: `Pengeluaran (${monthShort(activeMonth)})`, value: formatCurrency(monthlyOut), change: 'Kas Keluar', icon: 'receipt_long' },
      { label: 'Total Kegiatan', value: String(activities.length), change: 'Terpublikasi', icon: 'auto_awesome' },
    ],
    [totalWarga, monthlyIn, monthlyOut, activities.length, activeMonth]
  )

  const financeHistory = useMemo(() => {
    const months: { month: string; masuk: number; keluar: number; key: string }[] = []
    for (let i = 5; i >= 0; i--) {
      const mk = addMonths(activeMonth, -i)
      const masuk = sumByMonthAndType(txs, mk, 'Pemasukan')
      const keluar = sumByMonthAndType(txs, mk, 'Pengeluaran')
      months.push({ key: mk, month: monthShort(mk), masuk, keluar })
    }
    const hasAny = months.some((m) => m.masuk !== 0 || m.keluar !== 0)
    if (!hasAny) return months.map((m) => ({ ...m, masuk: 0, keluar: 0 }))
    return months
  }, [txs, activeMonth])

  const heroPreview = useMemo(() => {
    if (heroFile) return URL.createObjectURL(heroFile)
    return buildAbsolute(ORIGIN, heroCurrent)
  }, [heroFile, heroCurrent, ORIGIN])

  const saveHero = async () => {
    setHeroMsg('')
    if (!heroFile) {
      setHeroMsg('Pilih gambar dulu.')
      return
    }

    setHeroSaving(true)
    try {
      // upload dulu
      const up: any = await uploadHeroImage(heroFile)
      const imagePath = up?.data?.imagePath || up?.data?.imageUrl || up?.imagePath || up?.imageUrl || ''
      if (!imagePath) throw new Error('Upload berhasil, tapi imagePath kosong.')

      // simpan setting
      const saved: any = await updateHomeHero(imagePath)
      if (!saved?.success) throw new Error(saved?.error || 'Gagal menyimpan setting hero')

      setHeroCurrent(imagePath)
      setHeroFile(null)
      setHeroMsg('Berhasil: gambar hero home sudah diganti.')
    } catch (e: any) {
      setHeroMsg(e?.message || 'Gagal menyimpan gambar hero.')
    } finally {
      setHeroSaving(false)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  if (errorMsg) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMsg}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Ringkasan Sistem</h1>
          <p className="text-sm text-slate-500 font-medium">
            Data dihitung otomatis dari database warga dan laporan kas
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <span className="material-symbols-outlined text-slate-500 text-base">calendar_month</span>
            <select
              value={activeMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-sm font-bold bg-transparent border-none focus:ring-0 outline-none"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </div>

          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">
            Unduh Laporan
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            Input Data Baru
          </button>
        </div>
      </div>

      {/* ✅ PANEL KECIL: Setting Gambar Hero Home */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Gambar Hero Public Home</h2>
            <p className="text-xs text-slate-500 font-bold">
              Mengatur gambar besar di halaman depan (PublicHome).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            <button
              onClick={saveHero}
              disabled={heroSaving}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-60"
            >
              {heroSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Preview
            </div>
            <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
              {heroPreview ? (
                <img src={heroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                  Belum ada gambar
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Current value (di DB)
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700 break-all">
              {heroCurrent || '-'}
            </div>

            {heroMsg ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                {heroMsg}
              </div>
            ) : null}

            <div className="text-[11px] text-slate-500">
              Catatan: Kalau file ada di server, nilai yang disimpan biasanya seperti <b>/hero/nama-file.jpg</b>.
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase text-indigo-400">
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-extrabold text-slate-900">Arus Kas Keuangan</h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                Range: 6 bulan berakhir di <span className="text-slate-700">{monthLabel(activeMonth)}</span>
              </p>
            </div>

            <select
              value={activeMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-[10px] font-black bg-slate-50 border-none rounded-lg focus:ring-indigo-200 uppercase tracking-widest px-4 py-2"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeHistory}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '24px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: any, name: any) => {
                    const label = name === 'masuk' ? 'Pemasukan' : 'Pengeluaran'
                    return [formatCurrency(Number(value || 0)), label]
                  }}
                />
                <Area type="monotone" dataKey="masuk" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorMasuk)" />
                <Area type="monotone" dataKey="keluar" stroke="#ef4444" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Log */}
        <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl text-white space-y-6">
          <h3 className="font-black text-sm uppercase tracking-[0.2em] opacity-50">
            Log Sistem Terkini
          </h3>

          <div className="space-y-6">
            {[
              { time: '2 Jam', task: 'Update Profil Desa', note: 'Sinkronisasi Visi Misi' },
              { time: '5 Jam', task: 'Input Warga Baru', note: 'RT 02 Dusun I' },
              { time: '1 Hari', task: 'Laporan Keuangan', note: `Rekap bulan ${monthShort(activeMonth)}` },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-1 h-10 bg-indigo-500 rounded-full shrink-0"></div>
                <div>
                  <p className="text-sm font-black text-white leading-tight">{log.task}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    {log.note}
                  </p>
                  <p className="text-[9px] font-black text-indigo-400 mt-2 uppercase">
                    {log.time} yang lalu
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all mt-4">
            Lihat Log Lengkap
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
