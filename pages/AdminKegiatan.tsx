
import React, { useState } from 'react';

const AdminKegiatan: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activities, setActivities] = useState([
    { 
      id: 1, 
      title: 'Pembangunan Drainase RT 02/05', 
      date: '2024-11-05', 
      loc: 'Dusun I - Jl. Melati', 
      status: 'Rencana', 
      budget: 'Rp 45.000.000', 
      img: 'https://picsum.photos/600/400?seed=build1',
      description: 'Kegiatan ini merupakan bagian dari program percepatan infrastruktur desa tahun 2024. Pembangunan drainase sepanjang 200 meter ini bertujuan untuk mencegah banjir saat musim hujan tiba.'
    },
    { 
      id: 2, 
      title: 'Pelatihan UMKM Desa Harmoni', 
      date: '2024-10-30', 
      loc: 'Aula Kantor Desa', 
      status: 'Proses', 
      budget: 'Rp 5.500.000', 
      img: 'https://picsum.photos/600/400?seed=train1',
      description: 'Pemerintah desa memfasilitasi 50 pelaku UMKM lokal untuk mendapatkan pelatihan pemasaran digital dan pengemasan produk yang lebih menarik.'
    },
  ]);

  const [form, setForm] = useState({ title: '', date: '', loc: '', budget: '', status: 'Rencana', description: '' });

  const handleEdit = (act: any) => {
    setForm({ title: act.title, date: act.date, loc: act.loc, budget: act.budget, status: act.status, description: act.description || '' });
    setEditingId(act.id);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (editingId) {
      setActivities(activities.map(a => a.id === editingId ? { ...a, ...form } : a));
    } else {
      setActivities([{ id: Date.now(), ...form, img: `https://picsum.photos/600/400?seed=${Date.now()}` }, ...activities]);
    }
    setIsAdding(false);
    setEditingId(null);
    setForm({ title: '', date: '', loc: '', budget: '', status: 'Rencana', description: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manajemen Kabar & Kegiatan</h1>
          <p className="text-sm text-slate-500 font-medium">Input kegiatan di sini akan otomatis tampil sebagai berita di halaman publik.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setForm({ title: '', date: '', loc: '', budget: '', status: 'Rencana', description: '' }); }}
            className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl text-sm flex items-center gap-2 hover:bg-indigo-800 shadow-xl shadow-indigo-100 transition-all"
          >
            <span className="material-symbols-outlined">add_task</span> Input Kabar Desa Baru
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-[2.5rem] border-2 border-indigo-100 p-10 animate-in slide-in-from-top-4 duration-500 shadow-2xl">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black">{editingId ? 'Edit Kabar Desa' : 'Tulis Kabar Desa Baru'}</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined">close</span></button>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Judul Berita/Kegiatan</label>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" placeholder="Contoh: Peresmian Jembatan Desa..." />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tanggal</label>
                      <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} type="date" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                      <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold">
                        <option>Rencana</option>
                        <option>Proses</option>
                        <option>Selesai</option>
                      </select>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lokasi</label>
                        <input value={form.loc} onChange={e => setForm({...form, loc: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" placeholder="Dusun/Wilayah" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Anggaran</label>
                        <input value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold" placeholder="Rp..." />
                    </div>
                 </div>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Isi Berita / Laporan Lengkap</label>
                    <textarea 
                        rows={8}
                        value={form.description} 
                        onChange={e => setForm({...form, description: e.target.value})} 
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-medium leading-relaxed" 
                        placeholder="Tuliskan detail kegiatan secara mendalam di sini..." 
                    />
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs">Batal</button>
                   <button onClick={handleSave} className="flex-1 py-4 bg-indigo-700 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-800 transition-all">
                     {editingId ? 'Update Kabar' : 'Simpan Kabar'}
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {activities.map(act => (
          <div key={act.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:shadow-xl transition-all duration-500">
             <div className="sm:w-48 aspect-video sm:aspect-square shrink-0 relative overflow-hidden">
               <img src={act.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-slate-900/20"></div>
             </div>
             <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-2">
                     <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${act.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{act.status}</span>
                     <span className="text-[10px] font-black text-indigo-600">{act.budget}</span>
                   </div>
                   <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 line-clamp-1">{act.title}</h3>
                   <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">{act.description}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400">{act.date}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(act)} className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"><span className="material-symbols-outlined text-sm">edit</span></button>
                  </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminKegiatan;
