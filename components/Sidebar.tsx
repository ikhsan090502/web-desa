
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen = false, onClose }) => {
  const menuItems = [
    { icon: 'dashboard', label: 'Ringkasan', path: '/admin' },
    { icon: 'groups', label: 'Data Warga', path: '/admin/residents' },
    { icon: 'account_tree', label: 'Kelola Pengurus', path: '/admin/organization' },
    { icon: 'event_available', label: 'Manajemen Kegiatan', path: '/admin/kegiatan' },
    { icon: 'account_balance_wallet', label: 'Keuangan', path: '/admin/finances' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`w-72 bg-white border-r border-slate-200 flex flex-col fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } lg:flex`}>
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 rounded-2xl p-2.5 shadow-xl shadow-blue-100 text-white">
              <span className="material-symbols-outlined text-2xl">shield_person</span>
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 tracking-tight leading-none">Admin Portal</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SI-WARGA v1.0</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={onClose} // Close sidebar on mobile after navigation
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xl shadow-blue-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100">
          <button
            onClick={() => {
              onLogout?.();
              onClose?.();
            }}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-all duration-300"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
