import React, { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import { fetchAllWarga, fetchLastUpdateWarga } from '../services/api'

type ApiListResponse<T> =
  | T[]
  | { success?: boolean; data?: T[]; message?: string; error?: string }

type Warga = {
  id: number
  nama_lengkap?: string
  jenis_kelamin?: 'L' | 'P' | string
  tanggal_lahir?: string | null
  status_warga?: string | null
  no_kk?: string | null
  nik?: string | null
  [key: string]: any
}

/* ===================== DATE HELPERS ===================== */

// parse 'YYYY-MM-DD' (paling aman). Kalau format lain, fallback Date(input).
const parseDateSafe = (input?: string | null): Date | null => {
  if (!input) return null
  const s = String(input).trim()
  if (!s) return null

  // format ISO date
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) {
    const y = Number(m[1])
    const mo = Number(m[2]) - 1
    const d = Number(m[3])
    const dt = new Date(Date.UTC(y, mo, d))
    if (!Number.isNaN(dt.getTime())) return dt
  }

  const dt = new Date(s)
  if (Number.isNaN(dt.getTime())) return null
  return dt
}

const formatMonthYearID = (input: any): string => {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  const month = d.toLocaleString('id-ID', { month: 'short' })
  const year = d.getFullYear()
  return `${month} ${year}`
}

const calcAgeYears = (birth?: string | null): number | null => {
  const b = parseDateSafe(birth)
  if (!b) return null
  const now = new Date()
  let age = now.getUTCFullYear() - b.getUTCFullYear()

  const mNow = now.getUTCMonth()
  const mBirth = b.getUTCMonth()
  if (mNow < mBirth || (mNow === mBirth && now.getUTCDate() < b.getUTCDate())) {
    age -= 1
  }
  if (age < 0 || age > 130) return null
  return age
}

const calcAgeMonths = (birth?: string | null): number | null => {
  const b = parseDateSafe(birth)
  if (!b) return null
  const now = new Date()

  let months =
    (now.getUTCFullYear() - b.getUTCFullYear()) * 12 +
    (now.getUTCMonth() - b.getUTCMonth())

  // kalau hari sekarang < hari lahir, kurangi 1 bulan (biar tidak “kelebihan bulan”)
  if (now.getUTCDate() < b.getUTCDate()) months -= 1

  if (months < 0 || months > 12 * 130) return null
  return months
}

/* ===================== COMPONENT ===================== */

