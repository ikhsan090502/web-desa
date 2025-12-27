// server.mjs
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();

/* ================== CONFIG ================== */
const PORT = Number(process.env.PORT || 3000);

// ✅ untuk bikin URL gambar yang benar
// contoh .env: BASE_URL=https://api.dukuhannayu01.com
const BASE_URL = (process.env.BASE_URL || "").replace(/\/+$/, "");

/**
 * Pilih nama tabel pengurus Anda.
 * Karena Anda pakai folder "pengurus/", biasanya tabelnya "pengurus".
 * Kalau ternyata tabelnya "kepengurusan", ganti ini.
 */
const TABLE_PENGURUS = process.env.TABLE_PENGURUS || "pengurus";

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());

/* ================== MYSQL ================== */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
});

db.connect((err) => {
  if (err) {
    console.error("MySQL error:", err);
  } else {
    console.log("MySQL connected");
  }
});

/* ================== STATIC FILES ================== */
// pastikan folder ada
const pengurusDir = path.resolve("pengurus");
if (!fs.existsSync(pengurusDir)) fs.mkdirSync(pengurusDir, { recursive: true });

// akses file upload via: https://api.domain.com/pengurus/namafile.jpg
app.use("/pengurus", express.static(pengurusDir));

/* ================== HEALTH CHECK ================== */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    source: "node",
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

/* ================== API: WARGA ================== */
app.get("/api/warga", (req, res) => {
  db.query("SELECT * FROM warga ORDER BY id DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

/* ================== API: KEPENGURUSAN ==================
   Default: ambil dari tabel "pengurus"
   Kalau tabel Anda "kepengurusan", set TABLE_PENGURUS=kepengurusan di .env
======================================================= */
app.get("/api/kepengurusan", (req, res) => {
  const sql = `SELECT * FROM \`${TABLE_PENGURUS}\` ORDER BY id DESC`;
  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
        hint:
          "Cek nama tabel. Ubah TABLE_PENGURUS di .env menjadi nama tabel yang benar.",
      });
    }
    res.json({ success: true, data: rows });
  });
});

/* ================== UPLOAD: PENGURUS ================== */
const storagePengurus = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "pengurus/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const uploadPengurus = multer({ storage: storagePengurus });

app.post("/api/upload/pengurus", uploadPengurus.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file" });
  }

  // kalau BASE_URL tidak diisi, tetap balikin path relatif biar tidak error
  const imagePath = `/pengurus/${req.file.filename}`;
  const imageUrl = BASE_URL ? `${BASE_URL}${imagePath}` : imagePath;

  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      imagePath,
      imageUrl,
    },
  });
});

/* ================== API FALLBACK (PALING BAWAH) ================== */
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
