// server.mjs
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

/* ================== CONFIG ================== */
// default 3002 supaya match Nginx (/api -> 127.0.0.1:3002)
const PORT = Number(process.env.PORT || 3002);
const BASE_URL = (process.env.BASE_URL || "").replace(/\/+$/, "");
const TABLE_PENGURUS = process.env.TABLE_PENGURUS || "kepengurusan";

/* ================== PATH (ANTI SALAH FOLDER) ================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// folder upload
const PENGURUS_DIR = path.join(__dirname, "pengurus");
const KEGIATAN_DIR = path.join(__dirname, "kegiatan");
const HERO_DIR = path.join(__dirname, "hero"); // ✅ NEW

for (const dir of [PENGURUS_DIR, KEGIATAN_DIR, HERO_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json({ limit: "10mb" }));

/* ================== MYSQL ================== */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
});

db.connect((err) => {
  if (err) console.error("MySQL error:", err);
  else console.log("MySQL connected");
});

/* ================== STATIC FILES ================== */
app.use("/pengurus", express.static(PENGURUS_DIR));
app.use("/kegiatan", express.static(KEGIATAN_DIR));
app.use("/hero", express.static(HERO_DIR)); // ✅ NEW

/* ================== HEALTH CHECK ================== */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    source: "node",
    timestamp: new Date().toISOString(),
    cwd: process.cwd(),
    __dirname,
    pengurusDir: PENGURUS_DIR,
    kegiatanDir: KEGIATAN_DIR,
    heroDir: HERO_DIR,
  });
});

/* ================== HELPERS ================== */
const safeFilename = (originalname = "file") => {
  const ext = path.extname(originalname).toLowerCase() || ".jpg";
  const base = path.basename(originalname, ext);
  const clean = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
  const finalBase = clean || "file";
  return `${Date.now()}-${finalBase}${ext}`;
};

const getJwtSecret = () => process.env.JWT_SECRET || "CHANGE_ME_SECRET";

/* ================== AUTH MIDDLEWARE (OPTIONAL) ================== */
// kalau nanti Anda mau kunci endpoint settings hanya admin, pakai ini.
const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ success: false, error: "Unauthorized" });
    jwt.verify(token, getJwtSecret());
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

/* ================== AUTH: LOGIN ADMIN ================== */
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "username dan password wajib diisi" });
    }

    const u = String(username).trim();
    const p = String(password);

    db.query(
      "SELECT id, username, password_hash, nama_lengkap FROM admin WHERE username = ? LIMIT 1",
      [u],
      async (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        const user = Array.isArray(rows) ? rows[0] : null;
        if (!user) return res.status(401).json({ success: false, error: "Username atau password salah." });

        const hash = String(user.password_hash || "");
        const ok = await bcrypt.compare(p, hash);
        if (!ok) return res.status(401).json({ success: false, error: "Username atau password salah." });

        db.query("UPDATE admin SET last_login = NOW() WHERE id = ?", [user.id], () => {});
        const token = jwt.sign({ id: user.id, username: user.username }, getJwtSecret(), { expiresIn: "7d" });

        return res.json({
          success: true,
          token,
          user: { id: user.id, username: user.username, nama_lengkap: user.nama_lengkap || null },
        });
      }
    );
  } catch {
    return res.status(500).json({ success: false, error: "Server error." });
  }
});

