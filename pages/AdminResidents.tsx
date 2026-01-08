import React, { useEffect, useMemo, useState } from 'react'
import { fetchAllWarga, createWarga, updateWarga, deleteWarga } from '../services/api'

/* ===================== TYPES ===================== */

type ApiListResponse<T> = T[] | { success?: boolean; data?: T[] }

type WargaApi = {
  id: number
  nama_lengkap?: string
  jenis_kelamin?: 'L' | 'P'
  tanggal_lahir?: string | null
  status_warga?: string
  alamat_lengkap?: string

  // tambahan sesuai DB baru
  no_kk?: string | null
  nik?: string | null
}

type Resident = {
  id: number
  nama_lengkap: string
  no_kk: string | null
  nik: string | null
  tgl_lahir: string | null
  usia: number | null
  jenis_kelamin: 'L' | 'P'
  status: string
  jml: number
  notes: string
}

/* ===================== HELPERS ===================== */

const normalizeList = <T,>(res: ApiListResponse<T> | unknown): T[] => {
  if (Array.isArray(res)) return res
  if (res && typeof res === 'object' && Array.isArray((res as any).data)) {
    return (res as any).data
  }
  return []
}

const toISODate = (input?: string | null): string | null => {
  if (!input) return null
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().split('T')[0]
}

