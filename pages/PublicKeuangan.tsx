
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PublicKeuangan: React.FC = () => {
  const financeHistory = [
    { month: 'Mei', masuk: 12000000, keluar: 8000000 },
    { month: 'Jun', masuk: 15000000, keluar: 10000000 },
    { month: 'Jul', masuk: 10000000, keluar: 12000000 },
    { month: 'Agu', masuk: 20000000, keluar: 15000000 },
    { month: 'Sep', masuk: 18000000, keluar: 9000000 },
    { month: 'Okt', masuk: 22000000, keluar: 11000000 },
  ];

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Transparansi Keuangan</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Laporan rutin pengelolaan dana warga untuk memastikan keterbukaan dan kepercayaan publik.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 text-white relative overflow-hidden">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Total Kas Saat Ini</p>
            <h2 className="text-4xl font-extrabold">Rp 74,500,000</h2>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12% Bulan Ini
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-[150px]">payments</span>
            </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Pemasukan (Okt)</p>
            <h2 className="text-4xl font-extrabold">Rp 22,000,000</h2>
            <p className="mt-8 text-xs text-slate-400">Terdiri dari iuran rutin, donasi, dan sponsorship kegiatan.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Pengeluaran (Okt)</p>
            <h2 className="text-4xl font-extrabold text-slate-900">Rp 11,000,000</h2>
            <div className="mt-8 flex gap-2">
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">Infrastruktur</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold">Sosial</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-900 mb-10">Grafik Arus Kas 6 Bulan Terakhir</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeHistory}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="masuk" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorMasuk)" />
                <Area type="monotone" dataKey="keluar" stroke="#ef4444" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicKeuangan;
