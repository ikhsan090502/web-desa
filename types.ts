
export enum AppRole {
  PUBLIC = 'PUBLIC',
  ADMIN = 'ADMIN'
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Kesehatan' | 'Kegiatan' | 'Informasi' | 'Pembangunan';
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
}

export interface Resident {
  id: string;
  name: string;
  address: string;
  status: 'Aktif' | 'Pindah' | 'Wafat';
  category: 'Warga Tetap' | 'Warga Kontrak';
}

export interface RequestItem {
  id: string;
  residentName: string;
  type: string;
  date: string;
  status: 'Tertunda' | 'Disetujui' | 'Ditolak';
}

export interface FinanceRecord {
  id: string;
  type: 'Pemasukan' | 'Pengeluaran';
  amount: number;
  description: string;
  date: string;
  category: string;
}