/* ================== API: WARGA ================== */
app.get("/api/warga", (req, res) => {
  db.query("SELECT * FROM warga ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

app.post("/api/warga", (req, res) => {
  const b = req.body || {};
  const payload = {
    nama_lengkap: String(b.nama_lengkap || "").trim(),
    jenis_kelamin: b.jenis_kelamin === "P" ? "P" : "L",
    tempat_lahir: b.tempat_lahir ?? null,
    tanggal_lahir: b.tanggal_lahir ?? null,
    agama: b.agama ?? null,
    pekerjaan: b.pekerjaan ?? null,
    dusun: String(b.dusun || "").trim(),
    rw: String(b.rw || "").trim(),
    rt: String(b.rt || "").trim(),
    status_warga: b.status_warga ?? b.status ?? "Aktif",
    kategori_warga: b.kategori_warga ?? b.kategori ?? "Warga Tetap",
    alamat_lengkap: b.alamat_lengkap ?? "",
  };

  if (!payload.nama_lengkap) return res.status(400).json({ success: false, error: "nama_lengkap wajib diisi" });
  if (!payload.dusun || !payload.rw || !payload.rt)
    return res.status(400).json({ success: false, error: "dusun, rw, rt wajib diisi" });

  const sql = `
    INSERT INTO warga
      (nama_lengkap, jenis_kelamin, tempat_lahir, tanggal_lahir, agama, pekerjaan,
       dusun, rw, rt, status_warga, kategori_warga, alamat_lengkap)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    payload.nama_lengkap,
    payload.jenis_kelamin,
    payload.tempat_lahir,
    payload.tanggal_lahir,
    payload.agama,
    payload.pekerjaan,
    payload.dusun,
    payload.rw,
    payload.rt,
    payload.status_warga,
    payload.kategori_warga,
    payload.alamat_lengkap,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: { id: result.insertId } });
  });
});

app.put("/api/warga/:id", (req, res) => {
  const { id } = req.params;
  const b = req.body || {};

  const payload = {
    nama_lengkap: String(b.nama_lengkap || "").trim(),
    jenis_kelamin: b.jenis_kelamin === "P" ? "P" : "L",
    tempat_lahir: b.tempat_lahir ?? null,
    tanggal_lahir: b.tanggal_lahir ?? null,
    agama: b.agama ?? null,
    pekerjaan: b.pekerjaan ?? null,
    dusun: String(b.dusun || "").trim(),
    rw: String(b.rw || "").trim(),
    rt: String(b.rt || "").trim(),
    status_warga: b.status_warga ?? b.status ?? "Aktif",
    kategori_warga: b.kategori_warga ?? b.kategori ?? "Warga Tetap",
    alamat_lengkap: b.alamat_lengkap ?? "",
  };

  if (!payload.nama_lengkap) return res.status(400).json({ success: false, error: "nama_lengkap wajib diisi" });
  if (!payload.dusun || !payload.rw || !payload.rt)
    return res.status(400).json({ success: false, error: "dusun, rw, rt wajib diisi" });

  const sql = `
    UPDATE warga SET
      nama_lengkap = ?,
      jenis_kelamin = ?,
      tempat_lahir = ?,
      tanggal_lahir = ?,
      agama = ?,
      pekerjaan = ?,
      dusun = ?,
      rw = ?,
      rt = ?,
      status_warga = ?,
      kategori_warga = ?,
      alamat_lengkap = ?
    WHERE id = ?
  `;

  const values = [
    payload.nama_lengkap,
    payload.jenis_kelamin,
    payload.tempat_lahir,
    payload.tanggal_lahir,
    payload.agama,
    payload.pekerjaan,
    payload.dusun,
    payload.rw,
    payload.rt,
    payload.status_warga,
    payload.kategori_warga,
    payload.alamat_lengkap,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: { affectedRows: result.affectedRows } });
  });
});

app.delete("/api/warga/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM warga WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: { affectedRows: result.affectedRows } });
  });
});

/* ================== API: KEPENGURUSAN ================== */
app.get("/api/kepengurusan", (req, res) => {
  const sql = `SELECT * FROM \`${TABLE_PENGURUS}\` ORDER BY COALESCE(urutan_tampil, 999999) ASC, id DESC`;
  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
        hint: "Pastikan TABLE_PENGURUS di .env sesuai nama tabel (mis: kepengurusan).",
      });
    }
    res.json({ success: true, data: rows });
  });
});

