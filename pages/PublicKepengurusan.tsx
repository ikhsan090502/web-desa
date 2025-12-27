import React, { useState, useEffect } from 'react';
import { fetchKepengurusan } from '../services/api';

interface Member {
  id: number;
  name: string;
  degree: string;
  role: string;
  period: string;
  img: string;
}

const PublicKepengurusan: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchKepengurusan();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching kepengurusan:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Pelayan Masyarakat</span>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Struktur Pengurus Rukun Tetangga</h1>
          <p className="text-lg text-slate-600 leading-relaxed">Susunan Pengurus Rukun Tetangga yang berdedikasi tinggi dalam mewujudkan pelayanan publik prima dan pembangunan berkelanjutan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {members.map((p) => (
            <div key={p.id} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 group hover:-translate-y-3 transition-all duration-500 border border-slate-100">
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
                <div className="absolute bottom-6 left-8">
                  <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {p.role}
                  </span>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                  {p.name}{p.degree ? `, ${p.degree}` : ''}
                </h3>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Masa Bakti: {p.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicKepengurusan;
