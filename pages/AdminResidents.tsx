
import React from 'react';

const AdminResidents: React.FC = () => {
  const residents = [
    { nik: '3201234567890001', kk: '3201234567890010', name: 'Budi Santoso', address: 'Dusun I - RT 02/05', status: 'Aktif', category: 'Warga Tetap' },
    { nik: '3201234567890002', kk: '3201234567890011', name: 'Siti Aminah', address: 'Dusun II - RT 01/01', status: 'Aktif', category: 'Warga Tetap' },
    { nik: '3201234567890003', kk: '3201234567890012', name: 'Doni Pratama', address: 'Dusun I - RT 04/05', status: 'Aktif', category: 'Warga Sementara' },
    { nik: '3201234567890004', kk: '3201234567890013', name: 'Agus Wijaya', address: 'Dusun III - RT 03/02', status: 'Pindah', category: 'Warga Tetap' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Database Kependudukan</h1>
          <p className="text-sm text-slate-500 font-medium">Pengelolaan data induk kependudukan Desa Harmoni.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">file_download</span>
            Ekspor Data
          </button>
          <button className="px-5 py-2.5 bg-indigo-700 text-white font-bold rounded-2xl text-sm hover:bg-indigo-800 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_add</span>
            Pendaftaran Warga
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-lg">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Cari berdasarkan NIK, Nama, atau No. KK..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-50 text-sm font-medium"
            />
          </div>
          <div className="flex gap-3">
            <select className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-600 focus:ring-4 focus:ring-indigo-50">
              <option>Semua Dusun</option>
              <option>Dusun I</option>
              <option>Dusun II</option>
              <option>Dusun III</option>
            </select>
            <select className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-600 focus:ring-4 focus:ring-indigo-50">
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Pindah</option>
              <option>Wafat</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Identitas (NIK/KK)</th>
                <th className="px-8 py-5">Nama Lengkap</th>
                <th className="px-8 py-5">Alamat / Wilayah</th>
                <th className="px-8 py-5">Tipe</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {residents.map((res) => (
                <tr key={res.nik} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900">{res.nik}</p>
                    <p className="text-[10px] text-slate-400 font-bold">KK: {res.kk}</p>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 uppercase tracking-tight">{res.name}</td>
                  <td className="px-8 py-6">
                    <p className="font-semibold text-slate-600">{res.address}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl font-black text-[10px] uppercase">
                      {res.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${res.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="h-10 w-10 flex items-center justify-center hover:bg-indigo-50 text-slate-400 hover:text-indigo-700 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-lg">description</span>
                      </button>
                      <button className="h-10 w-10 flex items-center justify-center hover:bg-indigo-50 text-slate-400 hover:text-indigo-700 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Data Per 2024 • Total: 4,820 Jiwa</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase hover:bg-white transition-all disabled:opacity-30" disabled>Sebelumnya</button>
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase hover:bg-white transition-all">Berikutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResidents;
