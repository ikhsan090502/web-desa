
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import PublicKepengurusan from './pages/PublicKepengurusan';
import PublicKegiatan from './pages/PublicKegiatan';
import PublicKegiatanDetail from './pages/PublicKegiatanDetail'; // Import baru
import PublicDataWarga from './pages/PublicDataWarga';
import PublicKeuangan from './pages/PublicKeuangan';
import AdminDashboard from './pages/AdminDashboard';
import AdminCMS from './pages/AdminCMS';
import AdminResidents from './pages/AdminResidents';
import AdminFinances from './pages/AdminFinances';
import AdminKegiatan from './pages/AdminKegiatan';
import AdminOrg from './pages/AdminOrg';
import AdminLogin from './pages/AdminLogin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WhatsAppFAB from './components/WhatsAppFAB';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <AppLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <WhatsAppFAB />
    </Router>
  );
};

const AppLayout: React.FC<{ isAuthenticated: boolean; setIsAuthenticated: (val: boolean) => void }> = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  if (isAdminPath && !isLoginPage) {
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar onLogout={() => setIsAuthenticated(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/cms" element={<AdminCMS />} />
              <Route path="/admin/residents" element={<AdminResidents />} />
              <Route path="/admin/finances" element={<AdminFinances />} />
              <Route path="/admin/kegiatan" element={<AdminKegiatan />} />
              <Route path="/admin/organization" element={<AdminOrg />} />
            </Routes>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {!isLoginPage && <PublicNavigation />}
      <main>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/kepengurusan" element={<PublicKepengurusan />} />
          <Route path="/kegiatan" element={<PublicKegiatan />} />
          <Route path="/kegiatan/:id" element={<PublicKegiatanDetail />} />
          <Route path="/data-warga" element={<PublicDataWarga />} />
          <Route path="/keuangan" element={<PublicKeuangan />} />
          <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAuthenticated(true)} />} />
        </Routes>
      </main>
      {!isLoginPage && <PublicFooter />}
    </div>
  );
};

const PublicNavigation: React.FC = () => (
  <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-2xl shadow-xl shadow-indigo-200" />
        <div className="flex flex-col">
          <h1 className="text-xl font-black leading-none text-slate-900 tracking-tight">RT 01 RW 21 Dukuhan Nayu</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-600">Pemerintah Desa Banjarsari</span>
        </div>
      </Link>
      <nav className="hidden lg:flex items-center gap-10">
        <Link to="/" className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors">Beranda</Link>
        <Link to="/kepengurusan" className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors">Pengurus Rukun Tetangga</Link>
        <Link to="/kegiatan" className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors">Kabar Rukun Tetangga</Link>
        <Link to="/data-warga" className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors">Statistik</Link>
        <Link to="/keuangan" className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors">Kas Rukun Tetangga</Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link 
          to="/admin/login" 
          className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-900 transition-all active:scale-95"
        >
          Portal Internal
        </Link>
      </div>
    </div>
  </header>
);

const PublicFooter: React.FC = () => (
  <footer className="bg-slate-900 text-slate-300 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="flex items-center gap-3 text-white">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-2xl" />
            <span className="text-3xl font-black tracking-tighter">RT 01 RW 21 Dukuhan Nayu</span>
          </div>
          <p className="text-slate-400 max-w-md text-lg leading-relaxed">
            Pusat informasi dan layanan digital terpadu Rukun Tetangga 01 di Dukuhan Nayu. Mewujudkan tata kelola yang transparan, akuntabel, dan berbasis teknologi.
          </p>
        </div>
        <div>
          <h3 className="text-white font-black mb-6 uppercase text-xs tracking-[0.2em]">Layanan Publik</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/kepengurusan" className="hover:text-indigo-400 transition-colors">Profil Pengurus Rukun Tetangga</Link></li>
            <li><Link to="/kegiatan" className="hover:text-indigo-400 transition-colors">Kabar Rukun Tetangga</Link></li>
            <li><Link to="/keuangan" className="hover:text-indigo-400 transition-colors">Transparansi Kas Rukun Tetangga</Link></li>
            <li><Link to="/data-warga" className="hover:text-indigo-400 transition-colors">Data Demografi</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-black mb-6 uppercase text-xs tracking-[0.2em]">Kontak Kantor</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-4 items-start"><span className="material-symbols-outlined text-indigo-500">location_on</span> Jl. Raya Desa Harmoni No. 01, Kec. Mandiri, Kab. Sejahtera</li>
            <li className="flex gap-4 items-center"><span className="material-symbols-outlined text-indigo-500">mail</span> pemdes@harmoni.desa.id</li>
          </ul>
        </div>
      </div>
      <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <p>&copy; 2025 Dahayu - Hak Cipta Dilindungi.</p>
      </div>
    </div>
  </footer>
);

export default App;
