import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from 'react-router-dom'

import PublicHome from '../pages/PublicHome'
import PublicKepengurusan from '../pages/PublicKepengurusan'
import PublicKegiatan from '../pages/PublicKegiatan'
import PublicKegiatanDetail from '../pages/PublicKegiatanDetail'
import PublicDataWarga from '../pages/PublicDataWarga'
import PublicKeuangan from '../pages/PublicKeuangan'

import AdminDashboard from '../pages/AdminDashboard'
import AdminCMS from '../pages/AdminCMS'
import AdminResidents from '../pages/AdminResidents'
import AdminFinances from '../pages/AdminFinances'
import AdminKegiatan from '../pages/AdminKegiatan'
import AdminOrg from '../pages/AdminOrg'
import AdminLogin from '../pages/AdminLogin'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import WhatsAppFAB from '../components/WhatsAppFAB'

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <Router>
      <AppLayout
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <WhatsAppFAB />
    </Router>
  )
}

const AppLayout: React.FC<{
  isAuthenticated: boolean
  setIsAuthenticated: (val: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (val: boolean) => void
}> = ({
  isAuthenticated,
  setIsAuthenticated,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSetAuthenticated = (val: boolean) => {
    setIsAuthenticated(val)
    localStorage.setItem('isAuthenticated', val.toString())
  }

  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')
  const isLoginPage = location.pathname === '/admin/login'

  // =========================
  // ADMIN LAYOUT (protected)
  // =========================
  if (isAdminPath && !isLoginPage) {
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />

    return (
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar
          onLogout={() => handleSetAuthenticated(false)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              {/* penting: pakai wildcard + index route */}
              <Route path="/admin/*" element={<AdminRoutes />} />
              {/* fallback safety */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    )
  }

  // =========================
  // PUBLIC LAYOUT
  // =========================
  return (
    <div className="min-h-screen bg-white">
      {!isLoginPage && (
        <PublicNavigation
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      <main>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/kepengurusan" element={<PublicKepengurusan />} />
          <Route path="/kegiatan" element={<PublicKegiatan />} />
          <Route path="/kegiatan/:id" element={<PublicKegiatanDetail />} />
          <Route path="/data-warga" element={<PublicDataWarga />} />
          <Route path="/keuangan" element={<PublicKeuangan />} />

          <Route
            path="/admin/login"
            element={<AdminLogin onLogin={() => handleSetAuthenticated(true)} />}
          />

          {/* kalau ada yg akses /admin dari layout public */}
          <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isLoginPage && <PublicFooter />}
    </div>
  )
}

/**
 * ROUTES KHUSUS ADMIN (nested)
 * - index route untuk /admin dan /admin/
 * - child route untuk /admin/cms dst.
 * - fallback supaya tidak blank
 */
const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="cms" element={<AdminCMS />} />
      <Route path="residents" element={<AdminResidents />} />
      <Route path="finances" element={<AdminFinances />} />
      <Route path="kegiatan" element={<AdminKegiatan />} />
      <Route path="organization" element={<AdminOrg />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

const PublicNavigation: React.FC<{
  mobileMenuOpen: boolean
  setMobileMenuOpen: (val: boolean) => void
}> = ({ mobileMenuOpen, setMobileMenuOpen }) => (
  <>
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-12 w-12 rounded-2xl shadow-xl shadow-indigo-200"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-black leading-none text-slate-900 tracking-tight">
              RT 01 RW 21 Dukuhan Nayu
            </h1>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-600">
              Pemerintah Desa Banjarsari
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          <Link
            to="/"
            className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Beranda
          </Link>
          <Link
            to="/kepengurusan"
            className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Pengurus Rukun Tetangga
          </Link>
          <Link
            to="/kegiatan"
            className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Kabar Rukun Tetangga
          </Link>
          <Link
            to="/data-warga"
            className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Statistik
          </Link>
          <Link
            to="/keuangan"
            className="text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Kas Rukun Tetangga
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Sidebar */}
    {mobileMenuOpen && (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-full"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="p-6 space-y-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Beranda
            </Link>
            <Link
              to="/kepengurusan"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Pengurus Rukun Tetangga
            </Link>
            <Link
              to="/kegiatan"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Kabar Rukun Tetangga
            </Link>
            <Link
              to="/data-warga"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Statistik
            </Link>
            <Link
              to="/keuangan"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Kas Rukun Tetangga
            </Link>

            <div className="border-t border-slate-100 pt-4 mt-4" />
          </nav>
        </aside>
      </>
    )}
  </>
)

const PublicFooter: React.FC = () => (
  <footer className="bg-slate-900 text-slate-300 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="flex items-center gap-3 text-white">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-2xl" />
            <span className="text-3xl font-black tracking-tighter">
              RT 01 RW 21 Dukuhan Nayu
            </span>
          </div>
          <p className="text-slate-400 max-w-md text-lg leading-relaxed">
            Pusat informasi dan layanan digital terpadu Rukun Tetangga 01 di Dukuhan Nayu.
            Mewujudkan tata kelola yang transparan, akuntabel, dan berbasis teknologi.
          </p>
        </div>

        <div>
          <h3 className="text-white font-black mb-6 uppercase text-xs tracking-[0.2em]">
            Layanan Publik
          </h3>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <Link to="/kepengurusan" className="hover:text-indigo-400 transition-colors">
                Profil Pengurus Rukun Tetangga
              </Link>
            </li>
            <li>
              <Link to="/kegiatan" className="hover:text-indigo-400 transition-colors">
                Kabar Rukun Tetangga
              </Link>
            </li>
            <li>
              <Link to="/keuangan" className="hover:text-indigo-400 transition-colors">
                Transparansi Kas Rukun Tetangga
              </Link>
            </li>
            <li>
              <Link to="/data-warga" className="hover:text-indigo-400 transition-colors">
                Data Demografi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-black mb-6 uppercase text-xs tracking-[0.2em]">
            Kontak Kantor
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-indigo-500">location_on</span>
              Dukuhan Nayu, RT 01 RW 21, Banjarsari, Kec. Banjarsari, Kota Surakarta
            </li>
            <li className="flex gap-4 items-center">
              <span className="material-symbols-outlined text-indigo-500">mail</span>
              Dukuhannayu01@Dukuhannayu01.com
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <p>&copy; 2025 Dukuhan Nayu 01 - Hak Cipta Dilindungi.</p>
      </div>
    </div>
  </footer>
)

export default App
