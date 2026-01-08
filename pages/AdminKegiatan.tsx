import React, { useEffect, useMemo, useRef, useState } from 'react'
import { fetchActivities, createKegiatan, updateKegiatan, deleteKegiatan } from '../services/api'

type ApiListResponse<T> =
  | T[]
  | { success?: boolean; data?: T[]; message?: string; error?: string }

type KegiatanApi = {
  id: number
  judul?: string
  tanggal?: string
  lokasi?: string
  status?: string
  anggaran?: number | string | null
  foto_url?: string | null
  deskripsi?: string | null
  content?: string | null
  urutan_tampil?: number | null
  [key: string]: unknown
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

  anggaranNum: number // selalu angka integer IDR
  fotoUrlRaw: string | null

  order: number
}

type FormState = {
  title: string
  date: string
  loc: string
  budget: string
  status: string
  description: string
  img: string
}

const normalizeList = <T,>(res: ApiListResponse<T> | unknown): T[] => {
  if (Array.isArray(res)) return res as T[]
  if (res && typeof res === 'object') {
    const obj = res as { data?: unknown }
    if (Array.isArray(obj.data)) return obj.data as T[]
  }
  return []
}

const toInputDate = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10)
  return d.toISOString().slice(0, 10)
}

/* =========================
   Rupiah Helpers
   ========================= */

// untuk input form (yang sudah diformat "Rp ...")
const digitsOnly = (s: string) => (s || '').toString().replace(/[^\d]/g, '')

const parseCurrencyToNumberFromInput = (s: string) => {
  const d = digitsOnly(s)
  return d ? Number(d) : 0
}

// ✅ parser untuk data dari API/DB:
// - number: 100000
// - "100000.00"
// - "1.000.000"
// - "Rp 1.000.000"
// - "1,000,000"
// hasil: integer rupiah (dibulatkan)
const parseMoneyFromApi = (v: unknown): number => {
  if (v === null || v === undefined) return 0

  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return 0
    return Math.round(v)
  }

  const s = String(v).trim()
  if (!s || s === '-') return 0

  // buang simbol & spasi, sisakan digit, koma, titik, minus
  let cleaned = s.replace(/[^\d.,-]/g, '')
  if (!cleaned) return 0

  const hasDot = cleaned.includes('.')
  const hasComma = cleaned.includes(',')

  // kasus umum mysql "100000.00" (dot desimal) => aman
  if (hasDot && !hasComma) {
    const n = Number(cleaned)
    return Number.isFinite(n) ? Math.round(n) : 0
  }

  // campuran separator => anggap separator desimal = yang terakhir muncul
  const lastComma = cleaned.lastIndexOf(',')
  const lastDot = cleaned.lastIndexOf('.')
  const lastSep = Math.max(lastComma, lastDot)

  if (lastSep >= 0) {
    const intPart = cleaned.slice(0, lastSep).replace(/[.,]/g, '')
    const decPart = cleaned.slice(lastSep + 1).replace(/[^\d]/g, '')
    const normalized = decPart ? `${intPart}.${decPart}` : intPart
    const n = Number(normalized)
    return Number.isFinite(n) ? Math.round(n) : 0
  }

  const n = Number(cleaned)
  return Number.isFinite(n) ? Math.round(n) : 0
}

const formatRupiahFromNumber = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? Math.round(n) : 0)

// caret helpers
const getDigitsCountBeforeCaret = (value: string, caretPos: number) => {
  const left = value.slice(0, caretPos)
  return (left.match(/\d/g) || []).length
}
const findCaretPosForDigitsCount = (formatted: string, digitsCount: number) => {
  if (digitsCount <= 0) {
    const idx = formatted.indexOf('Rp')
    return idx >= 0 ? Math.min(formatted.length, idx + 3) : 0
  }
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) count++
    if (count >= digitsCount) return i + 1
  }
  return formatted.length
}
const formatBudgetInput = (rawValue: string, inputEl: HTMLInputElement | null): string => {
  const d = digitsOnly(rawValue)

  // kosong biar enak hapus
  if (!d) return ''

  const n = Number(d)
  const formatted = formatRupiahFromNumber(n)

  if (inputEl) {
    const prevCaret = inputEl.selectionStart ?? rawValue.length
    const digitsBefore = getDigitsCountBeforeCaret(rawValue, prevCaret)
    queueMicrotask(() => {
      try {
        const pos = findCaretPosForDigitsCount(formatted, digitsBefore)
        inputEl.setSelectionRange(pos, pos)
      } catch {}
    })
  }
  return formatted
}

