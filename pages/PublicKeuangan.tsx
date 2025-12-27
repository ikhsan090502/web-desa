import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchAllKeuangan } from '../services/api';

const PublicKeuangan: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllKeuangan();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching keuangan:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Compute total balance
  const totalBalance = transactions.reduce((acc: number, t: any) => {
    if (t.tipe === 'Pemasukan') return acc + t.nominal;
    if (t.tipe === 'Pengeluaran') return acc - t.nominal;
    return acc;
  }, 0);

  // Compute monthly in/out
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyIn = transactions.filter((t: any) => t.tipe === 'Pemasukan' && t.tanggal.startsWith(currentMonth)).reduce((acc: number, t: any) => acc + t.nominal, 0);
  const monthlyOut = transactions.filter((t: any) => t.tipe === 'Pengeluaran' && t.tanggal.startsWith(currentMonth)).reduce((acc: number, t: any) => acc + t.nominal, 0);

  // Mock history data (in real app, compute from transactions)
  const financeHistory = [
    { month: 'Jun', masuk: 15000000, keluar: 12000000 },
    { month: 'Jul', masuk: 18000000, keluar: 14000000 },
    { month: 'Aug', masuk: 20000000, keluar: 16000000 },
    { month: 'Sep', masuk: 22000000, keluar: 18000000 },
    { month: 'Oct', masuk: 25000000, keluar: 20000000 },
    { month: new Date().toLocaleString('id-ID', { month: 'short' }), masuk: monthlyIn, keluar: monthlyOut },
  ];


  // Format currency function
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Transparansi Keuangan</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Laporan rutin pengelolaan dana warga untuk memastikan keterbukaan dan kepercayaan publik.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 text-white relative overflow-hidden group">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Total Kas Saat Ini</p>
            <h2 className="text-4xl font-extrabold">{formatCurrency(totalBalance)}</h2>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black bg-white/20 w-fit px-4 py-1.5 rounded-full uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">verified</span> Terverifikasi Audit
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[150px]">payments</span>
            </div>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Pemasukan Bulan Ini</p>
            <h2 className="text-4xl font-extrabold">{formatCurrency(monthlyIn)}</h2>
            <p className="mt-8 text-xs text-slate-400 leading-relaxed font-medium">Terdiri dari iuran rutin, donasi pembangunan, dan sponsorship kegiatan desa.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Pengeluaran Bulan Ini</p>
            <h2 className="text-4xl font-extrabold text-slate-900">{formatCurrency(monthlyOut)}</h2>
            <div className="mt-8 flex gap-2">
              <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">Fisik</span>
              <span className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Sosial</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-900 mb-10">Grafik Arus Kas 6 Bulan Terakhir</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeHistory}>
                <defs>
                  <linearGradient id="colorMasukPub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontWeight: 700, fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontWeight: 700, fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `Rp ${(value as number).toLocaleString('id-ID')}`}/>
                <Tooltip
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: any, name: string | undefined) => [`Rp ${value.toLocaleString('id-ID')}`, name === 'masuk' ? 'Pemasukan' : 'Pengeluaran']}
                  labelFormatter={(label) => `Bulan: ${label}`}
                />
                <Area type="monotone" dataKey="masuk" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorMasukPub)" />
                <Area type="monotone" dataKey="keluar" stroke="#ef4444" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicKeuangan;
