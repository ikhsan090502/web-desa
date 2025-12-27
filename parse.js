import fs from 'fs';

const data = fs.readFileSync('residents_data.txt', 'utf8');

const lines = data.split('\n').slice(4); // skip headers

let residents = [];

function parseDate(d) {
  if (!d || d === '#REF!') return null;
  if (d.match(/^\d{4}-\d{2}-\d{2}$/)) return d;
  if (d.match(/^\d{2}-\d{2}-\d{4}$/)) return d.split('-').reverse().join('-');
  if (d.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/)) {
    const [m, d, y] = d.split('/');
    return `20${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  return null;
}

function parseUsia(u) {
  if (!u || u === '#REF!') return null;
  return parseInt(u);
}

for (let line of lines) {
  const parts = line.split('\t').map(p => p.trim());
  if (parts.length < 6 || !line.trim()) continue;
  let nama_lengkap = parts[1];
  let tgl_lahir = parseDate(parts[2]);
  let usia = parseUsia(parts[3]);
  let jenis_kelamin = parts[4];
  let status = parts[5];
  let jml = parseUsia(parts[6]) || 1;
  if (nama_lengkap) {
    residents.push({
      nama_lengkap,
      tgl_lahir,
      usia,
      jenis_kelamin,
      status,
      jml,
      notes: 'Dukuhan Nayu, RW 21, RT 01, Desa Banjarsari'
    });
  }
}

console.log(residents.length);

const sql = residents.map(r => `INSERT INTO warga (nama_lengkap, jenis_kelamin, tempat_lahir, tanggal_lahir, agama, pekerjaan, dusun, rw, rt, status_warga, kategori_warga, alamat_lengkap) VALUES ('${r.nama_lengkap.replace(/'/g, "''")}', '${r.jenis_kelamin}', NULL, ${r.tgl_lahir ? `'${r.tgl_lahir}'` : 'NULL'}, 'Islam', 'Warga', 'Dukuh Nahayu', '21', '01', '${r.status}', 'Warga Tetap', '${r.notes}');`).join('\n');

fs.writeFileSync('insert_from_excel.sql', sql);