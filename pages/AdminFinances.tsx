import React, { useEffect, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import {
  fetchAllKeuangan,
  createKeuangan,
  updateKeuangan,
  deleteKeuangan,
} from '../services/api'

type ApiListResponse<T> =
  | T[]
  | { success?: boolean; data?: T[]; message?: string; error?: string }

type KeuanganApi = {
  id: number
  tipe?: 'Pemasukan' | 'Pengeluaran' | string
  nominal?: number | string | null
  keterangan?: string | null
  kategori?: string | null
  tanggal?: string | null
  created_at?: string | null
  [key: string]: unknown
}

type Transaction = {
  id: number
  tipe: 'Pemasukan' | 'Pengeluaran'
  nominal: number
  keterangan: string
  kategori: string
  tanggal: string // YYYY-MM-DD
}

const normalizeList = <T,>(res: ApiListResponse<T> | unknown): T[] => {
  if (Array.isArray(res)) return res as T[]
  if (res && typeof res === 'object') {
    const obj = res as { data?: unknown }
    if (Array.isArray(obj.data)) return obj.data as T[]
  }
  return []
}

const pad2 = (n: number) => String(n).padStart(2, '0')
const getMonthKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`
const monthLabel = (monthKey: string) => {
  const [y, m] = monthKey.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
}

const toISODateOnly = (isoLike: any) => {
  if (!isoLike) return ''
  const s = String(isoLike)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const d = new Date(s)
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return ''
}

const toInputDate = (iso?: string | null) => {
  if (!iso) return new Date().toISOString().slice(0, 10)
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10)
  return d.toISOString().slice(0, 10)
}

const toNumber = (v: unknown) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const n = Number(v.replace(/[^\d.-]/g, ''))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

const formatCurrency = (amount: number) => `Rp ${Math.round(amount).toLocaleString('id-ID')}`

const COLORS = ['#2563eb', '#6366f1', '#10b981', '#f59e0b']

const buildMonthOptions = (list: Transaction[]) => {
  const set = new Set<string>()
  list.forEach((t) => set.add(t.tanggal.slice(0, 7)))
  const nowKey = getMonthKey(new Date())
  set.add(nowKey)
  set.add(getMonthKey(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)))
  return Array.from(set).sort((a, b) => (a < b ? 1 : -1))
}

const AdminFinances: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState('Semua')
  const [filterType, setFilterType] = useState('Semua')
  const [filterMonth, setFilterMonth] = useState<string>('Semua') // YYYY-MM or Semua

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    tipe: 'Pemasukan' as 'Pemasukan' | 'Pengeluaran',
    nominal: '',
    keterangan: '',
    kategori: 'Iuran',
    tanggal: new Date().toISOString().slice(0, 10),
  })

  const formatNumberInput = (rawNumeric: string) => {
    const numericValue = rawNumeric.replace(/\D/g, '')
    return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : ''
  }

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    setFormData((p) => ({ ...p, nominal: raw }))
  }

  const loadData = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = (await fetchAllKeuangan()) as unknown
      const list = normalizeList<KeuanganApi>(res)

      const mapped: Transaction[] = list
        .slice()
        .sort((a, b) => Number(b.id) - Number(a.id))
        .map((k) => {
          const tanggal = toISODateOnly(k.tanggal ?? k.created_at) || toInputDate(k.tanggal ?? null)
          return {
            id: Number(k.id),
            tipe: (String(k.tipe).toLowerCase().includes('pengeluaran') ? 'Pengeluaran' : 'Pemasukan') as
              | 'Pemasukan'
              | 'Pengeluaran',
            nominal: toNumber(k.nominal),
            keterangan: String(k.keterangan ?? '').trim(),
            kategori: String(k.kategori ?? 'Iuran').trim() || 'Iuran',
            tanggal: tanggal,
          }
        })

      setTransactions(mapped)

      // default filterMonth: bulan terbaru dari data (kalau ada)
      if (mapped.length) {
        const latest = mapped.reduce((max, t) => (t.tanggal > max ? t.tanggal : max), mapped[0].tanggal)
        setFilterMonth(latest.slice(0, 7))
      } else {
        setFilterMonth('Semua')
      }
    } catch (err: any) {
      console.error('Error fetching keuangan:', err)
      setTransactions([])
      setErrorMsg(err?.message || 'Gagal memuat data keuangan')
      setFilterMonth('Semua')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const monthOptions = useMemo(() => buildMonthOptions(transactions), [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const typeMatch = filterType === 'Semua' || t.tipe === filterType
      const catMatch = filterCategory === 'Semua' || t.kategori === filterCategory
      const monthMatch = filterMonth === 'Semua' || t.tanggal.startsWith(filterMonth)
      return typeMatch && catMatch && monthMatch
    })
  }, [transactions, filterCategory, filterType, filterMonth])

  const totalBalance = useMemo(() => {
    // saldo total ALL TIME (bukan hanya bulan terpilih)
    return transactions.reduce((acc, t) => {
      if (t.tipe === 'Pemasukan') return acc + t.nominal
      return acc - t.nominal
    }, 0)
  }, [transactions])

  const activeMonth = useMemo(() => {
    if (filterMonth !== 'Semua') return filterMonth
    return getMonthKey(new Date())
  }, [filterMonth])

  const monthlyIn = useMemo(() => {
    return transactions
      .filter((t) => t.tipe === 'Pemasukan' && t.tanggal.startsWith(activeMonth))
      .reduce((acc, t) => acc + t.nominal, 0)
  }, [transactions, activeMonth])

  const monthlyOut = useMemo(() => {
    return transactions
      .filter((t) => t.tipe === 'Pengeluaran' && t.tanggal.startsWith(activeMonth))
      .reduce((acc, t) => acc + t.nominal, 0)
  }, [transactions, activeMonth])

  const pieData = useMemo(() => {
    const totals: Record<string, number> = {}
    transactions
      .filter((t) => t.tipe === 'Pengeluaran' && (filterMonth === 'Semua' || t.tanggal.startsWith(filterMonth)))
      .forEach((t) => {
        totals[t.kategori] = (totals[t.kategori] || 0) + t.nominal
      })
    return Object.entries(totals).map(([name, value]) => ({ name, value }))
  }, [transactions, filterMonth])

  const handleEdit = (trx: Transaction) => {
    setFormData({
      tipe: trx.tipe,
      nominal: String(Math.max(0, Math.floor(trx.nominal || 0))),
      keterangan: trx.keterangan || '',
      kategori: trx.kategori || 'Iuran',
      tanggal: trx.tanggal,
    })
    setEditingId(trx.id)
    setIsAdding(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      tipe: 'Pemasukan',
      nominal: '',
      keterangan: '',
      kategori: 'Iuran',
      tanggal: new Date().toISOString().slice(0, 10),
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    try {
      const payload = {
        tipe: formData.tipe,
        nominal: Number(formData.nominal || 0),
        keterangan: formData.keterangan,
        kategori: formData.kategori,
        tanggal: formData.tanggal,
      }

      if (editingId) {
        await updateKeuangan(String(editingId), payload)
        setTransactions((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, ...payload } : t)),
        )
      } else {
        const result = await createKeuangan(payload)
        const newId = Number((result as any)?.data?.id || (result as any)?.id || Date.now())
        setTransactions((prev) => [{ id: newId, ...payload }, ...prev])
      }

      setIsAdding(false)
      resetForm()
      // optional: refresh agar sinkron penuh dengan DB
      // await loadData()
    } catch (err: any) {
      console.error('Error saving transaction:', err)
      setErrorMsg(err?.message || 'Gagal menyimpan transaksi')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return
    setErrorMsg(null)

    try {
      await deleteKeuangan(String(id))
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err: any) {
      console.error('Error deleting transaction:', err)
      setErrorMsg(err?.message || 'Gagal menghapus transaksi')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Keuangan</h1>
          <p className="text-sm text-slate-500">Transparansi arus kas dan audit dana warga.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>

          <button
            onClick={() => {
              setIsAdding(true)
              resetForm()
            }}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span> Input Transaksi
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Bulan</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 focus:ring-blue-200 w-56"
            >
              <option value="Semua">Semua</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tipe</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 focus:ring-blue-200 w-40"
            >
              <option>Semua</option>
              <option>Pemasukan</option>
              <option>Pengeluaran</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Kategori</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 focus:ring-blue-200 w-56"
            >
              <option>Semua</option>
              <option>Iuran</option>
              <option>Infrastruktur</option>
              <option>Donasi</option>
              <option>Operasional</option>
            </select>
          </div>

          <button
            onClick={() => {
              setFilterType('Semua')
              setFilterCategory('Semua')
              setFilterMonth('Semua')
            }}
            className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-all"
          >
            Reset Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Keterangan</th>
                <th className="px-8 py-4">Kategori</th>
                <th className="px-8 py-4">Tipe</th>
                <th className="px-8 py-4 text-right">Nominal</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900">{trx.keterangan || '-'}</p>
                    <p className="text-[10px] text-slate-400">{trx.tanggal}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-semibold text-slate-500">{trx.kategori}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        trx.tipe === 'Pemasukan'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {trx.tipe}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-extrabold text-slate-900">
                    {trx.tipe === 'Pengeluaran' ? '- ' : ''}
                    {formatCurrency(trx.nominal)}
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(trx)}
                      className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(trx.id)}
                      className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p className="text-sm font-bold">Tidak ada data transaksi yang sesuai.</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Saldo Total (All Time)</p>
            <h2 className="text-3xl font-extrabold">{formatCurrency(totalBalance)}</h2>

            <div className="mt-3 text-[10px] font-bold opacity-60">
              Rekap bulan: {filterMonth === 'Semua' ? 'Bulan berjalan' : monthLabel(filterMonth)}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-50">In (Bulan)</p>
                <p className="text-sm font-extrabold text-green-400">+{formatCurrency(monthlyIn)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-50">Out (Bulan)</p>
                <p className="text-sm font-extrabold text-red-400">-{formatCurrency(monthlyOut)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-2">Distribusi Pengeluaran</h3>
            <p className="text-[10px] font-bold text-slate-400 mb-6">
              {filterMonth === 'Semua' ? 'Semua bulan' : monthLabel(filterMonth)}
            </p>

            <div className="h-48">
              {pieData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-bold">
                  Belum ada data pengeluaran.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-900">
                {editingId ? 'Edit Transaksi' : 'Input Transaksi Baru'}
              </h2>
              <button
                onClick={() => {
                  setIsAdding(false)
                  resetForm()
                }}
                className="text-slate-400 hover:text-red-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Tipe Transaksi
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        tipe: e.target.value as 'Pemasukan' | 'Pengeluaran',
                      }))
                    }
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                  >
                    <option>Pemasukan</option>
                    <option>Pengeluaran</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Nominal (Rp)
                  </label>
                  <input
                    required
                    type="text"
                    value={formatNumberInput(formData.nominal)}
                    onChange={handleNominalChange}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                    placeholder="0"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Keterangan
                </label>
                <input
                  required
                  value={formData.keterangan}
                  onChange={(e) => setFormData((p) => ({ ...p, keterangan: e.target.value }))}
                  type="text"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                  placeholder="Contoh: Iuran bulanan warga"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData((p) => ({ ...p, kategori: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                  >
                    <option>Iuran</option>
                    <option>Infrastruktur</option>
                    <option>Donasi</option>
                    <option>Operasional</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Tanggal
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData((p) => ({ ...p, tanggal: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false)
                    resetForm()
                  }}
                  className="flex-1 py-4 text-slate-500 font-black uppercase text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all"
                >
                  {editingId ? 'Update Transaksi' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminFinances
