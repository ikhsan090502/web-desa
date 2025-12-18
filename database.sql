-- 1. Tabel Admin (Otentikasi)
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Warga (Kependudukan Lengkap)
CREATE TABLE warga (
    nik CHAR(16) PRIMARY KEY,
    no_kk CHAR(16) NOT NULL,
    nama_lengkap VARCHAR(150) NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    agama VARCHAR(20),
    pekerjaan VARCHAR(100),
    dusun VARCHAR(50) NOT NULL,
    rw CHAR(3) NOT NULL,
    rt CHAR(3) NOT NULL,
    status_warga ENUM('Aktif', 'Pindah', 'Wafat') DEFAULT 'Aktif',
    kategori_warga ENUM('Warga Tetap', 'Warga Kontrak') DEFAULT 'Warga Tetap',
    alamat_lengkap TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabel Kepengurusan (Perangkat Desa)
CREATE TABLE kepengurusan (
    id SERIAL PRIMARY KEY,
    nama_lengkap VARCHAR(150) NOT NULL,
    gelar VARCHAR(50),
    jabatan VARCHAR(100) NOT NULL,
    masa_jabatan VARCHAR(50), -- Contoh: "2024 - 2030"
    foto_url VARCHAR(255),
    urutan_tampil INTEGER DEFAULT 0,
    is_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Kabar & Kegiatan (Berita Desa)
CREATE TABLE kegiatan (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    lokasi VARCHAR(255),
    status ENUM('Rencana', 'Proses', 'Selesai') DEFAULT 'Rencana',
    anggaran DECIMAL(15, 2) DEFAULT 0,
    foto_url VARCHAR(255),
    deskripsi TEXT, -- Konten panjang berita
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Keuangan (Arus Kas Desa)
CREATE TABLE keuangan (
    id SERIAL PRIMARY KEY,
    tipe ENUM('Pemasukan', 'Pengeluaran') NOT NULL,
    nominal DECIMAL(15, 2) NOT NULL,
    keterangan TEXT NOT NULL,
    tanggal DATE NOT NULL,
    kategori VARCHAR(50) NOT NULL, -- Iuran, Dana Desa, Pembangunan, dll
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
