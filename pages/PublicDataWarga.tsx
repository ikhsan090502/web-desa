
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const PublicDataWarga: React.FC = () => {
  const ageData = [
    { name: 'Anak-anak', value: 240, color: '#60a5fa' },
    { name: 'Remaja', value: 380, color: '#3b82f6' },
    { name: 'Dewasa', value: 520, color: '#2563eb' },
    { name: 'Lansia', value: 100, color: '#1d4ed8' },
  ];

  const genderData = [
    { name: 'Laki-laki', value: 640 },
    { name: 'Perempuan', value: 600 },
  ];

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Statistik Kependudukan</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Informasi demografi wilayah yang disajikan secara anonim demi menjaga privasi warga.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
            <span className="material-symbols-outlined text-4xl text-blue-600 mb-4">groups</span>
            <p className="text-slate-500 font-bold text-sm uppercase">Total Warga</p>
            <h2 className="text-5xl font-extrabold text-slate-900 mt-2">1,240</h2>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
            <span className="material-symbols-outlined text-4xl text-green-500 mb-4">family_restroom</span>
            <p className="text-slate-500 font-bold text-sm uppercase">Total KK</p>
            <h2 className="text-5xl font-extrabold text-slate-900 mt-2">315</h2>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
            <span className="material-symbols-outlined text-4xl text-amber-500 mb-4">home</span>
            <p className="text-slate-500 font-bold text-sm uppercase">Kepadatan</p>
            <h2 className="text-5xl font-extrabold text-slate-900 mt-2">12/ha</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600">cake</span>
              Komposisi Usia
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600">diversity_3</span>
              Distribusi Gender
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f472b6" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDataWarga;
