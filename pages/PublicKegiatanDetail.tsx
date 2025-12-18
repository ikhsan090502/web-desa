
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_ACTIVITIES } from './PublicKegiatan';

const PublicKegiatanDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mencari data secara dinamis berdasarkan ID dari URL
  const activity = useMemo(() => {
    return MOCK_ACTIVITIES.find(item => item.id === id);
  }, [id]);

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
        <h2 className="text-2xl font-black text-slate-900">Kabar Tidak Ditemukan</h2>
        <p className="text-slate-500 mt-2 mb-8">Maaf, informasi yang Anda cari mungkin telah dihapus atau dipindahkan.</p>
        <button onClick={() => navigate('/kegiatan')} className="px-8 py-3 bg-indigo-700 text-white font-bold rounded-2xl shadow-lg">Kembali ke Daftar</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Navigation */}
      <div className="border-b border-slate-100 bg-slate-50/50 sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <button 
            onClick={() => navigate('/kegiatan')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black uppercase text-[10px] tracking-widest transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Kabar Desa
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16">
        {/* 1. JUDUL & BADGES */}
        <div className="mb-10">
          <div className="flex gap-2 mb-6">
            <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              {activity.status}
            </span>
            <span className="px-4 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-widest">
              Dana Desa
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
            {activity.title}
          </h1>
          
          {/* 2. INFORMASI METADATA */}
          <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-100">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><span className="material-symbols-outlined text-lg">calendar_today</span></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Pelaksanaan</p>
                  <p className="text-sm font-bold text-slate-800">{activity.date}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><span className="material-symbols-outlined text-lg">location_on</span></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Lokasi</p>
                  <p className="text-sm font-bold text-slate-800">{activity.loc}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><span className="material-symbols-outlined text-lg">payments</span></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Anggaran</p>
                  <p className="text-sm font-bold text-slate-800">{activity.budget}</p>
                </div>
             </div>
          </div>
        </div>

        {/* 3. FOTO UTAMA */}
        <div className="mb-12">
          <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border-4 border-white ring-1 ring-slate-100">
             <img 
               src={activity.img} 
               className="w-full h-full object-cover" 
               alt={activity.title} 
             />
          </div>
          <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Dokumentasi Kegiatan Desa Harmoni</p>
        </div>

        {/* 4. DESKRIPSI LENGKAP */}
        <div className="prose prose-lg max-w-none">
          <div className="text-slate-600 font-medium leading-[2] text-lg">
            {activity.content.split('\n').map((para, i) => (
              para.trim() && <p key={i} className="mb-8">{para.trim()}</p>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-10 md:p-14 bg-indigo-900 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-indigo-200">
           <div className="max-w-md text-center md:text-left">
             <h4 className="text-2xl font-black mb-3">Transparansi Publik</h4>
             <p className="text-indigo-100 opacity-80 leading-relaxed font-medium">Informasi ini dipublikasikan sebagai bentuk keterbukaan informasi publik Pemerintah Desa. Jika ada ketidaksesuaian data, silakan lapor kepada admin.</p>
           </div>
           <div className="flex flex-col gap-3 w-full md:w-auto">
             <button className="px-10 py-4 bg-white text-indigo-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
               <span className="material-symbols-outlined">chat</span> Hubungi Admin
             </button>
             <button className="px-10 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-xs uppercase tracking-widest">
               Unduh Laporan PDF
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicKegiatanDetail;
