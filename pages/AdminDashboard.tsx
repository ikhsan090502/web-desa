
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Warga', value: '1,240', change: '+2.1%', icon: 'groups', color: 'blue' },
    { label: 'Permohonan Baru', value: '12', change: '+5 hari ini', icon: 'pending_actions', color: 'amber' },
    { label: 'Realisasi Anggaran', value: '45%', change: 'FY 2024', icon: 'payments', color: 'green' },
    { label: 'Aktivitas AI', value: '156', change: 'Konten teroptimasi', icon: 'auto_awesome', color: 'purple' },
  ];

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Ringkasan Sistem</h1>
          <p className="text-sm text-slate-500">Pantau performa dan data wilayah secara real-time.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">
            Unduh Laporan
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
            Pengajuan Baru
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className={`text-xs font-bold ${stat.change.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-extrabold text-slate-900">Pertumbuhan Kependudukan</h3>
            <select className="text-xs font-bold bg-slate-50 border-none rounded-lg focus:ring-blue-200">
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900">Aktivitas Terkini</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-1 h-10 bg-blue-100 rounded-full shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 w-full bg-blue-600 h-4"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Update Profil Organisasi</p>
                  <p className="text-xs text-slate-500 mt-1">Admin menyunting bagian visi misi dibantu AI.</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">2 jam yang lalu</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-2xl text-sm hover:bg-slate-100 transition-all">
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
