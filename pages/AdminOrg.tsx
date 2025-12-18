
import React, { useState } from 'react';

const AdminOrg: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [members, setMembers] = useState([
    { id: 1, name: 'Ir. Ahmad Subarjo', degree: 'S.T., M.Si', role: 'Ketua RW', period: '2023-2026', img: 'https://i.pravatar.cc/300?u=1' },
    { id: 2, name: 'Siti Rahmawati', degree: 'M.Pd', role: 'Sekretaris', period: '2023-2026', img: 'https://i.pravatar.cc/300?u=2' },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Kepengurusan</h1>
          <p className="text-sm text-slate-500">Atur struktur organisasi, jabatan, dan profil pengurus.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
        >
          <span className="material-symbols-outlined">person_add</span> Tambah Pengurus
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm group">
            <div className="aspect-[4/3] relative">
              <img src={m.img} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="h-10 w-10 bg-white rounded-full text-blue-600 flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">edit</span></button>
                <button className="h-10 w-10 bg-white rounded-full text-red-600 flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">delete</span></button>
              </div>
            </div>
            <div className="p-8">
              <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">{m.role}</p>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                {m.name}{m.degree ? `, ${m.degree}` : ''}
              </h3>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">event_repeat</span> Masa Bakti: {m.period}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-slate-900">Form Pengurus</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex gap-6 items-start">
                <div className="w-24 h-24 bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-300 text-4xl">add_a_photo</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nama Lengkap</label>
                    <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-semibold" placeholder="Contoh: Ahmad Subarjo" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Gelar (Opsional)</label>
                    <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-semibold" placeholder="Contoh: S.T., M.Si" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Jabatan</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold">
                    <option>Ketua RW</option>
                    <option>Sekretaris</option>
                    <option>Bendahara</option>
                    <option>Seksi Keamanan</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Masa Bakti</label>
                  <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-semibold" placeholder="2023-2026" />
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-600 font-bold text-sm">Batal</button>
              <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl text-sm shadow-xl shadow-blue-100">Simpan Pengurus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrg;