/* =========================
   URL Helper
   ========================= */

const buildImageUrl = (origin: string, fotoUrl?: string | null) => {
  if (!fotoUrl) return ''
  if (/^https?:\/\//i.test(fotoUrl)) return encodeURI(fotoUrl)
  const cleanOrigin = String(origin || '').replace(/\/+$/, '')
  const path = fotoUrl.startsWith('/') ? fotoUrl : `/${fotoUrl}`
  return encodeURI(`${cleanOrigin}${path}`)
}

const mapApiToActivity = (origin: string, k: KegiatanApi, fallbackOrder: number): Activity => {
  const anggaranNum = parseMoneyFromApi(k.anggaran)

  const fotoUrlRaw = (k.foto_url ?? null) as string | null

  const order =
    typeof k.urutan_tampil === 'number' && Number.isFinite(k.urutan_tampil)
      ? Number(k.urutan_tampil)
      : fallbackOrder

  return {
    id: Number(k.id),
    title: String(k.judul ?? '').trim() || '-',
    date: toInputDate(k.tanggal),
    loc: String(k.lokasi ?? '').trim() || '-',
    status: String(k.status ?? 'Rencana'),
    // ✅ tampilkan Rp 0 kalau 0 (bukan kosong)
    budget: formatRupiahFromNumber(anggaranNum),
    img: buildImageUrl(origin, fotoUrlRaw),
    description: String(k.deskripsi ?? k.content ?? '').trim(),

    anggaranNum,
    fotoUrlRaw,
    order,
  }
}

const AdminKegiatan: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [currentFotoUrlRaw, setCurrentFotoUrlRaw] = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    title: '',
    date: '',
    loc: '',
    budget: '',
    status: 'Rencana',
    description: '',
    img: '',
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const budgetInputRef = useRef<HTMLInputElement>(null)

  const PUBLIC_ORIGIN =
    (import.meta as any).env?.VITE_PUBLIC_BASE_URL ||
    (import.meta as any).env?.VITE_BASE_URL ||
    window.location.origin

  const API_ORIGIN =
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (import.meta as any).env?.VITE_BASE_API_URL ||
    window.location.origin

  const loadData = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = (await fetchActivities()) as unknown
      const list = normalizeList<KegiatanApi>(res)

      const mapped = list.map((k, idx) => mapApiToActivity(PUBLIC_ORIGIN, k, idx + 1))
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

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setForm({
      title: '',
      date: '',
      loc: '',
      budget: '',
      status: 'Rencana',
      description: '',
      img: '',
    })
    setSelectedFile(null)
    setCurrentFotoUrlRaw(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    resetForm()
  }

  const handleEdit = (act: Activity) => {
    setIsAdding(true)
    setEditingId(act.id)
    setCurrentFotoUrlRaw(act.fotoUrlRaw)

    // ✅ kalau Rp 0, biarkan input tetap Rp 0 (biar jelas)
    setForm({
      title: act.title === '-' ? '' : act.title,
      date: act.date || '',
      loc: act.loc === '-' ? '' : act.loc,
      budget: formatRupiahFromNumber(act.anggaranNum),
      status: act.status || 'Rencana',
      description: act.description || '',
      img: act.img || '',
    })

    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    const preview = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, img: preview }))
  }

  const uploadImage = async () => {
    if (!selectedFile) return ''

    const fd = new FormData()
    fd.append('image', selectedFile)

    const uploadUrl = `${String(API_ORIGIN).replace(/\/$/, '')}/api/upload/kegiatan`
    const resp = await fetch(uploadUrl, { method: 'POST', body: fd })
    if (!resp.ok) throw new Error(`Upload gagal (${resp.status})`)

    const json = await resp.json()

    const imagePath = json?.data?.imagePath || json?.imagePath || ''
    if (imagePath) return String(imagePath)

    const imageUrl = json?.data?.imageUrl || json?.imageUrl || json?.data?.url || json?.url || ''
    if (imageUrl) return String(imageUrl)

    throw new Error('Response upload tidak berisi imagePath/imageUrl')
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const formatted = formatBudgetInput(raw, budgetInputRef.current)
    setForm((prev) => ({ ...prev, budget: formatted }))
  }

  const handleSave = async () => {
    setErrorMsg(null)
    try {
      let fotoUrlToSave: string | null = currentFotoUrlRaw
      if (selectedFile) fotoUrlToSave = await uploadImage()

      // ✅ parse dari input: aman karena form sudah jadi "Rp 1.000.000"
      const anggaranNum = Math.round(parseCurrencyToNumberFromInput(form.budget))

      const maxOrder = activities.length > 0 ? Math.max(...activities.map((a) => a.order || 0)) : 0
      const currentOrder =
        editingId != null
          ? activities.find((a) => a.id === editingId)?.order ?? maxOrder + 1
          : maxOrder + 1

      const payload: any = {
        judul: form.title.trim(),
        tanggal: form.date || null,
        lokasi: form.loc.trim(),
        status: form.status,
        anggaran: anggaranNum, // ✅ integer rupiah (tanpa .00)
        foto_url: fotoUrlToSave || null,
        deskripsi: form.description || '',
        urutan_tampil: currentOrder,
      }

      if (editingId != null) {
        await updateKegiatan(String(editingId), payload)
        await loadData()
      } else {
        const result = await createKegiatan(payload)
        const newId = Number((result as any)?.data?.id || (result as any)?.id || Date.now())

        const newItem: Activity = {
          id: newId,
          title: form.title.trim() || '-',
          date: form.date,
          loc: form.loc.trim() || '-',
          status: form.status,
          budget: formatRupiahFromNumber(anggaranNum),
          img: fotoUrlToSave ? buildImageUrl(PUBLIC_ORIGIN, fotoUrlToSave) : '',
          description: form.description || '',
          anggaranNum,
          fotoUrlRaw: fotoUrlToSave,
          order: currentOrder,
        }

        const next = [newItem, ...activities]
          .slice()
          .sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999))
        setActivities(next)
      }

      setIsAdding(false)
      setEditingId(null)
      resetForm()
    } catch (err: any) {
      console.error('Error saving activity:', err)
      setErrorMsg(err?.message || 'Gagal menyimpan kegiatan')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return
    setErrorMsg(null)
    try {
      await deleteKegiatan(String(id))
      setActivities((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) {
      console.error('Error deleting activity:', err)
      setErrorMsg(err?.message || 'Gagal menghapus kegiatan')
    }
  }

  const moveActivity = async (id: number, direction: 'up' | 'down') => {
    const idx = activities.findIndex((a) => a.id === id)
    if (idx === -1) return

    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= activities.length) return

    const a = activities[idx]
    const b = activities[newIdx]

    try {
      await Promise.all([
        updateKegiatan(String(a.id), {
          judul: a.title === '-' ? '' : a.title,
          tanggal: a.date || null,
          lokasi: a.loc === '-' ? '' : a.loc,
          status: a.status,
          anggaran: a.anggaranNum,
          foto_url: a.fotoUrlRaw || null,
          deskripsi: a.description || '',
          urutan_tampil: b.order,
        }),
        updateKegiatan(String(b.id), {
          judul: b.title === '-' ? '' : b.title,
          tanggal: b.date || null,
          lokasi: b.loc === '-' ? '' : b.loc,
          status: b.status,
          anggaran: b.anggaranNum,
          foto_url: b.fotoUrlRaw || null,
          deskripsi: b.description || '',
          urutan_tampil: a.order,
        }),
      ])

      const next = activities.slice()
      ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]

      // reindex posisi jadi 1..n supaya rapi & stabil
      const normalized = next.map((x, i) => ({ ...x, order: i + 1 }))
      setActivities(normalized)
    } catch (err) {
      console.error('Error updating order:', err)
      setErrorMsg('Gagal mengubah urutan tampil kegiatan')
    }
  }

  const sortedActivities = useMemo(
    () => activities.slice().sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999)),
    [activities],
  )

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manajemen Kabar & Kegiatan</h1>
          <p className="text-sm text-slate-500 font-medium">Urutan tampil bisa diatur dengan tombol naik/turun.</p>
        </div>

        {!isAdding && (
          <div className="flex gap-3">
            <button
              onClick={loadData}
              className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>

            <button
              onClick={openAdd}
              className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 hover:bg-indigo-800 shadow-xl shadow-indigo-100 transition-all"
            >
              <span className="material-symbols-outlined">add_task</span>
              Input Kabar Desa Baru
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">{errorMsg}</div>
      )}

      {isAdding && (
        <div className="bg-white rounded-[2.5rem] border-2 border-indigo-100 p-10 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black">{editingId ? 'Edit Kabar Desa' : 'Tulis Kabar Desa Baru'}</h2>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500 transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Judul Berita/Kegiatan
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  type="text"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                  placeholder="Contoh: Peresmian Jembatan Desa..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Tanggal
                  </label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    type="date"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                  >
                    <option>Rencana</option>
                    <option>Proses</option>
                    <option>Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Lokasi
                  </label>
                  <input
                    value={form.loc}
                    onChange={(e) => setForm({ ...form, loc: e.target.value })}
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                    placeholder="Dusun/Wilayah"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Anggaran
                  </label>
                  <input
                    ref={budgetInputRef}
                    value={form.budget}
                    onChange={handleBudgetChange}
                    inputMode="numeric"
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold"
                    placeholder="Rp 10.000.000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Isi Berita / Laporan Lengkap
                </label>
                <textarea
                  rows={8}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium leading-relaxed"
                  placeholder="Tuliskan detail kegiatan..."
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Gambar Kegiatan
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium"
                />

                {form.img && (
                  <div className="mt-3">
                    <img
                      src={form.img}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-2xl border border-slate-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs">
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-indigo-700 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-800 transition-all"
                >
                  {editingId ? 'Update Kabar' : 'Simpan Kabar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sortedActivities.map((act, idx) => (
          <div
            key={act.id}
            className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:shadow-xl transition-all duration-500"
          >
            <div className="sm:w-48 aspect-video sm:aspect-square shrink-0 relative overflow-hidden bg-slate-100">
              {act.img ? (
                <img
                  src={act.img}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={act.title}
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

              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => moveActivity(act.id, 'up')}
                  disabled={idx === 0}
                  className="h-10 w-10 bg-white rounded-xl text-slate-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Naik"
                >
                  <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                </button>

                <button
                  onClick={() => handleEdit(act)}
                  className="h-10 w-10 bg-white rounded-xl text-indigo-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>

                <button
                  onClick={() => handleDelete(act.id)}
                  className="h-10 w-10 bg-white rounded-xl text-red-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                  title="Hapus"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>

                <button
                  onClick={() => moveActivity(act.id, 'down')}
                  disabled={idx === sortedActivities.length - 1}
                  className="h-10 w-10 bg-white rounded-xl text-slate-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Turun"
                >
                  <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                </button>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      act.status === 'Selesai'
                        ? 'bg-green-100 text-green-700'
                        : act.status === 'Proses'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {act.status}
                  </span>

                  <span className="text-[10px] font-black text-indigo-600">{act.budget}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 line-clamp-1">{act.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">{act.description}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400">{act.date || '-'}</span>

                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-black text-slate-300">#{act.order}</span>

                  <button
                    onClick={() => handleEdit(act)}
                    className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(act.id)}
                    className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 transition-all"
                    title="Hapus"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && <div className="text-center text-slate-500 font-medium py-10">Belum ada kegiatan.</div>}
    </div>
  )
}

export default AdminKegiatan
