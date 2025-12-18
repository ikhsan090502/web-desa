
import React from 'react';

const AdminResidents: React.FC = () => {
  const residents = [
    { id: 'WRG001', name: 'Budi Santoso', address: 'Blok A No. 12', status: 'Aktif', category: 'Warga Tetap' },
    { id: 'WRG002', name: 'Siti Aminah', address: 'Blok B No. 5', status: 'Aktif', category: 'Warga Tetap' },
    { id: 'WRG003', name: 'Doni Pratama', address: 'Blok C No. 2', status: 'Aktif', category: 'Warga Kontrak' },
    { id: 'WRG004', name: 'Agus Wijaya', address: 'Blok A No. 1', status: 'Pindah', category: 'Warga Tetap' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Warga</h1>
          <p className="text-sm text-slate-500">Kelola basis data kependudukan wilayah.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50">
            Ekspor CSV
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_add</span>
            Tambah Warga
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Cari warga berdasarkan nama atau alamat..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-blue-200 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-blue-200">
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Pindah</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-4">ID Warga</th>
                <th className="px-8 py-4">Nama Lengkap</th>
                <th className="px-8 py-4">Alamat</th>
                <th className="px-8 py-4">Kategori</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {residents.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-400">{res.id}</td>
                  <td className="px-8 py-5 font-extrabold text-slate-900">{res.name}</td>
                  <td className="px-8 py-5 text-slate-600">{res.address}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-[11px]">
                      {res.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${res.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-slate-100 flex justify-between items-center text-slate-500 text-xs font-bold">
          <span>Menampilkan 4 dari 1,240 Warga</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>Sebelumnya</button>
            <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">Berikutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResidents;
