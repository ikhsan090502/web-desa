
import React from 'react';

const PublicKegiatan: React.FC = () => {
  const kegiatan = [
    { title: 'Gotong Royong Kebersihan Saluran', date: '20 Okt 2024', desc: 'Pembersihan saluran air massal untuk mencegah banjir di musim penghujan.', img: 'https://picsum.photos/800/600?seed=1' },
    { title: 'Senam Sehat Warga Harmoni', date: '15 Okt 2024', desc: 'Kegiatan rutin mingguan untuk meningkatkan kesehatan dan silaturahmi antar warga.', img: 'https://picsum.photos/800/600?seed=2' },
    { title: 'Pelatihan Pemilahan Sampah', date: '10 Okt 2024', desc: 'Edukasi pengolahan sampah rumah tangga menjadi pupuk organik bersama dinas terkait.', img: 'https://picsum.photos/800/600?seed=3' },
    { title: 'Posyandu Balita & Lansia', date: '05 Okt 2024', desc: 'Pemeriksaan rutin berkala untuk menjamin kesehatan generasi masa depan dan orang tua.', img: 'https://picsum.photos/800/600?seed=4' },
  ];

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Agenda & Dokumentasi</h1>
            <p className="text-lg text-slate-600">Catatan jejak kegiatan dan rencana aksi pembangunan wilayah kami.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm">Terbaru</button>
            <button className="px-6 py-2 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm">Arsip</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {kegiatan.map((k, idx) => (
            <div key={idx} className="flex flex-col gap-6 group">
              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 relative">
                <img src={k.img} alt={k.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                  {k.date}
                </div>
              </div>
              <div className="px-2">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{k.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{k.desc}</p>
                <button className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-4 transition-all">
                  Lihat Dokumentasi Lengkap <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicKegiatan;
