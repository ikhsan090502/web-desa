
import React, { useState } from 'react';

const AdminResidents: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [residents, setResidents] = useState([
    { nik: '3201234567890001', kk: '3201234567890010', name: 'BUDI SANTOSO', dusun: 'Dusun I', rw: '05', rt: '02', status: 'Aktif' },
    { nik: '3201234567890002', kk: '3201234567890011', name: 'SITI AMINAH', dusun: 'Dusun II', rw: '01', rt: '01', status: 'Aktif' },
  ]);

  const [formData, setFormData] = useState({
    nik: '', kk: '', name: '', dusun: 'Dusun I', rw: '', rt: '', gender: 'L'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nik.length !== 16) return alert("NIK harus 16 digit!");
    setResidents([...residents, { ...formData, status: 'Aktif' }]);
    setIsAdding(false);
    setFormData({ nik: '', kk: '', name: '', dusun: 'Dusun I', rw: '', rt: '', gender: 'L' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Database Kependudukan</h1>
          <p className="text-sm text-slate-500 font-medium">Data Terpadu Warga Desa Harmoni (Dusun, RW, RT)</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl text-sm hover:bg-indigo-800 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Daftar Warga Baru
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-900">Formulir Pendaftaran Warga</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSave} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nomor Induk Kependudukan (NIK)</label>
                  <input required maxLength={16} value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="16 Digit NIK" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nomor Kartu Keluarga (KK)</label>
                  <input required maxLength={16} value={formData.kk} onChange={e => setFormData({...formData, kk: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="16 Digit No. KK" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Lengkap (Sesuai KTP)</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="NAMA LENGKAP" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Wilayah Dusun</label>
                  <select value={formData.dusun} onChange={e => setFormData({...formData, dusun: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50">
                    <option>Dusun I</option>
                    <option>Dusun II</option>
                    <option>Dusun III</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">RW</label>
                    <input required value={formData.rw} onChange={e => setFormData({...formData, rw: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="001" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">RT</label>
                    <input required value={formData.rt} onChange={e => setFormData({...formData, rt: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="001" />
                  </div>
                </div>
                <div className="pt-6 flex gap-3">
                   <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-xs">Batal</button>
                   <button type="submit" className="flex-1 py-4 bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all">Simpan Data</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">NIK / KK</th>
                <th className="px-8 py-5">Nama Lengkap</th>
                <th className="px-8 py-5">Dusun</th>
                <th className="px-8 py-5">RW/RT</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {residents.map((res) => (
                <tr key={res.nik} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-900">
                    <p>{res.nik}</p>
                    <p className="text-[9px] text-slate-400">KK: {res.kk}</p>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 uppercase tracking-tight">{res.name}</td>
                  <td className="px-8 py-6 font-bold text-slate-600">{res.dusun}</td>
                  <td className="px-8 py-6 font-bold text-slate-600">RW {res.rw} / RT {res.rt}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">{res.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right flex justify-end gap-2">
                    <button className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminResidents;
