import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchActivities } from '../services/api';

interface Activity {
  id: number;
  title: string;
  date: string;
  loc: string;
  status: string;
  budget: string;
  img: string;
  excerpt: string;
}

const PublicKegiatan: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Informasi Terkini</span>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Kabar Rukun Tetangga </h1>
          <p className="text-lg text-slate-600 leading-relaxed">Pantau perkembangan pembangunan wilayah, berita terbaru, dan agenda penting secara transparan di sini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => navigate(`/kegiatan/${act.id}`)}
              className="group cursor-pointer bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                {act.img ? (
                  <img src={act.img} alt={act.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                  </div>
                )}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-indigo-700 shadow-sm">
                  {act.status}
                </div>
              </div>
              <div className="p-10">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{act.date}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">{act.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">{act.excerpt}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-200/50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span className="text-[10px] font-bold">{act.loc}</span>
                  </div>
                  <span className="material-symbols-outlined text-indigo-600 group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicKegiatan;
