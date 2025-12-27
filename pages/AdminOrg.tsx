import React, { useState, useEffect } from 'react';
import { fetchKepengurusan, createKepengurusan, updateKepengurusan, deleteKepengurusan, uploadPengurusImage } from '../services/api';

interface Member {
  id: number;
  name: string;
  degree: string;
  role: string;
  period: string;
  img: string;
  order?: number;
}

const AdminOrg: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', degree: '', role: '', period: '', img: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchKepengurusan();
        // Add order property based on array index
        const membersWithOrder = data.map((member: any, index: number) => ({
          ...member,
          order: index + 1
        }));
        setMembers(membersWithOrder);
      } catch (error) {
        console.error('Error fetching kepengurusan:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEdit = (member: Member) => {
    setForm({ name: member.name, degree: member.degree, role: member.role, period: member.period, img: member.img });
    setEditingId(member.id);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Find the highest urutan_tampil for new members
      const maxOrder = members.length > 0 ? Math.max(...members.map(m => m.order || 0)) : 0;
      const data = {
        nama_lengkap: form.name,
        gelar: form.degree,
        jabatan: form.role,
        masa_jabatan: form.period,
        foto_url: form.img || `https://i.pravatar.cc/300?u=${Date.now()}`,
        urutan_tampil: editingId ? members.find(m => m.id === editingId)?.order || 0 : maxOrder + 1,
        is_aktif: 1
      };
      if (editingId) {
        await updateKepengurusan(editingId.toString(), data);
        setMembers(members.map(m => m.id === editingId ? { ...m, ...form } : m));
      } else {
        const result = await createKepengurusan(data);
        setMembers([...members, { id: result.id, ...form, order: data.urutan_tampil }]);
      }
      setIsEditing(false);
      setEditingId(null);
      setForm({ name: '', degree: '', role: '', period: '', img: '' });
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const moveMember = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = members.findIndex(m => m.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= members.length) return;

    const currentMember = members[currentIndex];
    const targetMember = members[newIndex];

    // Swap the order values
    const currentOrder = currentMember.order || currentIndex + 1;
    const targetOrder = targetMember.order || newIndex + 1;

    // Update only the two members being swapped
    try {
      await Promise.all([
        updateKepengurusan(currentMember.id.toString(), {
          nama_lengkap: currentMember.name,
          gelar: currentMember.degree || null,
          jabatan: currentMember.role,
          masa_jabatan: currentMember.period || null,
          foto_url: currentMember.img || null,
          urutan_tampil: targetOrder,
          is_aktif: 1
        }),
        updateKepengurusan(targetMember.id.toString(), {
          nama_lengkap: targetMember.name,
          gelar: targetMember.degree || null,
          jabatan: targetMember.role,
          masa_jabatan: targetMember.period || null,
          foto_url: targetMember.img || null,
          urutan_tampil: currentOrder,
          is_aktif: 1
        })
      ]);

      // Update local state
      const newMembers = [...members];
      [newMembers[currentIndex], newMembers[newIndex]] = [newMembers[newIndex], newMembers[currentIndex]];
      setMembers(newMembers.map((m, index) => ({ ...m, order: index + 1 })));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const data = await uploadPengurusImage(file);
      setForm({ ...form, img: data.imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Upload gambar gagal');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: number) => {
    console.log('Delete button clicked for id:', id);
    if (confirm('Apakah Anda yakin ingin menghapus perangkat ini?')) {
      alert('Deleting member with id: ' + id);
      try {
        console.log('Calling delete API for id:', id);
        await deleteKepengurusan(id.toString());
        console.log('Delete API success, updating state');
        setMembers(members.filter(m => m.id !== id));
        alert('Member deleted successfully');
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Error deleting member: ' + error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Struktur Organisasi Desa</h1>
          <p className="text-sm text-slate-500 font-medium">Manajemen data jabatan dan profil perangkat desa.</p>
        </div>
        <button
          onClick={() => { setIsEditing(true); setEditingId(null); setForm({ name: '', degree: '', role: '', period: '', img: '' }); }}
          className="px-8 py-4 bg-indigo-700 text-white font-black rounded-[1.5rem] text-sm flex items-center gap-3 hover:bg-indigo-800 shadow-2xl shadow-indigo-100 transition-all"
        >
          <span className="material-symbols-outlined">person_add</span>
          Registrasi Perangkat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500">
            <div className="aspect-[4/3] relative">
              <img src={m.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <button onClick={() => moveMember(m.id, 'up')} disabled={members.indexOf(m) === 0} className="h-10 w-10 bg-white rounded-xl text-slate-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"><span className="material-symbols-outlined text-sm">keyboard_arrow_up</span></button>
                <button onClick={() => handleEdit(m)} className="h-10 w-10 bg-white rounded-xl text-indigo-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all"><span className="material-symbols-outlined text-sm">edit</span></button>
                <button onClick={() => handleDelete(m.id)} className="h-10 w-10 bg-white rounded-xl text-red-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all"><span className="material-symbols-outlined text-sm">delete</span></button>
                <button onClick={() => moveMember(m.id, 'down')} disabled={members.indexOf(m) === members.length - 1} className="h-10 w-10 bg-white rounded-xl text-slate-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"><span className="material-symbols-outlined text-sm">keyboard_arrow_down</span></button>
              </div>
            </div>
            <div className="p-10">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                {m.role}
              </span>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                {m.name}{m.degree ? `, ${m.degree}` : ''}
              </h3>
              <div className="flex items-center gap-3 mt-6 text-slate-400">
                <span className="material-symbols-outlined text-sm">history_edu</span>
                <span className="text-[10px] font-black uppercase tracking-widest">SK Berlaku: {m.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Input Data Perangkat</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Formulir Pengangkatan Digital</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="h-10 w-10 bg-white rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-12 space-y-8">
              <div className="flex gap-10 items-center">
                <div
                  className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center shrink-0 hover:border-indigo-400 cursor-pointer group transition-all relative overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.img ? (
                    <img src={form.img} alt="Preview" className="w-full h-full object-cover rounded-[2.5rem]" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-slate-300 text-4xl group-hover:text-indigo-500">photo_camera</span>
                      <p className="text-[8px] font-black uppercase text-slate-400 mt-2">Upload Foto</p>
                    </>
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                      <div className="text-white text-xs">Uploading...</div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Nama Lengkap (Tanpa Gelar)</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50" placeholder="Contoh: Samsul Arifin" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Gelar Pendidikan</label>
                    <input value={form.degree} onChange={e => setForm({...form, degree: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50" placeholder="Contoh: S.Sos, M.AP" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Jabatan Struktur</label>
                  <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-50" placeholder="Contoh: Ketua RT 01, Sekretaris, 1. Seksi Keamanan, dll" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Masa Jabatan (SK)</label>
                  <input value={form.period} onChange={e => setForm({...form, period: e.target.value})} type="text" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50" placeholder="2024-2030" />
                </div>
              </div>
            </div>
            <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button onClick={() => setIsEditing(false)} className="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all">Batal</button>
              <button onClick={handleSave} className="px-10 py-4 bg-indigo-700 text-white font-black rounded-2xl text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all">Simpan Perangkat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrg;
