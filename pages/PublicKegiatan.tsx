
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Data ini disimulasikan sebagai database pusat kegiatan
export const MOCK_ACTIVITIES = [
  { 
    id: '1', 
    title: 'Pembangunan Drainase RT 02/05', 
    date: '05 Nov 2024', 
    loc: 'Dusun I - Jl. Melati', 
    status: 'Rencana', 
    budget: 'Rp 45.000.000', 
    img: 'https://picsum.photos/1200/800?seed=build1',
    excerpt: 'Kegiatan ini merupakan bagian dari program percepatan infrastruktur desa tahun 2024...',
    content: 'Pemerintah Desa Harmoni secara resmi mengumumkan dimulainya proyek pembangunan drainase baru di wilayah Dusun I, tepatnya di sepanjang Jalan Melati RT 02/05. Proyek ini merupakan salah satu prioritas pembangunan fisik dalam APBDes tahun 2024.\n\nPembangunan drainase ini direncanakan memiliki panjang total 200 meter dengan konstruksi beton bertulang yang kokoh. Tujuan utama dari pembangunan ini adalah untuk memperbaiki sistem pembuangan air warga yang selama ini sering tersumbat saat hujan lebat turun.\n\nBapak Kepala Desa menyampaikan bahwa pengerjaan akan melibatkan tenaga kerja lokal sebagai bagian dari program Padat Karya Tunai Desa (PKTD).'
  },
  { 
    id: '2', 
    title: 'Pelatihan UMKM Desa Harmoni', 
    date: '30 Okt 2024', 
    loc: 'Aula Kantor Desa', 
    status: 'Proses', 
    budget: 'Rp 5.500.000', 
    img: 'https://picsum.photos/1200/800?seed=train1',
    excerpt: 'Pemerintah desa memfasilitasi 50 pelaku UMKM lokal untuk mendapatkan pelatihan pemasaran...',
    content: 'Dalam rangka meningkatkan daya saing produk lokal, Pemerintah Desa Harmoni menyelenggarakan pelatihan pemasaran digital bagi pelaku UMKM. Pelatihan ini menghadirkan narasumber ahli di bidang e-commerce.\n\nSebanyak 50 peserta dari berbagai unit usaha seperti kuliner, kerajinan, dan fashion turut hadir dengan antusias. Diharapkan setelah pelatihan ini, produk desa dapat dikenal lebih luas di pasar nasional melalui platform digital.'
  },
  { 
    id: '3', 
    title: 'Posyandu Balita & Lansia Rutin', 
    date: '15 Okt 2024', 
    loc: 'Kantor Posyandu', 
    status: 'Selesai', 
    budget: 'Rp 1.500.000', 
    img: 'https://picsum.photos/1200/800?seed=health',
    excerpt: 'Kegiatan rutin bulanan untuk menjamin kesehatan generasi desa dan orang tua kita...',
    content: 'Layanan kesehatan gratis melalui Posyandu kembali dilaksanakan di balai RW. Fokus kegiatan bulan ini adalah pemantauan gizi balita dan pemeriksaan tekanan darah bagi lansia.\n\nKesadaran warga akan kesehatan keluarga terus meningkat, terbukti dengan jumlah kehadiran yang mencapai 95% dari target. Stok vitamin dan makanan tambahan juga telah didistribusikan secara merata kepada peserta.'
  },
];

const PublicKegiatan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Informasi Terkini</span>
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Kabar Desa Harmoni</h1>
          <p className="text-lg text-slate-600 leading-relaxed">Pantau perkembangan pembangunan wilayah, berita terbaru, dan agenda penting secara transparan di sini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {MOCK_ACTIVITIES.map((act) => (
            <div 
              key={act.id} 
              onClick={() => navigate(`/kegiatan/${act.id}`)}
              className="group cursor-pointer bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={act.img} alt={act.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
