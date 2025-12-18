
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-slate-900 font-bold">Dashboard Admin</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Selamat Datang, Pengurus Warga</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
          <img src="https://picsum.photos/32/32" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
