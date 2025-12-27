import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchAllWarga, fetchAllKeuangan, fetchActivities } from '../services/api';

const AdminDashboard: React.FC = () => {
  const [residents, setResidents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [wargaData, keuanganData, kegiatanData] = await Promise.all([
          fetchAllWarga(),
          fetchAllKeuangan(),
          fetchActivities()
        ]);
        setResidents(wargaData);
        setTransactions(keuanganData);
        setActivities(kegiatanData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate real stats
  const totalWarga = residents.length;
  const monthlyIn = transactions.filter((t: any) => t.type === 'Masuk').reduce((acc: number, t: any) => acc + t.amount, 0);
  const monthlyOut = transactions.filter((t: any) => t.type === 'Keluar').reduce((acc: number, t: any) => acc + t.amount, 0);

  const stats = [
    { label: 'Total Warga', value: totalWarga.toString(), change: 'Terdata Aktif', icon: 'groups', color: 'blue' },
    { label: 'Permohonan Baru', value: '0', change: 'Tidak ada pending', icon: 'pending_actions', color: 'amber' },
    { label: 'Pemasukan (Bulan Ini)', value: `Rp ${monthlyIn.toLocaleString()}`, change: 'Bulan Terakhir', icon: 'payments', color: 'green' },
    { label: 'Aktivitas AI', value: activities.length.toString(), change: 'Konten teroptimasi', icon: 'auto_awesome', color: 'purple' },
  ];

  // Mock finance history (in real app, compute from transactions)
  const financeHistory = [
    { month: 'Jun', masuk: 15000000, keluar: 12000000 },
    { month: 'Jul', masuk: 18000000, keluar: 14000000 },
    { month: 'Aug', masuk: 20000000, keluar: 16000000 },
    { month: 'Sep', masuk: 22000000, keluar: 18000000 },
    { month: 'Oct', masuk: 25000000, keluar: 20000000 },
    { month: 'Nov', masuk: monthlyIn, keluar: monthlyOut },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Ringkasan Sistem</h1>
          <p className="text-sm text-slate-500 font-medium">Data dihitung otomatis dari database warga dan laporan keuangan Kas Rukun Tetangga</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">
            Unduh Laporan
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            Input Data Baru
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className="text-[10px] font-black uppercase text-indigo-400">
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-extrabold text-slate-900">Arus Kas Keuangan Desa</h3>
            <select className="text-[10px] font-black bg-slate-50 border-none rounded-lg focus:ring-indigo-200 uppercase tracking-widest px-4 py-2">
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeHistory}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                />
                <Area type="monotone" dataKey="masuk" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorMasuk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl text-white space-y-6">
          <h3 className="font-black text-sm uppercase tracking-[0.2em] opacity-50">Log Sistem Terkini</h3>
          <div className="space-y-6">
            {[
              { time: '2 Jam', task: 'Update Profil Desa', note: 'Sinkronisasi Visi Misi' },
              { time: '5 Jam', task: 'Input Warga Baru', note: 'RT 02 Dusun I' },
              { time: '1 Hari', task: 'Laporan Keuangan', note: 'Verifikasi iuran bulanan' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-1 h-10 bg-indigo-500 rounded-full shrink-0"></div>
                <div>
                  <p className="text-sm font-black text-white leading-tight">{log.task}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{log.note}</p>
                  <p className="text-[9px] font-black text-indigo-400 mt-2 uppercase">{log.time} yang lalu</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all mt-4">
            Lihat Log Lengkap
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
