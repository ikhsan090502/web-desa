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
  category?: string;
}

const PublicHome: React.FC = () => {
  const navigate = useNavigate();
  const [activitiesPreview, setActivitiesPreview] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchActivities();
        setActivitiesPreview(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-24 px-4 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Portal Resmi Pemerintah Desa
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Membangun Komunitas yang <span className="text-blue-600">Transparan</span> & Harmonis
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Akses informasi resmi desa, pantau perkembangan kegiatan wilayah, dan lihat laporan pembangunan secara transparan melalui sistem digital terpadu.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/kegiatan')}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                >
                  Lihat Kabar Rukun Tetangga
                </button>
                <button
                  onClick={() => navigate('/keuangan')}
                  className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Transparansi Dana
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-[3rem] bg-slate-100 overflow-hidden shadow-2xl rotate-3">
                <img
                  src="/17 agustus.jpeg"
                  alt="Desa Banjarsari"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">

              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Profil & Visi Section */}
      <section id="profil" className="bg-slate-50 py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-slate-900">Visi & Misi Kami</h2>
              <p className="text-slate-600 leading-relaxed">
                Kami berkomitmen untuk menjadi organisasi warga percontohan yang mengedepankan kemajuan teknologi tanpa melupakan nilai-nilai kearifan lokal dan gotong royong demi kesejahteraan seluruh elemen masyarakat.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-blue-600 font-bold">01.</div>
                  <p className="text-sm font-semibold text-slate-700">Meningkatkan transparansi administrasi dan tata kelola keuangan Kas Rukun Tetangga.</p>
                </div>
                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-blue-600 font-bold">02.</div>
                  <p className="text-sm font-semibold text-slate-700">Mempercepat distribusi informasi penting melalui kanal digital terintegrasi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kabar Desa Preview */}
      <section id="layanan" className="px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Kabar Rukun Tetangga Terbaru</h2>
              <p className="text-slate-500 mt-2">Laporan kegiatan dan progres pembangunan terkini yang sedang berjalan.</p>
            </div>
            <button
                onClick={() => navigate('/kegiatan')}
                className="text-blue-600 font-bold hover:underline"
            >
                Lihat Semua Berita
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Memuat kabar ...</p>
            </div>
          ) : activitiesPreview.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {activitiesPreview.map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigate(`/kegiatan/${act.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[16/9] bg-slate-100 rounded-3xl overflow-hidden mb-4 relative shadow-md">
                    <img src={act.img} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-bold text-blue-600 uppercase">
                      {act.category || act.status}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {act.title}
                  </h4>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{act.date}</span>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600">arrow_right_alt</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">article</span>
              <p className="text-slate-500">Belum ada kabar Rukun Tetangga terkini.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