const calcAge = (input?: string | null): number | null => {
  if (!input) return null
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return null
  const diff = Date.now() - d.getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

const cleanDigits = (s: string) => s.replace(/[^\d]/g, '')

const normalizeIdNumber = (v: string): string => {
  // hanya digit, max 16 (format KK/NIK umumnya 16)
  const digits = cleanDigits(v || '')
  return digits.slice(0, 16)
}

const displayId = (v: string | null | undefined) => {
  const s = String(v ?? '').trim()
  return s ? s : '-'
}

/* ===================== COMPONENT ===================== */

const AdminResidents: React.FC = () => {
  const defaultForm = {
    dukuh: 'Dukuhan Nayu',
    rt: '01',
    rw: '21',
    nama_lengkap: '',
    no_kk: '', // baru
    nik: '', // baru
    tgl_lahir: '',
    usia: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    status: 'KK',
    jml: '1',
    notes: '',
  }

  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState(defaultForm)

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  /* ===================== LOAD DATA ===================== */

  const loadResidents = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetchAllWarga()
      const list = normalizeList<WargaApi>(res)

      const mapped: Resident[] = list.map((d) => ({
        id: d.id,
        nama_lengkap: String(d.nama_lengkap ?? '-').trim(),
        no_kk: (d.no_kk ?? null) ? String(d.no_kk).trim() : null,
        nik: (d.nik ?? null) ? String(d.nik).trim() : null,
        tgl_lahir: toISODate(d.tanggal_lahir ?? null),
        usia: calcAge(d.tanggal_lahir ?? null),
        jenis_kelamin: (d.jenis_kelamin ?? 'L') as 'L' | 'P',
        status: String(d.status_warga ?? 'KK'),
        jml: 1,
        notes: String(d.alamat_lengkap ?? '').trim(),
      }))

      setResidents(mapped)
      setCurrentPage(1)
    } catch (err: any) {
      setResidents([])
      setErrorMsg(err?.message || 'Gagal memuat data warga')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResidents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ===================== FILTER & PAGINATION ===================== */

const filteredResidents = useMemo(() => {
  const q = search.toLowerCase().trim()
  if (!q) return residents

  return residents.filter((r) => {
    const nameMatch = r.nama_lengkap.toLowerCase().includes(q)
    const kkMatch = (r.no_kk ?? '').includes(q)
    const nikMatch = (r.nik ?? '').includes(q)
    return nameMatch || kkMatch || nikMatch
  })
}, [residents, search])


  const paginatedResidents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredResidents.slice(start, start + pageSize)
  }, [filteredResidents, currentPage])

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredResidents.length / pageSize))
    if (currentPage > maxPage) setCurrentPage(maxPage)
  }, [filteredResidents.length, currentPage])

  const canPrev = currentPage > 1
  const canNext = currentPage * pageSize < filteredResidents.length

  /* ===================== ACTIONS ===================== */

  const openAdd = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setIsAdding(true)
  }

  const handleEdit = (r: Resident) => {
    setEditingId(r.id)
    setFormData({
      ...defaultForm,
      nama_lengkap: r.nama_lengkap,
      no_kk: r.no_kk ?? '',
      nik: r.nik ?? '',
      tgl_lahir: r.tgl_lahir ?? '',
      usia: r.usia != null ? String(r.usia) : '',
      jenis_kelamin: r.jenis_kelamin,
      status: r.status,
      jml: String(r.jml),
      notes: r.notes,
    })
    setIsAdding(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    // normalisasi input KK/NIK (opsional)
    const no_kk = formData.no_kk ? normalizeIdNumber(formData.no_kk) : ''
    const nik = formData.nik ? normalizeIdNumber(formData.nik) : ''

    const payload = {
      nama_lengkap: formData.nama_lengkap.trim(),
      jenis_kelamin: formData.jenis_kelamin,
      kategori_warga: 'Warga Tetap',
      dusun: formData.dukuh,
      rw: formData.rw,
      rt: formData.rt,
      status_warga: formData.status,
      tanggal_lahir: formData.tgl_lahir || null,
      agama: 'Islam',
      pekerjaan: 'Warga',
      alamat_lengkap: formData.notes || '',

      // field baru sesuai DB
      no_kk: no_kk || null,
      nik: nik || null,
    }

    try {
      if (editingId) {
        await updateWarga(String(editingId), payload)
      } else {
        await createWarga(payload)
      }

      await loadResidents()
      setIsAdding(false)
      setEditingId(null)
      setFormData(defaultForm)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menyimpan data warga')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data warga ini?')) return
    setErrorMsg(null)
    try {
      await deleteWarga(String(id))
      setResidents((prev) => prev.filter((r) => r.id !== id))
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menghapus data')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Database Kependudukan</h1>
          <p className="text-sm text-slate-500 font-medium">Data Terpadu Warga Desa Banjarsari</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadResidents}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl text-sm hover:bg-slate-50 transition-all"
          >
            Refresh
          </button>

          <button
            onClick={openAdd}
            className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl text-sm hover:bg-indigo-800"
          >
            Daftar Warga Baru
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">{errorMsg}</div>
      )}

      {/* ===================== MODAL ===================== */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-slate-900">{editingId ? 'Edit Data Warga' : 'Tambah Warga'}</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    required
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value.toUpperCase() })}
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                    placeholder="NAMA LENGKAP"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      No KK (opsional)
                    </label>
                    <input
                      value={formData.no_kk}
                      onChange={(e) => setFormData({ ...formData, no_kk: normalizeIdNumber(e.target.value) })}
                      inputMode="numeric"
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                      placeholder="16 digit"
                      maxLength={16}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                      NIK (opsional)
                    </label>
                    <input
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: normalizeIdNumber(e.target.value) })}
                      inputMode="numeric"
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                      placeholder="16 digit"
                      maxLength={16}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Tgl Lahir
                  </label>
                  <input
                    value={formData.tgl_lahir}
                    onChange={(e) => setFormData({ ...formData, tgl_lahir: e.target.value })}
                    type="date"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Usia (opsional)
                  </label>
                  <input
                    value={formData.usia}
                    onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
                    type="number"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                    placeholder="Tidak disimpan ke DB"
                    min={0}
                    max={150}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Jenis Kelamin
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, jenis_kelamin: 'L' })}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm ${
                        formData.jenis_kelamin === 'L'
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      Laki-laki
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, jenis_kelamin: 'P' })}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm ${
                        formData.jenis_kelamin === 'P'
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      Perempuan
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                  >
                    <option value="KK">KK</option>
                    <option value="ISTRI">ISTRI</option>
                    <option value="ANAK">ANAK</option>
                    <option value="FAMILI LAIN">FAMILI LAIN</option>
                    <option value="ORANG TUA">ORANG TUA</option>
                    <option value="K">K</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Alamat / Notes
                  </label>
                  <input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50"
                    placeholder="Alamat lengkap / catatan"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 text-slate-500 font-black uppercase text-xs"
                  >
                    Batal
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-indigo-700 text-white font-black rounded-2xl hover:bg-indigo-800">
                    {editingId ? 'Update Data' : 'Simpan Data'}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Catatan: No KK dan NIK bersifat opsional. Jika kosong, akan tersimpan sebagai <b>NULL</b>.
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== TABLE ===================== */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4">
          <input
            type="text"
            placeholder="Cari nama / KK / NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Nama Lengkap</th>
                <th className="px-8 py-5">No KK</th>
                <th className="px-8 py-5">NIK</th>
                <th className="px-8 py-5">Tgl Lahir</th>
                <th className="px-8 py-5">Usia</th>
                <th className="px-8 py-5">Jenis Kelamin</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Alamat</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedResidents.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 uppercase tracking-tight">{res.nama_lengkap}</p>
                  </td>

                  <td className="px-8 py-6 font-mono font-bold text-slate-700">{displayId(res.no_kk)}</td>
                  <td className="px-8 py-6 font-mono font-bold text-slate-700">{displayId(res.nik)}</td>

                  <td className="px-8 py-6 font-bold text-slate-600">{res.tgl_lahir ?? '-'}</td>
                  <td className="px-8 py-6 font-bold text-slate-600">{res.usia ?? '-'}</td>

                  <td className="px-8 py-6 font-bold text-slate-600">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] border ${
                        res.jenis_kelamin === 'L'
                          ? 'border-blue-100 text-blue-600 bg-blue-50'
                          : 'border-pink-100 text-pink-600 bg-pink-50'
                      }`}
                    >
                      {res.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                      {res.status}
                    </span>
                  </td>

                  <td className="px-8 py-6 font-bold text-slate-600">{res.notes || '-'}</td>

                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(res)}
                        className="h-10 px-4 flex items-center justify-center bg-slate-50 text-slate-600 hover:text-indigo-700 rounded-xl font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="h-10 px-4 flex items-center justify-center bg-slate-50 text-slate-600 hover:text-red-600 rounded-xl font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredResidents.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-8 py-10 text-center text-slate-500 font-semibold">
                    Data warga belum tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
            className="px-4 py-2 bg-indigo-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm font-bold text-slate-700">Page {currentPage}</span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={!canNext}
            className="px-4 py-2 bg-indigo-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminResidents
