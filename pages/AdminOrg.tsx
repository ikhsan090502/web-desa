import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchKepengurusan,
  createKepengurusan,
  updateKepengurusan,
  deleteKepengurusan,
  uploadPengurusImage,
} from '../services/api'

type ApiListResponse<T> = T[] | { success?: boolean; data?: T[]; message?: string; error?: string }

type PengurusApi = {
  id: number
  nama_lengkap?: string
  gelar?: string | null
  jabatan?: string
  masa_jabatan?: string | null
  foto_url?: string | null
  urutan_tampil?: number | null
  is_aktif?: number | null
  [key: string]: unknown
}

type Member = {
  id: number
  name: string
  degree: string
  role: string
  period: string
  img: string // URL final untuk render
  fotoPath: string | null // nilai asli dari DB (path/URL), supaya saat save tidak hilang
  order: number
  isActive: boolean
}

const normalizeList = <T,>(res: ApiListResponse<T> | unknown): T[] => {
  if (Array.isArray(res)) return res as T[]
  if (res && typeof res === 'object') {
    const obj = res as { data?: unknown }
    if (Array.isArray(obj.data)) return obj.data as T[]
  }
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

const AdminOrg: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    degree: '',
    role: '',
    period: '',
    img: '', // simpan path/URL untuk DB (bukan final URL), contoh: "/pengurus/a.jpg"
    isActive: true,
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ORIGIN =
    (import.meta as any).env?.VITE_PUBLIC_BASE_URL ||
    (import.meta as any).env?.VITE_BASE_URL ||
    window.location.origin

  const loadData = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = (await fetchKepengurusan()) as unknown
      const list = normalizeList<PengurusApi>(res)

      const mapped: Member[] = list
        .slice()
        .sort((a, b) => Number(a.urutan_tampil ?? 9999) - Number(b.urutan_tampil ?? 9999))
        .map((p, idx) => {
          const fotoPath = (p.foto_url ?? null) as string | null
          return {
            id: Number(p.id),
            name: String(p.nama_lengkap ?? '').trim() || '-',
            degree: String(p.gelar ?? '').trim(),
            role: String(p.jabatan ?? '').trim() || '-',
            period: String(p.masa_jabatan ?? '').trim() || '-',
            img: buildImageUrl(ORIGIN, fotoPath),
            fotoPath,
            order: Number(p.urutan_tampil ?? idx + 1),
            isActive: typeof p.is_aktif === 'number' ? p.is_aktif === 1 : true,
          }
        })

      setMembers(mapped)
    } catch (err: any) {
      console.error('Error fetching kepengurusan:', err)
      setMembers([])
      setErrorMsg(err?.message || 'Gagal memuat data kepengurusan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', degree: '', role: '', period: '', img: '', isActive: true })
    setIsEditing(true)
  }

  const handleEdit = (member: Member) => {
    setForm({
      name: member.name === '-' ? '' : member.name,
      degree: member.degree || '',
      role: member.role === '-' ? '' : member.role,
      period: member.period === '-' ? '' : member.period,
      // penting: simpan nilai DB-nya, bukan URL final yg sudah digabung ORIGIN
      img: member.fotoPath || '',
      isActive: member.isActive,
    })
    setEditingId(member.id)
    setIsEditing(true)
  }

  const handleSave = async () => {
    setErrorMsg(null)
    try {
      const maxOrder = members.length > 0 ? Math.max(...members.map((m) => m.order || 0)) : 0
      const orderForSave =
        editingId != null ? members.find((m) => m.id === editingId)?.order ?? maxOrder + 1 : maxOrder + 1

      const payload = {
        nama_lengkap: form.name.trim(),
        gelar: form.degree.trim() || null,
        jabatan: form.role.trim(),
        masa_jabatan: form.period.trim() || null,
        foto_url: form.img?.trim() ? form.img.trim() : null, // <- disimpan ke DB
        urutan_tampil: orderForSave,
        is_aktif: form.isActive ? 1 : 0,
      }

      if (editingId != null) {
        await updateKepengurusan(String(editingId), payload)
      } else {
        await createKepengurusan(payload)
      }

      setIsEditing(false)
      setEditingId(null)
      setForm({ name: '', degree: '', role: '', period: '', img: '', isActive: true })
      await loadData()
    } catch (err: any) {
      console.error('Error saving member:', err)
      setErrorMsg(err?.message || 'Gagal menyimpan data kepengurusan')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus perangkat ini?')) return
    setErrorMsg(null)
    try {
      await deleteKepengurusan(String(id))
      setMembers((prev) => prev.filter((m) => m.id !== id))
    } catch (err: any) {
      console.error('Error deleting member:', err)
      setErrorMsg(err?.message || 'Gagal menghapus perangkat')
    }
  }

  const moveMember = async (id: number, direction: 'up' | 'down') => {
    const idx = members.findIndex((m) => m.id === id)
    if (idx === -1) return

    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= members.length) return

    const a = members[idx]
    const b = members[newIdx]

    try {
      await Promise.all([
        updateKepengurusan(String(a.id), {
          nama_lengkap: a.name,
          gelar: a.degree || null,
          jabatan: a.role,
          masa_jabatan: a.period || null,
          foto_url: a.fotoPath || null,
          urutan_tampil: b.order,
          is_aktif: a.isActive ? 1 : 0,
        }),
        updateKepengurusan(String(b.id), {
          nama_lengkap: b.name,
          gelar: b.degree || null,
          jabatan: b.role,
          masa_jabatan: b.period || null,
          foto_url: b.fotoPath || null,
          urutan_tampil: a.order,
          is_aktif: b.isActive ? 1 : 0,
        }),
      ])

      const next = members.slice()
      ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
      setMembers(next.map((m, i) => ({ ...m, order: i + 1 })).sort((x, y) => x.order - y.order))
    } catch (err) {
      console.error('Error updating order:', err)
      setErrorMsg('Gagal mengubah urutan tampil')
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setErrorMsg(null)

    try {
      const res = await uploadPengurusImage(file)

      const imagePath = res?.data?.imagePath || res?.imagePath || ''
      const imageUrl = res?.data?.imageUrl || res?.imageUrl || res?.data?.url || res?.url || ''

      const valueToSave = imagePath || imageUrl
      if (!valueToSave) throw new Error('Response upload tidak berisi imagePath/imageUrl')

      // simpan ke form (untuk DB)
      setForm((prev) => ({ ...prev, img: String(valueToSave) }))
    } catch (err: any) {
      console.error('Error uploading image:', err)
      setErrorMsg(err?.message || 'Upload gambar gagal')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const isEmpty = useMemo(() => !loading && members.length === 0, [loading, members.length])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Struktur Organisasi Desa</h1>
          <p className="text-sm text-slate-500 font-medium">Manajemen data jabatan dan profil perangkat desa.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-700 font-black rounded-[1.5rem] text-sm flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined">refresh</span>
            Refresh
          </button>
          <button
            onClick={openAdd}
            className="px-8 py-4 bg-indigo-700 text-white font-black rounded-[1.5rem] text-sm flex items-center gap-3 hover:bg-indigo-800 shadow-2xl shadow-indigo-100 transition-all"
          >
            <span className="material-symbols-outlined">person_add</span>
            Registrasi Perangkat
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">{errorMsg}</div>
      )}

      {isEmpty ? (
        <div className="text-center text-slate-600">Data kepengurusan belum tersedia.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {members.map((m, idx) => (
            <div
              key={m.id}
              className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[4/3] relative bg-slate-100">
                <img
                  src={m.img}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={m.name}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget
                    if (!img.dataset.fallback) {
                      img.dataset.fallback = '1'
                      img.src = PLACEHOLDER
                    }
                  }}
                />

                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button
                    onClick={() => moveMember(m.id, 'up')}
                    disabled={idx === 0}
                    className="h-10 w-10 bg-white rounded-xl text-slate-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                  </button>

                  <button
                    onClick={() => handleEdit(m)}
                    className="h-10 w-10 bg-white rounded-xl text-indigo-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="h-10 w-10 bg-white rounded-xl text-red-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>

                  <button
                    onClick={() => moveMember(m.id, 'down')}
                    disabled={idx === members.length - 1}
                    className="h-10 w-10 bg-white rounded-xl text-slate-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                  </button>
                </div>
              </div>

              <div className="p-10">
                <div className="flex items-center justify-between gap-3">
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
                    {m.role}
                  </span>
                  {!m.isActive && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Nonaktif
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 leading-tight mt-4">
                  {m.name}
                  {m.degree ? `, ${m.degree}` : ''}
                </h3>

                <div className="flex items-center gap-3 mt-6 text-slate-400">
                  <span className="material-symbols-outlined text-sm">history_edu</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">SK Berlaku: {m.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Perangkat' : 'Input Data Perangkat'}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Formulir Pengangkatan Digital</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="h-10 w-10 bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-12 space-y-8">
              <div className="flex gap-10 items-center">
                <div
                  className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center shrink-0 hover:border-indigo-400 cursor-pointer group transition-all relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* preview: kalau form.img ada, render dari origin+path */}
                  {form.img ? (
                    <img
                      src={buildImageUrl(ORIGIN, form.img)}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-[2.5rem]"
                      onError={(e) => {
                        const img = e.currentTarget
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = '1'
                          img.src = PLACEHOLDER
                        }
                      }}
                    />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-slate-300 text-4xl group-hover:text-indigo-500">
                        photo_camera
                      </span>
                      <p className="text-[8px] font-black uppercase text-slate-400 mt-2">Upload Foto</p>
                    </>
                  )}

                  {uploadingImage && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                      <div className="text-white text-xs">Uploading...</div>
                    </div>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                <div className="flex-1 space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">
                      Nama Lengkap (Tanpa Gelar)
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50"
                      placeholder="Contoh: Samsul Arifin"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">
                      Gelar Pendidikan
                    </label>
                    <input
                      value={form.degree}
                      onChange={(e) => setForm({ ...form, degree: e.target.value })}
                      type="text"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50"
                      placeholder="Contoh: S.Sos, M.AP"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">
                    Jabatan Struktur
                  </label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-50"
                    placeholder="Contoh: Ketua RT 01, Sekretaris, dll"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">
                    Masa Jabatan (SK)
                  </label>
                  <input
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50"
                    placeholder="2024-2030"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="aktif"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-5 w-5"
                />
                <label htmlFor="aktif" className="text-sm font-bold text-slate-700">
                  Aktif ditampilkan di publik
                </label>
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-10 py-4 bg-indigo-700 text-white font-black rounded-2xl text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all"
              >
                Simpan Perangkat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrg
