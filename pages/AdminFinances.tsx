
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AdminFinances: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [filterType, setFilterType] = useState('Semua');

  const COLORS = ['#2563eb', '#6366f1', '#10b981', '#f59e0b'];
  
  const rawTransactions = [
    { id: 'TRX001', type: 'Masuk', amount: 5000000, desc: 'Iuran Bulanan Warga Blok A', date: '2024-10-10', cat: 'Iuran' },
    { id: 'TRX002', type: 'Keluar', amount: 2500000, desc: 'Perbaikan Lampu Jalan', date: '2024-10-12', cat: 'Infrastruktur' },
    { id: 'TRX003', type: 'Masuk', amount: 12000000, desc: 'Sponsorship HUT RI', date: '2024-10-15', cat: 'Donasi' },
    { id: 'TRX004', type: 'Keluar', amount: 800000, desc: 'Atk Sekretariat', date: '2024-10-16', cat: 'Operasional' },
  ];

  const filteredTransactions = rawTransactions.filter(t => {
    const typeMatch = filterType === 'Semua' || t.type === filterType;
    const catMatch = filterCategory === 'Semua' || t.cat === filterCategory;
    return typeMatch && catMatch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Keuangan</h1>
          <p className="text-sm text-slate-500">Transparansi arus kas dan audit dana warga.</p>
        </div>
        <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">add_circle</span> Input Transaksi
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tipe</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 focus:ring-blue-200 w-40"
            >
              <option>Semua</option>
              <option>Masuk</option>
              <option>Keluar</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Kategori</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 focus:ring-blue-200 w-40"
            >
              <option>Semua</option>
              <option>Iuran</option>
              <option>Infrastruktur</option>
              <option>Donasi</option>
              <option>Operasional</option>
            </select>
          </div>
          <button className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-all">
            Reset Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Keterangan</th>
                <th className="px-8 py-4">Kategori</th>
                <th className="px-8 py-4">Tipe</th>
                <th className="px-8 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900">{trx.desc}</p>
                    <p className="text-[10px] text-slate-400">{trx.date}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-semibold text-slate-500">{trx.cat}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${trx.type === 'Masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {trx.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-extrabold text-slate-900">
                    {trx.type === 'Keluar' && '- '}Rp {trx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p className="text-sm font-bold">Tidak ada data transaksi yang sesuai.</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Saldo Total</p>
            <h2 className="text-3xl font-extrabold">Rp 74,500,000</h2>
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-50">In (Bulan ini)</p>
                <p className="text-sm font-extrabold text-green-400">+12.5jt</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-50">Out (Bulan ini)</p>
                <p className="text-sm font-extrabold text-red-400">-4.2jt</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-6">Distribusi Pengeluaran</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Infrastruktur', value: 2500000 },
                      { name: 'Ops', value: 800000 }
                    ]}
                    cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value"
                  >
                    <Cell fill="#2563eb" />
                    <Cell fill="#6366f1" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinances;
