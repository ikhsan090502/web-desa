import React, { useState, useEffect } from 'react';
import { fetchAllWarga, createWarga, updateWarga, deleteWarga } from '../services/api';


interface Resident {
  id: number;
  no: number;
  nama_lengkap: string;
  tgl_lahir: string | null;
  usia: number | null;
  jenis_kelamin: string;
  status: string;
  jml: number;
  notes: string;
}

const AdminResidents: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    dukuh: 'Dukuhan Nayu',
    rt: '01',
    rw: '21',
    kelurahan: 'Banjarsari',
    kecamatan: 'Banjarsari',
    kota: 'Surakarta',
    period: '2021-09',
    no: '',
    nama_lengkap: '',
    tgl_lahir: '',
    usia: '',
    jenis_kelamin: 'L',
    status: 'KK',
    jml: '',
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllWarga();
        if (Array.isArray(data)) {
          setResidents(data.map(d => ({
            id: d.id,
            no: d.id,
            nama_lengkap: d.nama_lengkap,
            tgl_lahir: d.tanggal_lahir ? new Date(d.tanggal_lahir).toISOString().split('T')[0] : null,
            usia: d.tanggal_lahir ? Math.floor((new Date().getTime() - new Date(d.tanggal_lahir).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
            jenis_kelamin: d.jenis_kelamin,
            status: d.status_warga,
            jml: 1,
            notes: d.alamat_lengkap
          })));
        } else {
          console.error('Invalid warga data:', data);
          setResidents([]);
        }
      } catch (error) {
        console.error('Error fetching warga:', error);
        setResidents([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredResidents = residents.filter(r => r.nama_lengkap.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredResidents.length / pageSize);
  const paginatedResidents = filteredResidents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleEdit = (resident: Resident) => {
    setFormData({
      dukuh: 'Dukuhan Nayu',
      rt: '01',
      rw: '21',
      kelurahan: 'Banjarsari',
      kecamatan: 'Banjarsari',
      kota: 'Surakarta',
      period: '2021-09',
      no: resident.no.toString(),
      nama_lengkap: resident.nama_lengkap,
      tgl_lahir: resident.tgl_lahir || '',
      usia: resident.usia?.toString() || '',
      jenis_kelamin: resident.jenis_kelamin,
      status: resident.status,
      jml: resident.jml.toString(),
      notes: resident.notes
    });
    setEditingId(resident.id);
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        nik: null,
        kk: parseInt(formData.no),
        nama_lengkap: formData.nama_lengkap,
        jenis_kelamin: formData.jenis_kelamin,
        kategori: 'Warga Tetap',
        dusun: formData.dukuh,
        rw: formData.rw,
        rt: formData.rt,
        status: formData.status,
        tempat_lahir: null,
        tanggal_lahir: formData.tgl_lahir,
        agama: 'Islam',
        pekerjaan: 'Warga',
        alamat_lengkap: formData.notes
      };
      if (editingId) {
        await updateWarga(editingId.toString(), data);
        setResidents(residents.map(r => r.id === editingId ? { ...r, no: parseInt(formData.no), nama_lengkap: formData.nama_lengkap, tgl_lahir: formData.tgl_lahir, usia: formData.usia ? parseInt(formData.usia) : null, jenis_kelamin: formData.jenis_kelamin, status: formData.status, jml: parseInt(formData.jml), notes: formData.notes } : r));
      } else {
        const result = await createWarga(data);
        setResidents([...residents, { id: result.id, no: parseInt(formData.no), nama_lengkap: formData.nama_lengkap, tgl_lahir: formData.tgl_lahir, usia: formData.usia ? parseInt(formData.usia) : null, jenis_kelamin: formData.jenis_kelamin, status: formData.status, jml: parseInt(formData.jml), notes: formData.notes }]);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({
        dukuh: 'Dukuhan Nayu',
        rt: '01',
        rw: '21',
        kelurahan: 'Banjarsari',
        kecamatan: 'Banjarsari',
        kota: 'Surakarta',
        period: '2021-09',
        no: '',
        nama_lengkap: '',
        tgl_lahir: '',
        usia: '',
        jenis_kelamin: 'L',
        status: 'KK',
        jml: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving warga:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus warga ini?')) {
      try {
        await deleteWarga(id.toString());
        setResidents(residents.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting warga:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Database Kependudukan</h1>
          <p className="text-sm text-slate-500 font-medium">Data Terpadu Warga Desa Banjarsari (Pusat Data Kependudukan)</p>
        </div>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({
            dukuh: 'Dukuhan Nayu',
            rt: '01',
            rw: '21',
            kelurahan: 'Banjarsari',
            kecamatan: 'Banjarsari',
            kota: 'Surakarta',
            period: '2021-09',
            no: '',
            nama_lengkap: '',
            tgl_lahir: '',
            usia: '',
            jenis_kelamin: 'L',
            status: 'KK',
            jml: '',
            notes: ''
          }); }}
          className="px-6 py-3 bg-indigo-700 text-white font-bold rounded-2xl text-sm hover:bg-indigo-800 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Daftar Warga Baru
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-slate-900">{editingId ? 'Edit Data Warga' : 'Formulir Pendaftaran Warga'}</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSave} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">No</label>
                  <input required value={formData.no} onChange={e => setFormData({...formData, no: e.target.value})} type="number" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="No" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Lengkap</label>
                  <input required value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value.toUpperCase()})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="NAMA LENGKAP" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tgl Lahir</label>
                  <input required value={formData.tgl_lahir} onChange={e => setFormData({...formData, tgl_lahir: e.target.value})} type="date" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Usia</label>
                  <input required value={formData.usia} onChange={e => setFormData({...formData, usia: e.target.value})} type="number" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="Usia" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Jenis Kelamin</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setFormData({...formData, jenis_kelamin: 'L'})} className={`flex-1 py-3 rounded-xl font-bold text-sm ${formData.jenis_kelamin === 'L' ? 'bg-indigo-700 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>Laki-laki</button>
                    <button type="button" onClick={() => setFormData({...formData, jenis_kelamin: 'P'})} className={`flex-1 py-3 rounded-xl font-bold text-sm ${formData.jenis_kelamin === 'P' ? 'bg-indigo-700 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>Perempuan</button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50">
                    <option>KK</option>
                    <option>ISTRI</option>
                    <option>ANAK</option>
                    <option>FAMILI LAIN</option>
                    <option>ORANG TUA</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Jml</label>
                  <input required value={formData.jml} onChange={e => setFormData({...formData, jml: e.target.value})} type="number" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="Jml" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Notes</label>
                  <input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold focus:ring-4 focus:ring-indigo-50" placeholder="Notes" />
                </div>
                <div className="pt-6 flex gap-3">
                   <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-xs">Batal</button>
                   <button type="submit" className="flex-1 py-4 bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all">{editingId ? 'Update Data' : 'Simpan Data'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4">
          <input
            type="text"
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold focus:ring-4 focus:ring-indigo-50"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">No</th>
                <th className="px-8 py-5">Nama Lengkap</th>
                <th className="px-8 py-5">Tgl Lahir</th>
                <th className="px-8 py-5">Usia</th>
                <th className="px-8 py-5">Jenis Kelamin</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Jml</th>
                <th className="px-8 py-5">Notes</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedResidents.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-900">
                    <p>{res.no}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 uppercase tracking-tight">{res.nama_lengkap}</p>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-600">
                    {res.tgl_lahir}
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-600">
                    {res.usia}
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-600">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${res.jenis_kelamin === 'L' ? 'border-blue-100 text-blue-600 bg-blue-50' : 'border-pink-100 text-pink-600 bg-pink-50'}`}>
                      {res.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">{res.status}</span>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-600">
                    {res.jml}
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-600">
                    {res.notes}
                  </td>
                  <td className="px-8 py-6 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(res)} className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onClick={() => handleDelete(res.id)} className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminResidents;