app.post("/api/kepengurusan", (req, res) => {
  const b = req.body || {};

  const payload = {
    nama_lengkap: String(b.nama_lengkap || "").trim(),
    gelar: b.gelar != null && String(b.gelar).trim() !== "" ? String(b.gelar).trim() : null,
    jabatan: String(b.jabatan || "").trim(),
    masa_jabatan: b.masa_jabatan != null && String(b.masa_jabatan).trim() !== "" ? String(b.masa_jabatan).trim() : null,
    foto_url: b.foto_url != null && String(b.foto_url).trim() !== "" ? String(b.foto_url).trim() : null,
    urutan_tampil: b.urutan_tampil != null ? Number(b.urutan_tampil) : 0,
    is_aktif: b.is_aktif != null ? Number(b.is_aktif) : 1,
  };

  if (!payload.nama_lengkap) return res.status(400).json({ success: false, error: "nama_lengkap wajib diisi" });
  if (!payload.jabatan) return res.status(400).json({ success: false, error: "jabatan wajib diisi" });

  const sql = `
    INSERT INTO \`${TABLE_PENGURUS}\`
      (nama_lengkap, gelar, jabatan, masa_jabatan, foto_url, urutan_tampil, is_aktif)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    payload.nama_lengkap,
    payload.gelar,
    payload.jabatan,
    payload.masa_jabatan,
    payload.foto_url,
    payload.urutan_tampil,
    payload.is_aktif,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: { id: result.insertId } });
  });
});

app.put("/api/kepengurusan/:id", (req, res) => {
  const { id } = req.params;
  const b = req.body || {};

  const payload = {
    nama_lengkap: String(b.nama_lengkap || "").trim(),
    gelar: b.gelar != null && String(b.gelar).trim() !== "" ? String(b.gelar).trim() : null,
    jabatan: String(b.jabatan || "").trim(),
    masa_jabatan: b.masa_jabatan != null && String(b.masa_jabatan).trim() !== "" ? String(b.masa_jabatan).trim() : null,
    foto_url: b.foto_url != null && String(b.foto_url).trim() !== "" ? String(b.foto_url).trim() : null,
    urutan_tampil: b.urutan_tampil != null ? Number(b.urutan_tampil) : 0,
    is_aktif: b.is_aktif != null ? Number(b.is_aktif) : 1,
  };

  if (!payload.nama_lengkap) return res.status(400).json({ success: false, error: "nama_lengkap wajib diisi" });
  if (!payload.jabatan) return res.status(400).json({ success: false, error: "jabatan wajib diisi" });

  const sql = `
    UPDATE \`${TABLE_PENGURUS}\` SET
      nama_lengkap = ?,
      gelar = ?,
      jabatan = ?,
      masa_jabatan = ?,
      foto_url = ?,
      urutan_tampil = ?,
      is_aktif = ?
    WHERE id = ?
  `;
  const values = [
    payload.nama_lengkap,
    payload.gelar,
    payload.jabatan,
    payload.masa_jabatan,
    payload.foto_url,
    payload.urutan_tampil,
    payload.is_aktif,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: { affectedRows: result.affectedRows } });
  });
});

app.delete("/api/kepengurusan/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM \`${TABLE_PENGURUS}\` WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: { affectedRows: result.affectedRows } });
  });
});

/* ================== UPLOAD: PENGURUS ================== */
const storagePengurus = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PENGURUS_DIR),
  filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
});
const uploadPengurus = multer({ storage: storagePengurus });

app.post("/api/upload/pengurus", uploadPengurus.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "No file" });

  const imagePath = `/pengurus/${req.file.filename}`;
  const imageUrl = BASE_URL ? `${BASE_URL}${imagePath}` : imagePath;

  res.json({ success: true, data: { filename: req.file.filename, imagePath, imageUrl } });
});

