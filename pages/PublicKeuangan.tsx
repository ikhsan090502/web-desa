// pages/PublicKeuangan.tsx
import React, { useEffect, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { fetchAllKeuangan } from '../services/api'

/* ================= TYPES ================= */

type ApiListResponse<T> =
  | T[]
  | { success?: boolean; data?: T[]; message?: string; error?: string }

type TxApi = {
  id?: number
  tipe?: 'Pemasukan' | 'Pengeluaran' | string
  nominal?: number | string | null
  tanggal?: string | null // YYYY-MM-DD
  keterangan?: string | null
  kategori?: string | null
  created_at?: string | null
  [key: string]: any
}

type Tx = {
  id: number
  tipe: 'Pemasukan' | 'Pengeluaran'
  nominal: number
  tanggal: string // YYYY-MM-DD
  keterangan: string
  kategori: string
}

type HistoryPoint = {
  month: string // label (Jan 2026)
  masuk: number
  keluar: number
}

/* ================= HELPERS ================= */

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

const pad2 = (n: number) => String(n).padStart(2, '0')

// YYYY-MM-DD (aman dari ISO / created_at)
const toISODateOnly = (isoLike: any) => {
  if (!isoLike) return ''
  const s = String(isoLike)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return ''
}

// YYYY-MM dari string date
const monthKey = (raw?: string) => {
  if (!raw) return ''
  return String(raw).slice(0, 7)
}

const getMonthKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`

const monthLabelLongID = (yyyyMm: string) => {
  const [y, m] = yyyyMm.split('-').map(Number)
  if (!y || !m) return yyyyMm
  const d = new Date(y, m - 1, 1)
  return d.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
}

const monthLabelShortID = (yyyyMm: string) => {
  const [y, m] = yyyyMm.split('-').map(Number)
  if (!y || !m) return yyyyMm
  const d = new Date(y, m - 1, 1)
  return d.toLocaleString('id-ID', { month: 'short', year: 'numeric' }).replace('.', '')
}

const addMonths = (yyyyMm: string, delta: number) => {
  const [y, m] = yyyyMm.split('-').map(Number)
  const d = new Date(y, (m - 1) + delta, 1)
  return getMonthKey(d)
}

const buildMonthOptions = (txs: Tx[]) => {
  const set = new Set<string>()
  txs.forEach((t) => set.add(t.tanggal.slice(0, 7)))

  // pastikan current & prev month tetap ada walau kosong
  const nowKey = getMonthKey(new Date())
  set.add(nowKey)
  set.add(addMonths(nowKey, -1))

  // sort desc
  return Array.from(set).sort((a, b) => (a < b ? 1 : -1))
}

const latestMonthFromTx = (txs: Tx[]) => {
  if (!txs.length) return getMonthKey(new Date())
  const latest = txs.reduce((max, t) => (t.tanggal > max ? t.tanggal : max), txs[0].tanggal)
  return latest.slice(0, 7)
}

const formatCurrencyFull = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

// Y axis adaptif
const formatIDRAdaptive = (value: number) => {
  const v = Number(value || 0)
  const abs = Math.abs(v)

  if (abs < 100_000) return `Rp ${v.toLocaleString('id-ID')}`
  if (abs < 1_000_000) {
    const k = v / 1_000
    return `Rp ${k.toLocaleString('id-ID', { maximumFractionDigits: 0 })} rb`
  }
  if (abs < 1_000_000_000) {
    const j = v / 1_000_000
    return `Rp ${j.toLocaleString('id-ID', { maximumFractionDigits: 2 })} jt`
  }
  const b = v / 1_000_000_000
  return `Rp ${b.toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`
}

const formatIDRFullPlain = (value: number) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`

/* ================= COMPONENT ================= */

const PublicKeuangan: React.FC = () => {
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [selectedMonth, setSelectedMonth] = useState<string>('') // YYYY-MM

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setErrorMsg(null)
      try {
        const res = (await fetchAllKeuangan()) as ApiListResponse<TxApi>
        const list = normalizeList<TxApi>(res)

        const mapped: Tx[] = list
          .map((t, idx) => {
            const tipeRaw = String(t.tipe || '').trim().toLowerCase()
            const tipe: Tx['tipe'] =
              tipeRaw.includes('pengeluaran') || tipeRaw === 'keluar'
                ? 'Pengeluaran'
                : 'Pemasukan'

            const tanggal = toISODateOnly(t.tanggal ?? t.created_at)
            return {
              id: typeof t.id === 'number' ? t.id : idx + 1,
              tipe,
              nominal: toNumber(t.nominal),
              tanggal: tanggal || '', // wajib untuk grouping
              keterangan: String(t.keterangan ?? ''),
              kategori: String(t.kategori ?? ''),
            }
          })
          .filter((t) => !!t.tanggal) // buang yang tanggal kosong biar grouping aman
          .sort((a, b) => a.tanggal.localeCompare(b.tanggal))

        setTransactions(mapped)

        // default pilih bulan: bulan terbaru yang ada data (kalau kosong fallback current)
        setSelectedMonth(latestMonthFromTx(mapped))
      } catch (e: any) {
        console.error('Error fetching keuangan:', e)
        setTransactions([])
        setErrorMsg(e?.message || 'Gagal memuat data keuangan')
        setSelectedMonth(getMonthKey(new Date()))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const monthOptions = useMemo(() => buildMonthOptions(transactions), [transactions])

  const activeMonth = useMemo(() => {
    if (selectedMonth) return selectedMonth
    return latestMonthFromTx(transactions)
  }, [selectedMonth, transactions])

  // Saldo total ALL TIME (transparansi kas total)
  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.tipe === 'Pemasukan') return acc + t.nominal
      return acc - t.nominal
    }, 0)
  }, [transactions])

  // Pemasukan/Pengeluaran bulan terpilih
  const monthlyIn = useMemo(() => {
    return transactions
      .filter((t) => t.tipe === 'Pemasukan' && monthKey(t.tanggal) === activeMonth)
      .reduce((acc, t) => acc + t.nominal, 0)
  }, [transactions, activeMonth])

  const monthlyOut = useMemo(() => {
    return transactions
      .filter((t) => t.tipe === 'Pengeluaran' && monthKey(t.tanggal) === activeMonth)
      .reduce((acc, t) => acc + t.nominal, 0)
  }, [transactions, activeMonth])

  // Grafik 6 bulan berakhir di bulan terpilih
  const financeHistory = useMemo<HistoryPoint[]>(() => {
    const months: string[] = []
    for (let i = 5; i >= 0; i--) {
      months.push(addMonths(activeMonth, -i))
    }

    const bucket = new Map<string, { masuk: number; keluar: number }>()
    months.forEach((m) => bucket.set(m, { masuk: 0, keluar: 0 }))

    for (const t of transactions) {
      const mk = monthKey(t.tanggal)
      if (!bucket.has(mk)) continue
      const cur = bucket.get(mk)!
      if (t.tipe === 'Pemasukan') cur.masuk += t.nominal
      if (t.tipe === 'Pengeluaran') cur.keluar += t.nominal
    }

    return months.map((m) => ({
      month: monthLabelShortID(m),
      masuk: bucket.get(m)!.masuk,
      keluar: bucket.get(m)!.keluar,
    }))
  }, [transactions, activeMonth])

  const isEmpty = transactions.length === 0

  const tooltipFormatter: TooltipProps<number, string>['formatter'] = (value, name) => {
    const label = name === 'masuk' ? 'Pemasukan' : name === 'keluar' ? 'Pengeluaran' : String(name || '')
    return [formatIDRFullPlain(Number(value || 0)), label]
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
    <div className="py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Transparansi Keuangan</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ringkasan arus kas ditampilkan secara terbuka untuk transparansi dana warga.
          </p>
        </div>

        {/* Month selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <span className="material-symbols-outlined text-slate-500">calendar_month</span>
            <select
              value={activeMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-extrabold text-slate-800"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {monthLabelLongID(m)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-indigo-700 p-8 rounded-[2.5rem] text-white">
            <p className="text-xs font-bold uppercase opacity-80 mb-2">Total Kas (All Time)</p>
            <h2 className="text-4xl font-extrabold">{formatCurrencyFull(totalBalance)}</h2>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <p className="text-xs font-bold uppercase opacity-60 mb-2">
              Pemasukan ({monthLabelShortID(activeMonth)})
            </p>
            <h2 className="text-4xl font-extrabold">{formatCurrencyFull(monthlyIn)}</h2>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
            <p className="text-xs font-bold uppercase text-slate-400 mb-2">
              Pengeluaran ({monthLabelShortID(activeMonth)})
            </p>
            <h2 className="text-4xl font-extrabold text-slate-900">{formatCurrencyFull(monthlyOut)}</h2>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Grafik Arus Kas</h3>
              <p className="text-sm text-slate-500 font-bold mt-1">
                6 bulan berakhir di <span className="text-slate-700">{monthLabelLongID(activeMonth)}</span>
              </p>
            </div>

            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Masuk & Keluar per bulan
            </div>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => formatIDRAdaptive(Number(v || 0))} />
                <Tooltip formatter={tooltipFormatter} />

                <Area type="monotone" dataKey="masuk" stroke="#4f46e5" fill="#c7d2fe" />
                <Area
                  type="monotone"
                  dataKey="keluar"
                  stroke="#ef4444"
                  fill="transparent"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {isEmpty && (
            <div className="mt-6 text-center text-sm text-slate-500">
              Grafik menampilkan nilai 0 karena transaksi masih kosong.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicKeuangan
