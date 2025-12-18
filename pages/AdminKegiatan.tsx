
import React, { useState } from 'react';
import { generateAssistantContent } from '../services/gemini';

const AdminKegiatan: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');

  const handleGenerateDesc = async () => {
    if (!title) return alert("Masukkan judul kegiatan terlebih dahulu.");
    setIsGenerating(true);
    try {
      const prompt = `Buatkan deskripsi kegiatan yang rapi, informatif, dan sopan untuk pengumuman warga dengan judul: "${title}"`;
      const result = await generateAssistantContent(prompt, "Manajemen Kegiatan Warga");
      setDesc(result || '');
    } catch (e) {
      alert("Gagal memanggil AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Kegiatan</h1>
          <p className="text-sm text-slate-500">Kelola agenda, dokumentasi, dan publikasi kegiatan warga.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
        >
          <span className="material-symbols-outlined">add_circle</span> Tambah Kegiatan
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-xl text-slate-900">Tambah Agenda Baru</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined">cancel</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">Judul Kegiatan</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-200 py-4 px-6 text-sm font-semibold"
                  placeholder="Contoh: Kerja Bakti Massal RW 05"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">Tanggal</label>
                  <input type="date" className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-200 py-4 px-6 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">Kategori</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-200 py-4 px-6 text-sm font-bold">
                    <option>Sosial</option>
                    <option>Infrastruktur</option>
                    <option>Kesehatan</option>
                    <option>Agama</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">Upload Gambar/Dokumentasi</label>
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50 group hover:border-blue-400 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-blue-500 mb-2">add_photo_alternate</span>
                  <p className="text-xs font-bold text-slate-400">Klik untuk pilih gambar atau tarik ke sini</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deskripsi Kegiatan</label>
                <button 
                  onClick={handleGenerateDesc}
                  disabled={isGenerating}
                  className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span> 
                  {isGenerating ? "Menyusun..." : "Bantu Tulis AI"}
                </button>
              </div>
              <textarea 
                rows={12}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="flex-1 w-full bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-blue-200 p-6 text-sm leading-relaxed"
                placeholder="Tulis detail kegiatan di sini..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button onClick={() => setIsAdding(false)} className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl text-sm hover:bg-slate-200 transition-all">
              Batalkan
            </button>
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
              Simpan & Publikasikan
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img src={`https://picsum.photos/600/400?seed=${i+20}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="h-8 w-8 rounded-full bg-white/90 backdrop-blur text-slate-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button className="h-8 w-8 rounded-full bg-white/90 backdrop-blur text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-extrabold uppercase">Sosial</span>
                <span className="text-[10px] font-bold text-slate-400 italic">Publik</span>
              </div>
              <h4 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">Judul Kegiatan {i}</h4>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic leading-relaxed">"Deskripsi kegiatan yang telah dipublikasikan kepada warga Desa Harmoni..."</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">20 Okt 2024</span>
                <span className="material-symbols-outlined text-slate-300">visibility</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminKegiatan;