const PublicDataWarga: React.FC = () => {
  const [residents, setResidents] = useState<Warga[]>([])
  const [lastUpdate, setLastUpdate] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setErrorMsg(null)

      try {
        const [wargaRes, updateRes] = await Promise.all([
          fetchAllWarga(),
          fetchLastUpdateWarga(),
        ])

        // ===== normalize warga response =====
        let list: Warga[] = []
        const wr = wargaRes as ApiListResponse<Warga>

        if (Array.isArray(wr)) list = wr
        else if (wr && Array.isArray((wr as any).data)) list = (wr as any).data
        else list = []

        setResidents(list)

        // ===== normalize lastUpdate =====
        const lu =
          (updateRes as any)?.lastUpdate ??
          (updateRes as any)?.data?.lastUpdate ??
          (typeof updateRes === 'string' ? updateRes : null)

        setLastUpdate(lu ? formatMonthYearID(lu) : '')
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setResidents([])
        setLastUpdate('')
        setErrorMsg(err?.message || 'Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /* ===================== BASIC STATS ===================== */

  const totalWarga = residents.length

  const totalKK = useMemo(
    () => residents.filter((r) => String(r.status_warga ?? '').toUpperCase() === 'KK').length,
    [residents]
  )

  const maleCount = useMemo(
    () => residents.filter((r) => String(r.jenis_kelamin ?? '').toUpperCase() === 'L').length,
    [residents]
  )

  const femaleCount = useMemo(
    () => residents.filter((r) => String(r.jenis_kelamin ?? '').toUpperCase() === 'P').length,
    [residents]
  )

  const genderData = useMemo(
    () => [
      { name: 'Laki-laki', value: maleCount },
      { name: 'Perempuan', value: femaleCount },
    ],
    [maleCount, femaleCount]
  )

  /* ===================== AGE GROUPS (REAL) ===================== */

  const ageStats = useMemo(() => {
    // bucket counters
    let usia_0_6_bulan = 0
    let usia_6_59_bulan = 0
    let usia_5_6_tahun = 0
    let usia_6_14_tahun = 0
    let usia_15_18_tahun = 0
    let usia_19_59_tahun = 0
    let usia_60_70_tahun = 0
    let usia_70_plus = 0

    // WUS
    let wus = 0

    // PUS (per no_kk)
    const byKK = new Map<string, Warga[]>()

    for (const r of residents) {
      const months = calcAgeMonths(r.tanggal_lahir ?? null)
      const years = calcAgeYears(r.tanggal_lahir ?? null)

      // ===== age buckets =====
      if (months != null) {
        if (months >= 0 && months < 6) usia_0_6_bulan += 1
        else if (months >= 6 && months < 60) usia_6_59_bulan += 1
        else if (months >= 60 && months < 84) usia_5_6_tahun += 1
        else if (months >= 84 && months < 180) usia_6_14_tahun += 1
        else if (months >= 180 && months < 228) usia_15_18_tahun += 1
        // sisanya pakai years biar rapi (19+)
      }

      if (years != null) {
        if (years >= 19 && years <= 59) usia_19_59_tahun += 1
        else if (years >= 60 && years <= 70) usia_60_70_tahun += 1
        else if (years >= 71) usia_70_plus += 1

        // ===== WUS (Wanita Usia Subur) =====
        const jk = String(r.jenis_kelamin ?? '').toUpperCase()
        if (jk === 'P' && years >= 15 && years <= 49) wus += 1
      }

      // ===== group by no_kk for PUS =====
      const kk = String(r.no_kk ?? '').trim()
      if (kk) {
        const arr = byKK.get(kk) ?? []
        arr.push(r)
        byKK.set(kk, arr)
      }
    }

    // ===== PUS counting =====
    // definisi: 1 KK usia 15-59 + 1 ISTRI perempuan WUS (15-49) dalam no_kk yang sama
    let pus = 0
    for (const [, members] of byKK.entries()) {
      let hasKK_15_59 = false
      let hasIstriWUS = false

      for (const m of members) {
        const status = String(m.status_warga ?? '').toUpperCase()
        const jk = String(m.jenis_kelamin ?? '').toUpperCase()
        const years = calcAgeYears(m.tanggal_lahir ?? null)

        if (years == null) continue

        if (status === 'KK' && years >= 15 && years <= 59) hasKK_15_59 = true
        if (status === 'ISTRI' && jk === 'P' && years >= 15 && years <= 49) hasIstriWUS = true
      }

      if (hasKK_15_59 && hasIstriWUS) pus += 1
    }

    const buckets = [
      { name: '0–6 bln', value: usia_0_6_bulan, color: '#60a5fa' },
      { name: '6–59 bln', value: usia_6_59_bulan, color: '#34d399' },
      { name: '5–6 th', value: usia_5_6_tahun, color: '#fbbf24' },
      { name: '6–14 th', value: usia_6_14_tahun, color: '#a78bfa' },
      { name: '15–18 th', value: usia_15_18_tahun, color: '#fb7185' },
      { name: '19–59 th', value: usia_19_59_tahun, color: '#22c55e' },
      { name: '60–70 th', value: usia_60_70_tahun, color: '#f97316' },
      { name: '70+ th', value: usia_70_plus, color: '#ef4444' },
    ]

    return {
      pus,
      wus,
      buckets,
      debug: {
        usia_0_6_bulan,
        usia_6_59_bulan,
        usia_5_6_tahun,
        usia_6_14_tahun,
        usia_15_18_tahun,
        usia_19_59_tahun,
        usia_60_70_tahun,
        usia_70_plus,
      },
    }
  }, [residents])

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
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Statistik Kependudukan
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Informasi demografi wilayah yang disajikan secara anonim demi menjaga privasi warga.
          </p>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
            <span className="material-symbols-outlined text-4xl text-blue-600 mb-4">
              groups
            </span>
            <p className="text-slate-500 font-bold text-sm uppercase">Total Warga Terdata</p>
            <h2 className="text-5xl font-extrabold text-slate-900 mt-2">
              {totalWarga.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
            <span className="material-symbols-outlined text-4xl text-green-500 mb-4">
              family_restroom
            </span>
            <p className="text-slate-500 font-bold text-sm uppercase">Total KK</p>
            <h2 className="text-5xl font-extrabold text-slate-900 mt-2">
              {totalKK.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
            <span className="material-symbols-outlined text-4xl text-fuchsia-500 mb-4">
              woman
            </span>
            <p className="text-slate-500 font-bold text-sm uppercase">WUS (P 15–49 th)</p>
            <h2 className="text-5xl font-extrabold text-slate-900 mt-2">
              {ageStats.wus.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
            <span className="material-symbols-outlined text-4xl text-amber-500 mb-4">
              home
            </span>
            <p className="text-slate-500 font-bold text-sm uppercase">Update Terakhir</p>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              {lastUpdate || '-'}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              PUS dihitung per No KK (pasangan)
            </p>
          </div>
        </div>

        {/* PUS CARD (separate) */}
        <div className="mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-indigo-600">
                diversity_1
              </span>
              <div>
                <p className="text-slate-500 font-bold text-sm uppercase">
                  PUS (berdasarkan No KK)
                </p>
                <p className="text-xs text-slate-400">
                  KK 15–59 th + ISTRI perempuan WUS (15–49 th) dalam KK yang sama
                </p>
              </div>
            </div>
            <div className="text-5xl font-extrabold text-slate-900">
              {ageStats.pus.toLocaleString()}
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* AGE */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600">cake</span>
              Komposisi Usia (Real dari Tgl Lahir)
            </h3>

            <div className="h-96 w-full min-h-[360px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={360}>
                <BarChart data={ageStats.buckets}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {ageStats.buckets.map((entry, idx) => (
                      <Cell key={`age-cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
              {ageStats.buckets.map((b) => (
                <div key={b.name} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <span className="font-bold">{b.name}</span>
                  <span className="font-black">{b.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GENDER */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600">diversity_3</span>
              Distribusi Gender
            </h3>

            <div className="h-96 w-full min-h-[360px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={320} minHeight={360}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={115}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f472b6" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              <div>Laki-laki: <b>{maleCount}</b></div>
              <div>Perempuan: <b>{femaleCount}</b></div>
            </div>
          </div>
        </div>

        {/* FOOTNOTE */}
        <div className="mt-10 text-xs text-slate-500">
          <p>
            Catatan: bila banyak warga tidak punya <b>tanggal_lahir</b>, maka perhitungan usia tidak akan masuk ke kelompok umur.
            PUS juga hanya bisa dihitung jika <b>no_kk</b> tersedia untuk mengelompokkan anggota keluarga.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PublicDataWarga
