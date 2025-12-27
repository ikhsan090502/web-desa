import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchAllKeuangan, createKeuangan, updateKeuangan, deleteKeuangan } from '../services/api';

const AdminFinances: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [filterType, setFilterType] = useState('Semua');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    tipe: 'Pemasukan',
    nominal: '',
    keterangan: '',
    kategori: 'Iuran',
    tanggal: new Date().toISOString().split('T')[0]
  });

  // Format number input with Indonesian separators
  const formatNumberInput = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    // Format with Indonesian locale
    return numericValue ? parseInt(numericValue).toLocaleString('id-ID') : '';
  };

  // Handle nominal input change
  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Keep only numbers
    setFormData({...formData, nominal: rawValue});
  };

  const COLORS = ['#2563eb', '#6366f1', '#10b981', '#f59e0b'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllKeuangan();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching keuangan:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTransactions = transactions.filter((t: any) => {
    const typeMatch = filterType === 'Semua' || t.tipe === filterType;
    const catMatch = filterCategory === 'Semua' || t.kategori === filterCategory;
    return typeMatch && catMatch;
  });

  // Compute total balance
  const totalBalance = transactions.reduce((acc: number, t: any) => {
    if (t.tipe === 'Pemasukan') return acc + t.nominal;
    if (t.tipe === 'Pengeluaran') return acc - t.nominal;
    return acc;
  }, 0);

  // Compute monthly in/out
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyIn = transactions.filter((t: any) => t.tipe === 'Pemasukan' && t.tanggal.startsWith(currentMonth)).reduce((acc: number, t: any) => acc + t.nominal, 0);
  const monthlyOut = transactions.filter((t: any) => t.tipe === 'Pengeluaran' && t.tanggal.startsWith(currentMonth)).reduce((acc: number, t: any) => acc + t.nominal, 0);

  // Compute pie chart data
  const categoryTotals: { [key: string]: number } = {};
  transactions.filter((t: any) => t.tipe === 'Pengeluaran').forEach((t: any) => {
    categoryTotals[t.kategori] = (categoryTotals[t.kategori] || 0) + t.nominal;
  });
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  // Format currency function
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleEdit = (trx: any) => {
    setFormData({
      tipe: trx.tipe,
      nominal: trx.nominal.toString(),
      keterangan: trx.keterangan,
      kategori: trx.kategori,
      tanggal: trx.tanggal
    });
    setEditingId(trx.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        tipe: formData.tipe,
        nominal: parseFloat(formData.nominal),
        keterangan: formData.keterangan,
        kategori: formData.kategori,
        tanggal: formData.tanggal
      };
      if (editingId) {
        await updateKeuangan(editingId.toString(), data);
        setTransactions(transactions.map((t: any) => t.id === editingId ? { ...t, ...data } : t));
      } else {
        const result = await createKeuangan(data);
        setTransactions([...transactions, { id: result.id, ...data }]);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({
        tipe: 'Pemasukan',
        nominal: '',
        keterangan: '',
        kategori: 'Iuran',
        tanggal: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await deleteKeuangan(id.toString());
        setTransactions(transactions.filter((t: any) => t.id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Keuangan</h1>
          <p className="text-sm text-slate-500">Transparansi arus kas dan audit dana warga.</p>
        </div>
        <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ tipe: 'Pemasukan', nominal: '', keterangan: '', kategori: 'Iuran', tanggal: new Date().toISOString().split('T')[0] }); }} className="px-6 py-3 bg-green-600 text-white font-bold rounded-2xl text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">add_circle</span> Input Transaksi
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tipe</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 focus:ring-blue-200 w-40"
            >
              <option>Semua</option>
              <option>Pemasukan</option>
              <option>Pengeluaran</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Kategori</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-3 focus:ring-blue-200 w-40"
            >
              <option>Semua</option>
              <option>Iuran</option>
              <option>Infrastruktur</option>
              <option>Donasi</option>
              <option>Operasional</option>
            </select>
          </div>
          <button className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-all">
            Reset Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Keterangan</th>
                <th className="px-8 py-4">Kategori</th>
                <th className="px-8 py-4">Tipe</th>
                <th className="px-8 py-4 text-right">Nominal</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredTransactions.map((trx: any) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900">{trx.keterangan}</p>
                    <p className="text-[10px] text-slate-400">{trx.tanggal}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-semibold text-slate-500">{trx.kategori}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${trx.tipe === 'Pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {trx.tipe}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-extrabold text-slate-900">
                    {trx.tipe === 'Pengeluaran' && '- '}{formatCurrency(trx.nominal)}
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(trx)} className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button onClick={() => handleDelete(trx.id)} className="h-9 w-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p className="text-sm font-bold">Tidak ada data transaksi yang sesuai.</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
             <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Saldo Total</p>
             <h2 className="text-3xl font-extrabold">{formatCurrency(totalBalance)}</h2>
             <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
               <div>
                 <p className="text-[10px] font-bold uppercase opacity-50">In (Bulan ini)</p>
                 <p className="text-sm font-extrabold text-green-400">+{monthlyIn.toLocaleString('id-ID')}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-bold uppercase opacity-50">Out (Bulan ini)</p>
                 <p className="text-sm font-extrabold text-red-400">-{monthlyOut.toLocaleString('id-ID')}</p>
               </div>
             </div>
           </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-6">Distribusi Pengeluaran</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-900">{editingId ? 'Edit Transaksi' : 'Input Transaksi Baru'}</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tipe Transaksi</label>
                  <select value={formData.tipe} onChange={e => setFormData({...formData, tipe: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50">
                    <option>Pemasukan</option>
                    <option>Pengeluaran</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nominal (Rp)</label>
                  <input required type="text" value={formatNumberInput(formData.nominal)} onChange={handleNominalChange} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Keterangan</label>
                <input required value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="Contoh: Iuran bulanan warga" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kategori</label>
                  <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50">
                    <option>Iuran</option>
                    <option>Infrastruktur</option>
                    <option>Donasi</option>
                    <option>Operasional</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tanggal</label>
                  <input required type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" />
                </div>
              </div>
              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-xs">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all">{editingId ? 'Update Transaksi' : 'Simpan Transaksi'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinances;