/* ================== API: KEGIATAN ================== */
app.get("/api/kegiatan", (req, res) => {
  db.query("SELECT * FROM kegiatan ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

app.post("/api/kegiatan", (req, res) => {
  const b = req.body || {};

  const payload = {
    judul: String(b.judul || "").trim(),
    tanggal: b.tanggal ? String(b.tanggal).slice(0, 10) : null,
    lokasi: b.lokasi != null && String(b.lokasi).trim() !== "" ? String(b.lokasi).trim() : null,
    status: ["Rencana", "Proses", "Selesai"].includes(String(b.status)) ? String(b.status) : "Rencana",
    anggaran: b.anggaran != null ? Number(b.anggaran) : 0,
    foto_url: b.foto_url != null && String(b.foto_url).trim() !== "" ? String(b.foto_url).trim() : null,
    deskripsi: b.deskripsi != null ? String(b.deskripsi) : null,
  };

  if (!payload.judul) return res.status(400).json({ success: false, error: "judul wajib diisi" });
  if (!payload.tanggal) return res.status(400).json({ success: false, error: "tanggal wajib diisi (YYYY-MM-DD)" });

  const sql = `
    INSERT INTO kegiatan (judul, tanggal, lokasi, status, anggaran, foto_url, deskripsi)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [payload.judul, payload.tanggal, payload.lokasi, payload.status, payload.anggaran, payload.foto_url, payload.deskripsi],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: { id: result.insertId } });
    }
  );
});

app.put("/api/kegiatan/:id", (req, res) => {
  const { id } = req.params;
  const b = req.body || {};

  const payload = {
    judul: String(b.judul || "").trim(),
    tanggal: b.tanggal ? String(b.tanggal).slice(0, 10) : null,
    lokasi: b.lokasi != null && String(b.lokasi).trim() !== "" ? String(b.lokasi).trim() : null,
    status: ["Rencana", "Proses", "Selesai"].includes(String(b.status)) ? String(b.status) : "Rencana",
    anggaran: b.anggaran != null ? Number(b.anggaran) : 0,
    foto_url: b.foto_url != null && String(b.foto_url).trim() !== "" ? String(b.foto_url).trim() : null,
    deskripsi: b.deskripsi != null ? String(b.deskripsi) : null,
  };

  if (!payload.judul) return res.status(400).json({ success: false, error: "judul wajib diisi" });
  if (!payload.tanggal) return res.status(400).json({ success: false, error: "tanggal wajib diisi (YYYY-MM-DD)" });

  const sql = `
    UPDATE kegiatan SET
      judul = ?,
      tanggal = ?,
      lokasi = ?,
      status = ?,
      anggaran = ?,
      foto_url = ?,
      deskripsi = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [payload.judul, payload.tanggal, payload.lokasi, payload.status, payload.anggaran, payload.foto_url, payload.deskripsi, id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: { affectedRows: result.affectedRows } });
    }
  );
});

app.delete("/api/kegiatan/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM kegiatan WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: { affectedRows: result.affectedRows } });
  });
});
app.get("/api/kegiatan-preview", (req, res) => {
  db.query("SELECT * FROM kegiatan ORDER BY id DESC LIMIT 3", (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message })
    res.json({ success: true, data: rows })
  })
})

/* ================== UPLOAD: KEGIATAN ================== */
const storageKegiatan = multer.diskStorage({
  destination: (req, file, cb) => cb(null, KEGIATAN_DIR),
  filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
});
const uploadKegiatan = multer({ storage: storageKegiatan });

app.post("/api/upload/kegiatan", uploadKegiatan.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "No file" });

  const imagePath = `/kegiatan/${req.file.filename}`;
  const imageUrl = BASE_URL ? `${BASE_URL}${imagePath}` : imagePath;

  res.json({ success: true, data: { filename: req.file.filename, imagePath, imageUrl } });
});

/* ================== ✅ SETTINGS: HOME HERO (NEW) ================== */
/**
 * GET  /api/settings/home-hero
 * Resp: { success:true, data:{ image: "/hero/xxx.jpg" } }
 */
app.get("/api/settings/home-hero", (req, res) => {
  db.query("SELECT `value` FROM settings WHERE `key` = ? LIMIT 1", ["home_hero_image"], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    const row = Array.isArray(rows) ? rows[0] : null;
    const image = row?.value || null;

    res.json({ success: true, data: { image } });
  });
});

/**
 * PUT /api/settings/home-hero
 * Body: { image: "/hero/xxx.jpg" } atau full https url
 */
app.put("/api/settings/home-hero", /*requireAuth,*/ (req, res) => {
  const image = req.body?.image != null ? String(req.body.image).trim() : "";

  if (!image) return res.status(400).json({ success: false, error: "image wajib diisi" });

  db.query(
    "INSERT INTO settings (`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)",
    ["home_hero_image", image],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: { image } });
    }
  );
});

/* ================== ✅ UPLOAD: HERO (NEW) ================== */
const storageHero = multer.diskStorage({
  destination: (req, file, cb) => cb(null, HERO_DIR),
  filename: (req, file, cb) => cb(null, safeFilename(file.originalname)),
});
const uploadHero = multer({ storage: storageHero });

/**
 * POST /api/upload/hero  (form-data image)
 * Resp: { success:true, data:{ imagePath:"/hero/xxx.jpg", imageUrl:"https://..." } }
 */
app.post("/api/upload/hero", /*requireAuth,*/ uploadHero.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "No file" });

  const imagePath = `/hero/${req.file.filename}`;
  const imageUrl = BASE_URL ? `${BASE_URL}${imagePath}` : imagePath;

  res.json({ success: true, data: { filename: req.file.filename, imagePath, imageUrl } });
});

