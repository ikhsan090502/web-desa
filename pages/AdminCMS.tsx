
import React, { useState } from 'react';
import { generateAssistantContent } from '../services/gemini';

const AdminCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profil' | 'berita' | 'layanan'>('profil');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleAiAssist = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const result = await generateAssistantContent(prompt, `Halaman ${activeTab.toUpperCase()}`);
      if (result) {
        setContent(result);
      }
    } catch (error) {
      alert("Gagal menggunakan AI. Pastikan API Key valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Content Management System</h1>
          <p className="text-sm text-slate-500">Kelola informasi publik dan berita organisasi.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('profil')}
            className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'profil' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            Profil
          </button>
          <button 
            onClick={() => setActiveTab('berita')}
            className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'berita' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            Berita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Area */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900">Penyunting Konten</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">DRAF</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Judul Konten</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-none rounded-xl focus:ring-blue-200 font-bold"
                placeholder="Masukkan judul..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Isi Konten</label>
              <textarea 
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl focus:ring-blue-200 text-sm leading-relaxed"
                placeholder="Tulis konten di sini atau gunakan AI untuk membantu..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition-all">
              Simpan Draf
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Publikasikan
            </button>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="font-extrabold">AI Asisten Konten</h3>
            </div>
            <p className="text-blue-100 text-sm mb-8 leading-relaxed">
              Minta AI untuk menyusun draf sejarah, visi misi, atau artikel berita dengan gaya bahasa yang profesional dan sopan.
            </p>
            <div className="space-y-4 flex-1">
              <textarea 
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl focus:ring-white/50 placeholder:text-blue-200 text-sm"
                placeholder="Contoh: Buat narasi sejarah singkat desa harmoni yang berdiri tahun 1995..."
              />
              <button 
                onClick={handleAiAssist}
                disabled={isGenerating}
                className="w-full py-4 bg-white text-blue-700 font-extrabold rounded-2xl shadow-xl hover:bg-blue-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Sedang Menyusun...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">magic_button</span>
                    Susun Konten Sekarang
                  </>
                )}
              </button>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Tips Penggunaan</h4>
              <p className="text-[11px] text-blue-100">AI akan menghasilkan Bahasa Indonesia yang formal dan sopan sesuai standar portal pemerintah/organisasi warga.</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
