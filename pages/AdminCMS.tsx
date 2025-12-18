
import React, { useState } from 'react';

const AdminCMS: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([
    /* Fixed: Changed property name 'cat' to 'category' to match form state and maintain internal consistency */
    { id: 1, title: 'Penyaluran BLT Dana Desa Tahap III', category: 'Berita', date: '2024-10-25', status: 'Published', img: 'https://picsum.photos/400/250?seed=blt', content: '' },
    { id: 2, title: 'Himbauan Kebersihan Lingkungan Dusun', category: 'Pengumuman', date: '2024-10-22', status: 'Draft', img: 'https://picsum.photos/400/250?seed=clean', content: '' },
  ]);

  const [form, setForm] = useState({ title: '', content: '', category: 'Berita', img: '' });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Kelola Konten & Berita</h1>
          <p className="text-sm text-slate-500 font-medium">Publikasikan kabar terbaru untuk seluruh warga desa.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 hover:bg-indigo-800 shadow-xl shadow-indigo-100"
          >
            <span className="material-symbols-outlined">edit_note</span> Tulis Konten Baru
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-4">
                <button onClick={() => setIsEditing(false)} className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-black">Editor Konten Desa</h2>
             </div>
             <div className="flex gap-3">
               <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-500">Simpan Draf</button>
               <button onClick={() => {
                 /* Fixed: New post object now correctly matches the 'category' property name expected in the state, resolving line 42 error */
                 setPosts([{ id: Date.now(), ...form, date: '2024-10-27', status: 'Published', img: 'https://picsum.photos/400/250?seed=new' }, ...posts]);
                 setIsEditing(false);
               }} className="px-8 py-2.5 bg-indigo-700 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-indigo-100">Publikasikan</button>
             </div>
          </div>
          
          <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="Masukkan Judul Artikel / Berita..."
                  className="w-full text-4xl font-black border-none focus:ring-0 placeholder:text-slate-200"
                />
              </div>
              <div className="border-t pt-8">
                <textarea 
                  rows={15}
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  placeholder="Tuliskan isi konten di sini secara mendalam..."
                  className="w-full border-none focus:ring-0 text-lg leading-relaxed placeholder:text-slate-200"
                />
              </div>
            </div>
            
            <div className="space-y-8 bg-slate-50 p-8 rounded-[2rem] h-fit border border-slate-100">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Gambar Unggulan</label>
                  <div className="aspect-video bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group hover:border-indigo-400 cursor-pointer transition-all">
                    <span className="material-symbols-outlined text-4xl text-slate-200 group-hover:text-indigo-500">image</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">Pilih Foto Sampul</p>
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Kategori Konten</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-white border-none rounded-2xl py-4 px-6 font-bold shadow-sm">
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
                  <p className="text-[11px] opacity-70 mb-4">Klik tombol di bawah jika Anda ingin AI memperbaiki tata bahasa atau merapikan narasi Anda.</p>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase transition-all">Perbaiki Narasi</button>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500">
               <div className="aspect-video relative">
                 <img src={post.img} className="w-full h-full object-cover" />
                 <div className="absolute top-4 left-4">
                   {/* Fixed: Updated property access to use 'category' instead of 'cat' */}
                   <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase text-indigo-700 shadow-sm">{post.category}</span>
                 </div>
               </div>
               <div className="p-8">
                 <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-700 transition-colors">{post.title}</h3>
                 <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                   <span className="text-[10px] font-bold text-slate-400">{post.date}</span>
                   <div className="flex gap-2">
                     <button className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600"><span className="material-symbols-outlined text-sm">edit</span></button>
                     <button className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600"><span className="material-symbols-outlined text-sm">delete</span></button>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCMS;