/* ================== API: KEUANGAN ================== */
const normalizeTipeKeuangan = (v) => (String(v) === "Pengeluaran" ? "Pengeluaran" : "Pemasukan");

const normalizeNominal = (v) => {
  if (v == null) return 0;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const normalizeDate = (v) => {
  if (!v) return null;
  return String(v).slice(0, 10);
};

app.get("/api/keuangan", (req, res) => {
  const limit = Math.min(500, Math.max(1, Number(req.query.limit || 50)));
  const tipe = req.query.tipe ? normalizeTipeKeuangan(req.query.tipe) : null;
  const kategori = req.query.kategori ? String(req.query.kategori) : null;
  const month = req.query.month ? String(req.query.month).slice(0, 7) : null;

  const where = [];
  const params = [];

  if (tipe) { where.push("tipe = ?"); params.push(tipe); }
  if (kategori) { where.push("kategori = ?"); params.push(kategori); }
  if (month) { where.push("DATE_FORMAT(tanggal, '%Y-%m') = ?"); params.push(month); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sql = `SELECT * FROM keuangan ${whereSql} ORDER BY tanggal DESC, id DESC LIMIT ?`;

  db.query(sql, [...params, limit], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

app.get("/api/keuangan/all", (req, res) => {
  db.query("SELECT * FROM keuangan ORDER BY tanggal DESC, id DESC", (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: rows });
  });
});

app.post("/api/keuangan", (req, res) => {
  const b = req.body || {};
  const payload = {
    tipe: normalizeTipeKeuangan(b.tipe),
    nominal: normalizeNominal(b.nominal),
    keterangan: String(b.keterangan || "").trim(),
    tanggal: normalizeDate(b.tanggal),
    kategori: String(b.kategori || "").trim(),
  };

  if (!payload.keterangan) return res.status(400).json({ success: false, error: "keterangan wajib diisi" });
  if (!payload.kategori) return res.status(400).json({ success: false, error: "kategori wajib diisi" });
  if (!payload.tanggal) return res.status(400).json({ success: false, error: "tanggal wajib diisi (YYYY-MM-DD)" });
  if (!Number.isFinite(payload.nominal) || payload.nominal < 0)
    return res.status(400).json({ success: false, error: "nominal tidak valid" });

  db.query(
    "INSERT INTO keuangan (tipe, nominal, keterangan, tanggal, kategori) VALUES (?, ?, ?, ?, ?)",
    [payload.tipe, payload.nominal, payload.keterangan, payload.tanggal, payload.kategori],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: { id: result.insertId } });
    }
  );
});

app.put("/api/keuangan/:id", (req, res) => {
  const { id } = req.params;
  const b = req.body || {};
  const payload = {
    tipe: normalizeTipeKeuangan(b.tipe),
    nominal: normalizeNominal(b.nominal),
    keterangan: String(b.keterangan || "").trim(),
    tanggal: normalizeDate(b.tanggal),
    kategori: String(b.kategori || "").trim(),
  };

  if (!payload.keterangan) return res.status(400).json({ success: false, error: "keterangan wajib diisi" });
  if (!payload.kategori) return res.status(400).json({ success: false, error: "kategori wajib diisi" });
  if (!payload.tanggal) return res.status(400).json({ success: false, error: "tanggal wajib diisi (YYYY-MM-DD)" });
  if (!Number.isFinite(payload.nominal) || payload.nominal < 0)
    return res.status(400).json({ success: false, error: "nominal tidak valid" });

  db.query(
    `UPDATE keuangan SET tipe=?, nominal=?, keterangan=?, tanggal=?, kategori=? WHERE id=?`,
    [payload.tipe, payload.nominal, payload.keterangan, payload.tanggal, payload.kategori, id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: { affectedRows: result.affectedRows } });
    }
  );
});

app.delete("/api/keuangan/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM keuangan WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: { affectedRows: result.affectedRows } });
  });
});

/* ================== API FALLBACK ================== */
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: "API endpoint not found",
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

/* ================== LISTEN ================== */
app.listen(PORT, "0.0.0.0", () => {
  console.log("Node API running on port", PORT);
});
