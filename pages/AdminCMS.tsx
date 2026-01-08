import React, { useEffect, useMemo, useState } from 'react'
import { fetchActivities, createKegiatan, deleteKegiatan } from '../services/api'

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
  kategori?: string | null
  category?: string | null
  [key: string]: unknown
}

interface Post {
  id: number
  title: string
  category: string
  date: string
  status: string
  img: string
  content: string
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

const buildImageUrl = (baseUrl: string, fotoUrl?: string | null) => {
  if (!fotoUrl) return ''
  if (/^https?:\/\//i.test(fotoUrl)) return fotoUrl
  const path = fotoUrl.startsWith('/') ? fotoUrl : `/${fotoUrl}`
  return `${baseUrl}${path}`
}

const AdminCMS: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const apiBase =
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (import.meta as any).env?.VITE_BASE_API_URL ||
    'https://dukuhannayu01.com'

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Berita',
    img: '',
  })

  const resetForm = () => {
    setForm({ title: '', content: '', category: 'Berita', img: '' })
    setEditingPostId(null)
  }

  const loadData = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = (await fetchActivities()) as unknown
      const list = normalizeList<KegiatanApi>(res)

      const mapped: Post[] = list
        .slice()
        .sort((a, b) => Number(b.id) - Number(a.id))
        .map((k) => {
          const category = String((k.kategori ?? k.category ?? 'Berita') || 'Berita')
          return {
            id: Number(k.id),
            title: String(k.judul ?? '').trim() || '-',
            category,
            date: toInputDate(k.tanggal),
            status: String(k.status ?? 'Published'),
            img: buildImageUrl(apiBase, (k.foto_url ?? null) as string | null),
            content: String(k.deskripsi ?? k.content ?? '').trim(),
          }
        })

      setPosts(mapped)
    } catch (err: any) {
      console.error('Error fetching posts:', err)
      setPosts([])
      setErrorMsg(err?.message || 'Gagal memuat konten')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNew = () => {
    resetForm()
    setIsEditing(true)
  }

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id)
    setForm({
      title: post.title === '-' ? '' : post.title,
      content: post.content || '',
      category: post.category || 'Berita',
      img: post.img || '',
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setErrorMsg(null)
    try {
      // CMS ini pakai endpoint kegiatan (createKegiatan) sebagai "post"
      const payload = {
        judul: form.title.trim(),
        tanggal: new Date().toISOString(), // backend kamu pakai ISO juga aman
        lokasi: 'Desa Banjarsari',
        status: 'Published',
        anggaran: 0,
        foto_url: form.img || null,
        deskripsi: form.content || '',
        kategori: form.category, // kalau backend belum ada kolom, aman: diabaikan
      }

      // versi kamu belum ada updateKegiatan di CMS; jadi:
      // - kalau edit: delete lama + create baru (opsional), tapi itu jelek untuk id
      // - lebih aman: CMS ini hanya create + delete; edit UI hanya mengisi form (create baru)
      // Saya buat default: kalau editPostId ada, tetap create baru (tanpa menghapus),
      // supaya tidak merusak data lama. Anda bisa ganti ke updateKegiatan nanti.
      const result = await createKegiatan(payload)
      const newId = Number((result as any)?.id)

      const newPost: Post = {
        id: newId,
        title: payload.judul,
        category: form.category,
        date: toInputDate(payload.tanggal),
        status: 'Published',
        img: buildImageUrl(apiBase, payload.foto_url as any),
        content: payload.deskripsi,
      }

      setPosts((prev) => [newPost, ...prev])

      setIsEditing(false)
      resetForm()
    } catch (err: any) {
      console.error('Error saving post:', err)
      setErrorMsg(err?.message || 'Gagal menyimpan konten')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konten ini?')) return
    setErrorMsg(null)
    try {
      await deleteKegiatan(String(id))
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      console.error('Error deleting post:', err)
      setErrorMsg(err?.message || 'Gagal menghapus konten')
    }
  }

  const emptyState = useMemo(() => !loading && posts.length === 0, [loading, posts.length])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Kelola Konten & Berita</h1>
          <p className="text-sm text-slate-500 font-medium">Publikasikan kabar terbaru untuk seluruh warga desa.</p>
        </div>

        {!isEditing && (
          <div className="flex gap-3">
            <button
              onClick={loadData}
              className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>

            <button
              onClick={handleNew}
              className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 hover:bg-indigo-800 shadow-xl shadow-indigo-100"
            >
              <span className="material-symbols-outlined">edit_note</span> Tulis Konten Baru
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">
          {errorMsg}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsEditing(false)
                  resetForm()
                }}
                className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <h2 className="text-lg font-black">Editor Konten Desa</h2>
                {editingPostId && (
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Mode: Draft Baru dari Post #{editingPostId}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Draf: cukup tutup editor, tidak create
                  setIsEditing(false)
                  resetForm()
                }}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-500"
              >
                Simpan Draf
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-2.5 bg-indigo-700 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-indigo-100"
              >
                Publikasikan
              </button>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Masukkan Judul Artikel / Berita..."
                  className="w-full text-4xl font-black border-none focus:ring-0 placeholder:text-slate-200"
                />
              </div>
              <div className="border-t pt-8">
                <textarea
                  rows={15}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tuliskan isi konten di sini secara mendalam..."
                  className="w-full border-none focus:ring-0 text-lg leading-relaxed placeholder:text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-8 bg-slate-50 p-8 rounded-[2rem] h-fit border border-slate-100">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                  Gambar Unggulan (URL)
                </label>
                <input
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  type="text"
                  className="w-full bg-white border-none rounded-2xl py-4 px-6 font-bold shadow-sm"
                  placeholder="https://... atau /uploads/..."
                />
                {form.img ? (
                  <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-white">
                    <img
                      src={form.img}
                      className="w-full h-full object-cover"
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-4 aspect-video bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-200">image</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">Belum ada gambar</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                  Kategori Konten
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-white border-none rounded-2xl py-4 px-6 font-bold shadow-sm"
                >
                  <option>Berita</option>
                  <option>Pengumuman</option>
                  <option>Profil Desa</option>
                  <option>Agenda</option>
                </select>
              </div>

              <div className="p-6 bg-indigo-900 rounded-[1.5rem] text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <h4 className="text-xs font-bold uppercase tracking-widest">Optimasi AI</h4>
                </div>
                <p className="text-[11px] opacity-70 mb-4">
                  (UI saja) nanti bisa disambungkan ke fitur perapian teks.
                </p>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase transition-all">
                  Perbaiki Narasi
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : emptyState ? (
        <div className="text-center text-slate-500 font-medium py-10">
          Belum ada konten.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-video relative bg-slate-100">
                {post.img ? (
                  <img
                    src={post.img}
                    className="w-full h-full object-cover"
                    alt={post.title}
                    onError={(e) => {
                      e.currentTarget.src = '/assets/avatar-placeholder.jpg'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase text-indigo-700 shadow-sm">
                    {post.category || 'Berita'}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-indigo-700 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400">{post.date || '-'}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminCMS
