
import React from 'react';

const PublicKepengurusan: React.FC = () => {
  const pengurus = [
    { name: 'Ahmad Subarjo', degree: 'Ir., M.Si', role: 'Ketua RW', period: '2023 - 2026', img: 'https://i.pravatar.cc/300?u=1' },
    { name: 'Siti Rahmawati', degree: 'M.Pd', role: 'Sekretaris', period: '2023 - 2026', img: 'https://i.pravatar.cc/300?u=2' },
    { name: 'H. Mansyur Ali', degree: '', role: 'Bendahara', period: '2023 - 2026', img: 'https://i.pravatar.cc/300?u=3' },
    { name: 'Budi Hartono', degree: 'S.H.', role: 'Seksi Keamanan', period: '2023 - 2026', img: 'https://i.pravatar.cc/300?u=4' },
    { name: 'Linda Wijaya', degree: 'Dr.', role: 'Seksi Kesehatan', period: '2023 - 2026', img: 'https://i.pravatar.cc/300?u=5' },
    { name: 'Eko Prasetyo', degree: 'S.T.', role: 'Seksi Pembangunan', period: '2023 - 2026', img: 'https://i.pravatar.cc/300?u=6' },
  ];

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Struktur Kepengurusan</h1>
          <p className="text-lg text-slate-600">Dedikasi pengurus wilayah untuk melayani warga dengan transparansi dan akuntabilitas tinggi.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {pengurus.map((p, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 group hover:-translate-y-2 transition-all duration-300 border border-slate-100">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-10 text-center">
                <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">{p.role}</p>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  {p.name}{p.degree ? `, ${p.degree}` : ''}
                </h3>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-extrabold text-slate-400">
                  <span className="material-symbols-outlined text-xs">calendar_today</span>
                  Masa Bakti: {p.period}
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
