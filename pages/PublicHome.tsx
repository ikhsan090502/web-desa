
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PublicHome: React.FC = () => {
  const navigate = useNavigate();

  const activitiesPreview = [
    { id: 1, title: 'Pembangunan Drainase RT 02/05', date: '05 Nov 2024', cat: 'Pembangunan', img: 'https://picsum.photos/600/400?seed=build1' },
    { id: 2, title: 'Pelatihan UMKM Desa Harmoni', date: '30 Okt 2024', cat: 'Pelatihan', img: 'https://picsum.photos/600/400?seed=train1' },
    { id: 3, title: 'Posyandu Rutin Bulanan', date: '15 Okt 2024', cat: 'Kesehatan', img: 'https://picsum.photos/600/400?seed=health' },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-24 px-4 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Portal Resmi Organisasi Warga
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Membangun Komunitas yang <span className="text-blue-600">Transparan</span> & Harmonis
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Akses informasi resmi desa, pantau perkembangan kegiatan wilayah, dan lihat laporan pembangunan secara transparan.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/kegiatan')}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                >
                  Lihat Kabar Desa
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
                  src="https://picsum.photos/800/800?seed=village" 
                  alt="Desa Harmoni" 
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                  <span className="material-symbols-outlined">volunteer_activism</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Kesejahteraan</p>
                  <p className="font-extrabold text-slate-900">Program Desa Aktif</p>
                </div>
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
                Kami berkomitmen untuk menjadi organisasi warga percontohan yang mengedepankan kemajuan teknologi tanpa melupakan nilai-nilai kearifan lokal dan gotong royong.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-blue-600 font-bold">01.</div>
                  <p className="text-sm font-semibold text-slate-700">Meningkatkan transparansi administrasi dan keuangan warga.</p>
                </div>
                <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-blue-600 font-bold">02.</div>
                  <p className="text-sm font-semibold text-slate-700">Mempercepat distribusi informasi penting secara real-time.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">history</span>
                Sejarah Singkat
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "Didirikan pada tahun 1995, Organisasi Warga Desa Harmoni bermula dari sebuah inisiatif sederhana untuk merapikan pendataan kependudukan. Kini, kami terus bertransformasi menjadi komunitas digital yang dinamis..."
              </p>
              <button className="mt-8 text-blue-600 font-bold text-sm hover:underline">Baca Selengkapnya</button>
            </div>
          </div>
        </div>
      </section>

      {/* Kabar Desa Preview */}
      <section id="layanan" className="px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Kabar Desa Terbaru</h2>
              <p className="text-slate-500 mt-2">Laporan kegiatan dan progres pembangunan terkini</p>
            </div>
            <button 
                onClick={() => navigate('/kegiatan')}
                className="text-blue-600 font-bold hover:underline"
            >
                Lihat Semua Berita
            </button>
          </div>
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
                    {act.cat}
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
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
