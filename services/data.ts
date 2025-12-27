// Static data for initial setup - will be replaced by database data
export const INITIAL_ACTIVITIES = [
  {
    id: '1',
    title: 'Pembangunan Drainase RT 02/05',
    date: '05 Nov 2024',
    loc: 'Dusun I - Jl. Melati',
    status: 'Rencana',
    budget: 'Rp 45.000.000',
    img: 'https://picsum.photos/1200/800?seed=build1',
    excerpt: 'Kegiatan ini merupakan bagian dari program percepatan infrastruktur desa tahun 2024...',
    content: 'Pemerintah Desa Banjarsari secara resmi mengumumkan dimulainya proyek pembangunan drainase baru di wilayah Dusun I, tepatnya di sepanjang Jalan Melati RT 02/05. Proyek ini merupakan salah satu prioritas pembangunan fisik dalam APBDes tahun 2024.\n\nPembangunan drainase ini direncanakan memiliki panjang total 200 meter dengan konstruksi beton bertulang yang kokoh. Tujuan utama dari pembangunan ini adalah untuk memperbaiki sistem pembuangan air warga yang selama ini sering tersumbat saat hujan lebat turun.\n\nBapak Kepala Desa menyampaikan bahwa pengerjaan akan melibatkan tenaga kerja lokal sebagai bagian dari program Padat Karya Tunai Desa (PKTD).',
    category: 'Pembangunan'
  },
  {
    id: '2',
    title: 'Pelatihan UMKM Desa Banjarsari',
    date: '30 Okt 2024',
    loc: 'Aula Kantor Desa',
    status: 'Proses',
    budget: 'Rp 5.500.000',
    img: 'https://picsum.photos/1200/800?seed=train1',
    excerpt: 'Pemerintah desa memfasilitasi 50 pelaku UMKM lokal untuk mendapatkan pelatihan pemasaran...',
    content: 'Dalam rangka meningkatkan daya saing produk lokal, Pemerintah Desa Banjarsari menyelenggarakan pelatihan pemasaran digital bagi pelaku UMKM. Pelatihan ini menghadirkan narasumber ahli di bidang e-commerce.\n\nSebanyak 50 peserta dari berbagai unit usaha seperti kuliner, kerajinan, dan fashion turut hadir dengan antusias. Diharapkan setelah pelatihan ini, produk desa dapat dikenal lebih luas di pasar nasional melalui platform digital.',
    category: 'Pelatihan'
  },
  {
    id: '3',
    title: 'Posyandu Balita & Lansia Rutin',
    date: '15 Okt 2024',
    loc: 'Kantor Posyandu',
    status: 'Selesai',
    budget: 'Rp 1.500.000',
    img: 'https://picsum.photos/1200/800?seed=health',
    excerpt: 'Kegiatan rutin bulanan untuk menjamin kesehatan generasi desa dan orang tua kita...',
    content: 'Layanan kesehatan gratis melalui Posyandu kembali dilaksanakan di balai RW. Fokus kegiatan bulan ini adalah pemantauan gizi balita dan pemeriksaan tekanan darah bagi lansia.\n\nKesadaran warga akan kesehatan keluarga terus meningkat, terbukti dengan jumlah kehadiran yang mencapai 95% dari target. Stok vitamin dan makanan tambahan juga telah didistribusikan secara merata kepada peserta.',
    category: 'Kesehatan'
  },
];

export const INITIAL_ORG = [
  { id: 1, name: 'Drs. H. Mulyono', degree: 'M.Si', role: 'Kepala Desa', period: '2024 - 2030', img: 'https://i.pravatar.cc/300?u=kades' },
  { id: 2, name: 'Samsul Arifin', degree: 'S.Sos', role: 'Sekretaris Desa', period: '2022 - 2028', img: 'https://i.pravatar.cc/300?u=sekdes' },
  { id: 3, name: 'Andi Wijaya', degree: 'S.E.', role: 'Kaur Keuangan', period: '2022 - 2028', img: 'https://i.pravatar.cc/300?u=kaur1' },
  { id: 4, name: 'Budi Santoso', degree: 'S.T.', role: 'Kasi Pembangunan', period: '2022 - 2028', img: 'https://i.pravatar.cc/300?u=kasi1' },
  { id: 5, name: 'Siti Aminah', degree: 'A.Md', role: 'Kaur Tata Usaha', period: '2022 - 2028', img: 'https://i.pravatar.cc/300?u=kaur2' },
  { id: 6, name: 'Rahmat Hidayat', degree: '', role: 'Kepala Dusun I', period: '2022 - 2028', img: 'https://i.pravatar.cc/300?u=kadus1' },
];

export const INITIAL_AGE_DATA = [
  { name: 'Anak-anak', value: 240, color: '#60a5fa' },
  { name: 'Remaja', value: 380, color: '#3b82f6' },
  { name: 'Dewasa', value: 520, color: '#2563eb' },
  { name: 'Lansia', value: 100, color: '#1d4ed8' },
];

export const INITIAL_GENDER_DATA = [
  { name: 'Laki-laki', value: 640 },
  { name: 'Perempuan', value: 600 },
];

export const INITIAL_RESIDENTS = [
  // Sample resident data
];

export const INITIAL_FINANCE_HISTORY = [
  { month: 'Mei', masuk: 12000000, keluar: 8000000 },
  { month: 'Jun', masuk: 15000000, keluar: 10000000 },
  { month: 'Jul', masuk: 10000000, keluar: 12000000 },
  { month: 'Agu', masuk: 20000000, keluar: 15000000 },
  { month: 'Sep', masuk: 18000000, keluar: 9000000 },
  { month: 'Okt', masuk: 22000000, keluar: 11000000 },
];