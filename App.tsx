
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import PublicKepengurusan from './pages/PublicKepengurusan';
import PublicKegiatan from './pages/PublicKegiatan';
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
  <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          <span className="material-symbols-outlined">corporate_fare</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-none text-slate-900">SI-WARGA</h1>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Harmoni Village</span>
        </div>
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Beranda</Link>
        <Link to="/kepengurusan" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Kepengurusan</Link>
        <Link to="/kegiatan" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Kegiatan</Link>
        <Link to="/data-warga" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Data Warga</Link>
        <Link to="/keuangan" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Keuangan</Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link 
          to="/admin" 
          className="rounded-full bg-slate-900 px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all active:scale-95"
        >
          Admin
        </Link>
      </div>
    </div>
  </header>
);

const PublicFooter: React.FC = () => (
  <footer className="bg-slate-900 text-slate-300 py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-blue-500 text-3xl">corporate_fare</span>
            <span className="text-2xl font-bold">SI-WARGA</span>
          </div>
          <p className="text-slate-400 max-w-md leading-relaxed">
            Sistem informasi resmi yang didedikasikan untuk transparansi, efisiensi administrasi, dan pemberdayaan komunitas di wilayah Desa Harmoni.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Akses Cepat</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/kepengurusan" className="hover:text-blue-400 transition-colors">Struktur Organisasi</Link></li>
            <li><Link to="/kegiatan" className="hover:text-blue-400 transition-colors">Agenda Kegiatan</Link></li>
            <li><Link to="/keuangan" className="hover:text-blue-400 transition-colors">Transparansi Dana</Link></li>
            <li><Link to="/data-warga" className="hover:text-blue-400 transition-colors">Statistik Wilayah</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Kontak Resmi</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><span className="material-symbols-outlined text-blue-500">location_on</span> Jl. Harmoni No. 01, RW 05</li>
            <li className="flex gap-3"><span className="material-symbols-outlined text-blue-500">mail</span> sekretariat@harmoni.id</li>
            <li className="flex gap-3"><span className="material-symbols-outlined text-blue-500">phone</span> +62 812 3456 7890</li>
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>&copy; 2024 SI-WARGA - Sistem Informasi Organisasi Warga Terpadu.</p>
      </div>
    </div>
  </footer>
);

export default App;
