
import React, { useState } from 'react';

const AdminOrg: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [members, setMembers] = useState([
    { id: 1, name: 'Drs. H. Mulyono', degree: 'M.Si', role: 'Kepala Desa', period: '2024-2030', img: 'https://i.pravatar.cc/300?u=kades' },
    { id: 2, name: 'Samsul Arifin', degree: 'S.Sos', role: 'Sekretaris Desa', period: '2022-2028', img: 'https://i.pravatar.cc/300?u=sekdes' },
  ]);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Struktur Organisasi Desa</h1>
          <p className="text-sm text-slate-500 font-medium">Manajemen data jabatan dan profil perangkat desa.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="px-8 py-4 bg-indigo-700 text-white font-black rounded-[1.5rem] text-sm flex items-center gap-3 hover:bg-indigo-800 shadow-2xl shadow-indigo-100 transition-all"
        >
          <span className="material-symbols-outlined">person_add</span> 
          Registrasi Perangkat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500">
            <div className="aspect-[4/3] relative">
              <img src={m.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                <button className="h-12 w-12 bg-white rounded-2xl text-indigo-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all"><span className="material-symbols-outlined">edit</span></button>
                <button className="h-12 w-12 bg-white rounded-2xl text-red-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all"><span className="material-symbols-outlined">delete</span></button>
              </div>
            </div>
            <div className="p-10">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                {m.role}
              </span>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                {m.name}{m.degree ? `, ${m.degree}` : ''}
              </h3>
              <div className="flex items-center gap-3 mt-6 text-slate-400">
                <span className="material-symbols-outlined text-sm">history_edu</span>
                <span className="text-[10px] font-black uppercase tracking-widest">SK Berlaku: {m.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Input Data Perangkat</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Formulir Pengangkatan Digital</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="h-10 w-10 bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-12 space-y-8">
              <div className="flex gap-10 items-center">
                <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center shrink-0 hover:border-indigo-400 cursor-pointer group transition-all">
                  <span className="material-symbols-outlined text-slate-300 text-4xl group-hover:text-indigo-500">photo_camera</span>
                  <p className="text-[8px] font-black uppercase text-slate-400 mt-2">Upload Foto</p>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Nama Lengkap (Tanpa Gelar)</label>
                    <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50" placeholder="Contoh: Samsul Arifin" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Gelar Pendidikan</label>
                    <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50" placeholder="Contoh: S.Sos, M.AP" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Jabatan Struktur</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-50">
                    <option>Kepala Desa</option>
                    <option>Sekretaris Desa</option>
                    <option>Kaur Keuangan</option>
                    <option>Kaur Umum & TU</option>
                    <option>Kaur Perencanaan</option>
                    <option>Kasi Pemerintahan</option>
                    <option>Kasi Kesejahteraan</option>
                    <option>Kasi Pelayanan</option>
                    <option>Kepala Dusun I</option>
                    <option>Kepala Dusun II</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Masa Jabatan (SK)</label>
                  <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50" placeholder="2024-2030" />
                </div>
              </div>
            </div>
            <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button onClick={() => setIsEditing(false)} className="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all">Batal</button>
              <button className="px-10 py-4 bg-indigo-700 text-white font-black rounded-2xl text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all">Simpan Perangkat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrg;
