import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { fetchAllWarga, fetchLastUpdateWarga } from '../services/api';

const PublicDataWarga: React.FC = () => {
  const [residents, setResidents] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [wargaData, updateData] = await Promise.all([
          fetchAllWarga(),
          fetchLastUpdateWarga()
        ]);
        if (Array.isArray(wargaData)) {
          setResidents(wargaData);
        } else {
          console.error('Invalid warga data:', wargaData);
          setResidents([]);
        }
        if (updateData && updateData.lastUpdate) {
          const date = new Date(updateData.lastUpdate);
          const month = date.toLocaleString('id-ID', { month: 'short' });
          const year = date.getFullYear();
          setLastUpdate(`${month} ${year}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setResidents([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalWarga = residents.length;
  const totalKK = Math.ceil(totalWarga / 4); // Simulasi perhitungan KK

  // Compute age data (simplified, assuming age ranges)
  const ageData = [
    { name: '0-17', value: Math.floor(totalWarga * 0.25), color: '#3b82f6' },
    { name: '18-35', value: Math.floor(totalWarga * 0.35), color: '#10b981' },
    { name: '36-55', value: Math.floor(totalWarga * 0.25), color: '#f59e0b' },
    { name: '56+', value: Math.floor(totalWarga * 0.15), color: '#ef4444' },
  ];

  // Compute gender data
  const maleCount = residents.filter((r: any) => r.jenis_kelamin === 'L').length;
  const femaleCount = residents.filter((r: any) => r.jenis_kelamin === 'P').length;
  const genderData = [
    { name: 'Laki-laki', value: maleCount },
    { name: 'Perempuan', value: femaleCount },
  ];

  if (loading) return <div>Loading...</div>;

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
             <p className="text-slate-500 font-bold text-sm uppercase">Total Warga Terdata</p>
             <h2 className="text-5xl font-extrabold text-slate-900 mt-2">{totalWarga.toLocaleString()}</h2>
           </div>
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
             <span className="material-symbols-outlined text-4xl text-green-500 mb-4">family_restroom</span>
             <p className="text-slate-500 font-bold text-sm uppercase">Estimasi Kepala Keluarga</p>
             <h2 className="text-5xl font-extrabold text-slate-900 mt-2">{totalKK.toLocaleString()}</h2>
           </div>
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center">
             <span className="material-symbols-outlined text-4xl text-amber-500 mb-4">home</span>
             <p className="text-slate-500 font-bold text-sm uppercase">Update Terakhir</p>
             <h2 className="text-2xl font-extrabold text-slate-900 mt-2">{lastUpdate || 'Loading...'}</h2>
           </div>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600">cake</span>
              Komposisi Usia
            </h3>
            <div className="h-80 w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
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
            <div className="h-80 w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={320}>
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
