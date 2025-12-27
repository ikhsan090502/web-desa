-- MySQL dump 10.13  Distrib 8.0.44, for macos26.0 (arm64)
--
-- Host: localhost    Database: db_si_desa
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `families`
--

DROP TABLE IF EXISTS `families`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `families` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kepala` varchar(150) NOT NULL,
  `dukuh` varchar(100) DEFAULT NULL,
  `rt` varchar(5) DEFAULT NULL,
  `rw` varchar(5) DEFAULT NULL,
  `kelurahan` varchar(100) DEFAULT NULL,
  `kecamatan` varchar(100) DEFAULT NULL,
  `kota` varchar(100) DEFAULT NULL,
  `periode` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_family` (`nama_kepala`,`rt`,`rw`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `families`
--

LOCK TABLES `families` WRITE;
/*!40000 ALTER TABLE `families` DISABLE KEYS */;
INSERT INTO `families` VALUES (1,'CAHYA DARMOKO, S.T.','NAYU','01','21','BANJARSARI','BANJARSARI','SURAKARTA','2021','2025-12-26 01:58:36');
/*!40000 ALTER TABLE `families` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kegiatan`
--

DROP TABLE IF EXISTS `kegiatan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kegiatan` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `status` enum('Rencana','Proses','Selesai') DEFAULT 'Rencana',
  `anggaran` decimal(15,2) DEFAULT '0.00',
  `foto_url` varchar(255) DEFAULT NULL,
  `deskripsi` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kegiatan`
--

LOCK TABLES `kegiatan` WRITE;
/*!40000 ALTER TABLE `kegiatan` DISABLE KEYS */;
INSERT INTO `kegiatan` VALUES (1,'Peringatan Hari Kemerdekaan 17 Agustus','2024-08-17','Lapangan Desa Banjarsari','Selesai',5000000.00,'/kegiatan/17 agustus.jpeg','Peringatan Hari Kemerdekaan Republik Indonesia yang ke-79 di Desa Banjarsari. Acara diisi dengan upacara bendera, lomba-lomba, dan hiburan untuk warga desa. Semua warga berpartisipasi dengan antusias dalam memeriahkan hari bersejarah ini.','2025-12-26 13:23:49'),(2,'Kerja Bakti Pembersihan Lingkungan 1','2024-09-15','Dukuh Nahayu','Selesai',2000000.00,'/kegiatan/kerja bakti 1.jpeg','Kerja bakti rutin pertama di bulan September untuk membersihkan lingkungan Dukuh Nahayu. Warga bersama-sama membersihkan selokan, memotong rumput liar, dan memperbaiki jalan kampung. Kegiatan ini bertujuan menjaga kebersihan dan kesehatan lingkungan desa.','2025-12-26 13:23:49'),(3,'Kerja Bakti Pembersihan Lingkungan 2','2024-10-20','Dukuh Nahayu','Selesai',2500000.00,'/kegiatan/kerja bakti 2.jpeg','Kerja bakti lanjutan untuk melanjutkan pembersihan lingkungan. Kali ini fokus pada daerah pemukiman padat penduduk. Warga dibagi menjadi beberapa kelompok untuk efisiensi kerja. Hasilnya, lingkungan menjadi lebih bersih dan tertib.','2025-12-26 13:23:49'),(4,'Kumpul Warga Rutin Bulanan','2024-11-10','Balai Desa Banjarsari','Selesai',1500000.00,'/kegiatan/kumpul warga.jpeg','Kumpul warga rutin bulanan untuk membahas berbagai agenda desa. Agenda utama adalah pembagian bantuan sosial, laporan kegiatan bulan sebelumnya, dan perencanaan kegiatan mendatang. Warga aktif memberikan masukan dan saran untuk kemajuan desa.','2025-12-26 13:23:49'),(5,'Piknik Keluarga Desa Banjarsari','2024-12-01','Hutan Pinus Desa','Selesai',3000000.00,'/kegiatan/piknik.jpeg','Piknik keluarga sebagai ajang silaturahmi antar warga desa. Acara diisi dengan permainan, makan bersama, dan berbagai lomba keluarga. Tujuan utama adalah mempererat tali persaudaraan dan memberikan kesempatan istirahat dari rutinitas sehari-hari.','2025-12-26 13:23:49'),(11,'Piknik','2026-02-12','bali','Rencana',50000000.00,'/kegiatan/1766758064669-761563945.jpeg','','2025-12-26 14:05:09');
/*!40000 ALTER TABLE `kegiatan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kepengurusan`
--

DROP TABLE IF EXISTS `kepengurusan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kepengurusan` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama_lengkap` varchar(150) NOT NULL,
  `gelar` varchar(50) DEFAULT NULL,
  `jabatan` varchar(100) NOT NULL,
  `masa_jabatan` varchar(50) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `urutan_tampil` int DEFAULT '0',
  `is_aktif` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kepengurusan`
--

LOCK TABLES `kepengurusan` WRITE;
/*!40000 ALTER TABLE `kepengurusan` DISABLE KEYS */;
INSERT INTO `kepengurusan` VALUES (3,'Suharno','ST','Bendahara','2026 - 2030','pengurus/suharno.jpeg',3,1,'2025-12-26 10:04:07'),(7,'Yudi Ananto',NULL,'Seksi Kebersihan & Lingkungan','2026 - 2030',NULL,7,1,'2025-12-26 10:04:07'),(14,'Sumedi Ariwibowo','A.Ma','Ketua RT 01','2026 - 2030','/pengurus/sumedi.jpeg',1,1,'2025-12-26 13:36:28'),(15,'Fajar Azis Murtadho','SE','Sekretaris','2026 - 2030','/pengurus/fajar.jpeg',2,1,'2025-12-26 13:36:28'),(16,'Suharno','ST','Bendahara','2026 - 2030','/pengurus/suharno.jpeg',3,1,'2025-12-26 13:36:28'),(17,'Rahmad Nur Wiyono',NULL,'Seksi Keamanan & Ketertiban','2026 - 2030','/pengurus/rahmad nur.jpeg',4,1,'2025-12-26 13:36:28'),(18,'RM Adhitya Jati Tama',NULL,'Seksi Keamanan & Ketertiban','2026 - 2030',NULL,5,1,'2025-12-26 13:36:28'),(19,'Warsito',NULL,'Seksi Kebersihan & Lingkungan','2026 - 2030','/pengurus/warsito.jpeg',6,1,'2025-12-26 13:36:28'),(21,'Joko Prihatin',NULL,'Seksi Sosial & Kesejahteraan','2026 - 2030','/pengurus/joko.jpeg',8,1,'2025-12-26 13:36:28'),(22,'Suradi',NULL,'Seksi Sosial & Kesejahteraan','2026 - 2030','/pengurus/suradi.jpeg',9,1,'2025-12-26 13:36:28'),(23,'Septian Abi Winanto','apt. S.Fam','Seksi Pemuda & Olahraga','2026 - 2030','/pengurus/iyan.jpeg',10,1,'2025-12-26 13:36:28'),(24,'Boggy Mukti Sanjaya',NULL,'Seksi Pemuda & Olahraga','2026 - 2030','/pengurus/boggy.jpeg',11,1,'2025-12-26 13:36:28'),(25,'Rohmad Roy Waldi','SPd','Seksi Keagamaan','2026 - 2030',NULL,12,1,'2025-12-26 13:36:28'),(26,'Silvanus Rudi Triyono',NULL,'Seksi Keagamaan','2026 - 2030','/pengurus/rudi.jpeg',13,1,'2025-12-26 13:36:28');
/*!40000 ALTER TABLE `kepengurusan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keuangan`
--

DROP TABLE IF EXISTS `keuangan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keuangan` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tipe` enum('Pemasukan','Pengeluaran') NOT NULL,
  `nominal` decimal(15,2) NOT NULL,
  `keterangan` text NOT NULL,
  `tanggal` date NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keuangan`
--

LOCK TABLES `keuangan` WRITE;
/*!40000 ALTER TABLE `keuangan` DISABLE KEYS */;
/*!40000 ALTER TABLE `keuangan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residents`
--

DROP TABLE IF EXISTS `residents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `family_id` int DEFAULT NULL,
  `nama` varchar(150) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `status_dalam_keluarga` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_residents_family` (`family_id`),
  CONSTRAINT `fk_residents_family` FOREIGN KEY (`family_id`) REFERENCES `families` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residents`
--

LOCK TABLES `residents` WRITE;
/*!40000 ALTER TABLE `residents` DISABLE KEYS */;
/*!40000 ALTER TABLE `residents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warga`
--

DROP TABLE IF EXISTS `warga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warga` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_lengkap` varchar(150) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `agama` varchar(20) DEFAULT NULL,
  `pekerjaan` varchar(100) DEFAULT NULL,
  `dusun` varchar(50) NOT NULL,
  `rw` char(3) NOT NULL,
  `rt` char(3) NOT NULL,
  `status_warga` enum('K','KK','ISTRI','ANAK','FAMILI LAIN','ORANG TUA','Aktif','Pindah','Wafat') DEFAULT 'Aktif',
  `kategori_warga` enum('Warga Tetap','Warga Kontrak') DEFAULT 'Warga Tetap',
  `alamat_lengkap` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warga`
--

LOCK TABLES `warga` WRITE;
/*!40000 ALTER TABLE `warga` DISABLE KEYS */;
INSERT INTO `warga` VALUES (1,'CAHYA DARMOKO, S.T.','L','Desa Banjarsari','1989-12-26','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(2,'DARYATI','P','Desa Banjarsari','1984-10-24','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(3,'SARASWATI KARTIKASARI,S.Pd, M.Pd','P','Desa Banjarsari','1982-09-21','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(4,'ANAS ARSYAD RASYID','L','Desa Banjarsari','2009-07-30','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(5,'RASHIDA RASYA DARMOKO','P','Desa Banjarsari','2018-10-22','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(6,'ALFARIZQI ZEESHAN RASYID','L','Desa Banjarsari','2018-04-09','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(7,'PARTI','P','Desa Banjarsari','1970-06-15','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(8,'DARMI','P','Desa Banjarsari','1963-03-27','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(9,'PAIDI','L','Desa Banjarsari','1968-06-01','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(10,'SUDARMAN','L','Desa Banjarsari','1965-03-27','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(11,'HARYANI','P','Desa Banjarsari','1970-01-30','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(12,'SUGENG RAHAYU','P','Desa Banjarsari','1973-03-04','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(13,'RAHMAT APRIYANTO','L','Desa Banjarsari','1997-04-21','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','3','2025-12-26 09:30:25','2025-12-26 14:34:14'),(14,'TAUFIQ RIYADI','L','Desa Banjarsari','2003-01-01','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','3','2025-12-26 09:30:25','2025-12-26 14:34:14'),(15,'RINI BUDI ASTUTI','P','Desa Banjarsari','1994-07-05','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(16,'YUSUF KURNIAWAN','L','Desa Banjarsari','2014-03-06','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(17,'SUPARNO ','L','Desa Banjarsari','1973-12-21','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(18,'PUTRI HENDRAWATI','P','Desa Banjarsari','1976-03-15','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(19,'SUHARNO, ST','L','Desa Banjarsari','1978-05-23','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(20,'DARYATI','P','Desa Banjarsari','1984-10-24','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(21,'FITRIANA WULNDARI','P','Desa Banjarsari','1997-12-12','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(22,'DANISSA RARAS PUTRI','P','Desa Banjarsari','2003-12-07','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','6','2025-12-26 09:30:53','2025-12-26 14:34:14'),(23,'ANAS ARSYAD RASYID','L','Desa Banjarsari','2009-07-30','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(24,'ALFARIZQI ZEESHAN RASYID','L','Desa Banjarsari','2018-04-09','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(25,'SURATMIN','L','Desa Banjarsari','1961-06-16','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(26,'SRI SAMIYATI','P','Desa Banjarsari','1966-02-01','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(27,'DARMI','P','Desa Banjarsari','1963-03-27','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(28,'MUH DANDI SETIAWAN','L','Desa Banjarsari','1998-11-28','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','7','2025-12-26 09:30:53','2025-12-26 14:34:14'),(29,'SUDARMAN','L','Desa Banjarsari','1965-03-27','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(30,'SAIMIN','L','Desa Banjarsari','1956-12-16','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(31,'SUGENG RAHAYU','P','Desa Banjarsari','1973-03-04','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(32,'SARNI','P','Desa Banjarsari','1962-11-06','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(33,'RINI BUDI ASTUTI','P','Desa Banjarsari','1994-07-05','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(34,'YUDI ANANTO','L','Desa Banjarsari','1993-06-16','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(35,'NOVITRI HANDAYANI','P','Desa Banjarsari','1990-07-27','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(36,'SHAHIA KAYLA YOVIE','P','Desa Banjarsari','2019-03-10','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(37,'SUMEDI ARI WIBOWO, AMa','L','Desa Banjarsari','1976-03-05','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(38,'ADIK MINAWATI','P','Desa Banjarsari','1984-05-18','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(39,'AZZAH YUMNA NADIVA WIBOWO','P','Desa Banjarsari','2006-07-29','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','10','2025-12-26 09:30:53','2025-12-26 14:34:14'),(40,'AZFER ALHANAN WIBOWO','L','Desa Banjarsari','2016-06-01','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(41,'SILVANUS RUDI TRIYONO','L','Desa Banjarsari','1977-12-06','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(42,'MARTA SUMARIYANI','P','Desa Banjarsari','1975-11-24','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(43,'CINTA PUTRI IMMANUEL','P','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','11','2025-12-26 09:30:53','2025-12-26 14:34:14'),(44,'KEVIN LI EMANUEL','L','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(45,'LANANG GALIH PRAYOGA','L','Desa Banjarsari','1983-10-15','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(46,'RANI AGUSTINA','P','Desa Banjarsari','1985-10-08','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(47,'RAFARDHAN BIMATAMA PRAYOGA','L','Desa Banjarsari','2009-06-10','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','12','2025-12-26 09:30:53','2025-12-26 14:34:14'),(48,'HARTUTIK','P','Desa Banjarsari','1970-06-02','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(49,'RIFKI MURTADHO','L','Desa Banjarsari','2001-12-28','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','13','2025-12-26 09:30:53','2025-12-26 14:34:14'),(50,'RIFKA HUSNA AMALIA','P','Desa Banjarsari','2004-11-20','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','13','2025-12-26 09:30:53','2025-12-26 14:34:14'),(51,'MEILIA AYU RAHMAWATI','P','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','13','2025-12-26 09:30:53','2025-12-26 14:34:14'),(52,'SURADI','L','Desa Banjarsari','1975-01-21','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(53,'SUKAMI','P','Desa Banjarsari','1975-07-31','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(54,'KIFDIA RISKI SETIAWAN','L','Desa Banjarsari','1996-04-27','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','14','2025-12-26 09:30:53','2025-12-26 14:34:14'),(55,'KETRIN RIEKE SILVIANA','P','Desa Banjarsari','2000-12-04','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','14','2025-12-26 09:30:53','2025-12-26 14:34:14'),(56,'MADIYO','L','Desa Banjarsari','1979-03-05','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(57,'ISWANTO','L','Desa Banjarsari','1986-07-30','Islam','Warga','Dukuhan Nayu','21','01','FAMILI LAIN','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(58,'DEKI HARTONO','L','Desa Banjarsari','1970-05-31','Islam','Warga','Dukuhan Nayu','21','01','K','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(59,'APRILINA JAMAICA SURYANINGSIH','P','Desa Banjarsari','1989-04-14','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(60,'ALEYSIA ANANTA PUTRI HARTONO','L','Desa Banjarsari','2008-01-01','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','16','2025-12-26 09:30:53','2025-12-26 14:34:14'),(61,'WARSIMAN','L','Desa Banjarsari','1971-03-01','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(62,'PUTU PRATAMA PANGESTU GUSTI','L','Desa Banjarsari','1998-12-30','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(63,'ELRICO DWIKY PUTRA PANGESTU','L','Desa Banjarsari','2006-10-28','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','17','2025-12-26 09:30:53','2025-12-26 14:34:14'),(64,'WARSINEM','P','Desa Banjarsari','1950-12-31','Islam','Warga','Dukuhan Nayu','21','01','ORANG TUA','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(65,'SRI LESTARI','P','Desa Banjarsari','1973-07-21','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(66,'PUTRI OCTAVIANA','P','Desa Banjarsari','2001-04-10','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','18','2025-12-26 09:30:53','2025-12-26 14:34:14'),(67,'NOEL SILOAM','L','Desa Banjarsari','2007-12-14','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','18','2025-12-26 09:30:53','2025-12-26 14:34:14'),(68,'TRI SAPTO PAMUNGKAS , S.Sos','L','Desa Banjarsari','1977-11-02','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(69,'SITI ZULAICHA, Amd.','P','Desa Banjarsari','1980-10-07','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(70,'RAISSA NEILAJASMINE PUTRI ZAISA','P','Desa Banjarsari','2005-08-26','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(71,'FILIA AYDIN NAURA PUTRI ZAISA','P','Desa Banjarsari','2009-03-18','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(72,'RAZIQ ABDILLAH ASKA PUTRA ZAISA','L','Desa Banjarsari','2010-12-22','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(73,'WAHYUDI TAUFAN SANTOSO','L','Desa Banjarsari','1988-05-08','Islam','Warga','Dukuhan Nayu','21','01','FAMILI LAIN','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(74,'MIMINAMINEM','P','Desa Banjarsari','1961-10-28','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(75,'RIZAL ADHETYA KURNIAWAN','L','Desa Banjarsari','1996-07-25','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','20','2025-12-26 09:30:53','2025-12-26 14:34:14'),(76,'SURATI','P','Desa Banjarsari','1956-05-15','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(77,'TUTIK SURYANTI KADARSIH ','P','Desa Banjarsari','1973-05-02','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(78,'NGATIMAN','L','Desa Banjarsari','1971-11-09','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(79,'ISMIATUN','P','Desa Banjarsari','1971-05-14','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(80,'NGATINEM','P','Desa Banjarsari','1956-01-06','Islam','Warga','Dukuhan Nayu','21','01','ORANG TUA','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(81,'BAMBANG SURYADI','L','Desa Banjarsari','1959-10-25','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(82,'YESICA SARI SURYANINGRUM','P','Desa Banjarsari','1996-06-29','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','23','2025-12-26 09:30:53','2025-12-26 14:34:14'),(83,'RIYALDI KRISNA PUTRA PAMUNGKAS','L','Desa Banjarsari','2004-09-02','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','23','2025-12-26 09:30:53','2025-12-26 14:34:14'),(84,'Ir. ALMUNAWAR, M.Si','L','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(85,'Ir. DEWI HADIYANI M.Kes','P','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(86,'ALDY FARIZ ACHSANTA','L','Desa Banjarsari','1992-01-19','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(87,'SITI SUSILO HAPSARI','P','Desa Banjarsari','1994-01-29','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(88,'RIZAL AKBAR ALDYAN','P','Desa Banjarsari','1995-01-07','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(89,'ELVITA PUSPA ALDYNA','P','Desa Banjarsari','1996-10-30','Islam','Warga','Dukuhan Nayu','21','01','FAMILI LAIN','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(90,'KATIMO, S.Pd., M.Pd.','L','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(91,'TUTI SUSILOWATI','P','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(92,'PARMINI','P','Desa Banjarsari','1970-11-12','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(93,'MIKO PUTRA BAGASKARA','L','Desa Banjarsari','1997-11-05','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','28','2025-12-26 09:30:53','2025-12-26 14:34:14'),(94,'BOGGY MUKTI SANJAYA','L','Desa Banjarsari','2003-07-21','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','28','2025-12-26 09:30:53','2025-12-26 14:34:14'),(95,'TITIN MASTUROH HENDI','P','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(96,'H. BAMBANG SUGIYANTO','L','Desa Banjarsari','1956-06-27','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(97,'SUPARNO ','L','Desa Banjarsari','1973-12-21','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(98,'PUTRI HENDRAWATI','P','Desa Banjarsari','1976-03-15','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(99,'FITRIANA WULNDARI','P','Desa Banjarsari','1997-12-12','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(100,'DANISSA RARAS PUTRI','P','Desa Banjarsari','2003-12-07','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','6','2025-12-26 09:30:25','2025-12-26 14:34:14'),(101,'SURATMIN','L','Desa Banjarsari','1961-06-16','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(102,'SRI SAMIYATI','P','Desa Banjarsari','1966-02-01','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(103,'MUH DANDI SETIAWAN','L','Desa Banjarsari','1998-11-28','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','7','2025-12-26 09:30:25','2025-12-26 14:34:14'),(104,'SAIMIN','L','Desa Banjarsari','1956-12-16','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(105,'SARNI','P','Desa Banjarsari','1962-11-06','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(106,'YUDI ANANTO','L','Desa Banjarsari','1993-06-16','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(107,'NOVITRI HANDAYANI','P','Desa Banjarsari','1990-07-27','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(108,'SHAHIA KAYLA YOVIE','P','Desa Banjarsari','2019-03-10','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(109,'SUMEDI ARI WIBOWO, AMa','L','Desa Banjarsari','1976-03-05','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(110,'ADIK MINAWATI','P','Desa Banjarsari','1984-05-18','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(111,'AZZAH YUMNA NADIVA WIBOWO','P','Desa Banjarsari','2006-07-29','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','10','2025-12-26 09:30:25','2025-12-26 14:34:14'),(112,'AZFER ALHANAN WIBOWO','L','Desa Banjarsari','2016-06-01','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(113,'SILVANUS RUDI TRIYONO','L','Desa Banjarsari','1977-12-06','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(114,'MARTA SUMARIYANI','P','Desa Banjarsari','1975-11-24','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(115,'CINTA PUTRI IMMANUEL','P','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','11','2025-12-26 09:30:25','2025-12-26 14:34:14'),(116,'KEVIN LI EMANUEL','L','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(117,'LANANG GALIH PRAYOGA','L','Desa Banjarsari','1983-10-15','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(118,'RANI AGUSTINA','P','Desa Banjarsari','1985-10-08','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(119,'RAFARDHAN BIMATAMA PRAYOGA','L','Desa Banjarsari','2009-06-10','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','12','2025-12-26 09:30:25','2025-12-26 14:34:14'),(120,'HARTUTIK','P','Desa Banjarsari','1970-06-02','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(121,'RIFKI MURTADHO','L','Desa Banjarsari','2001-12-28','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','13','2025-12-26 09:30:25','2025-12-26 14:34:14'),(122,'RIFKA HUSNA AMALIA','P','Desa Banjarsari','2004-11-20','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','13','2025-12-26 09:30:25','2025-12-26 14:34:14'),(123,'MEILIA AYU RAHMAWATI','P','Desa Banjarsari',NULL,'Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','13','2025-12-26 09:30:25','2025-12-26 14:34:14'),(124,'SURADI','L','Desa Banjarsari','1975-01-21','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(125,'SUKAMI','P','Desa Banjarsari','1975-07-31','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(126,'KIFDIA RISKI SETIAWAN','L','Desa Banjarsari','1996-04-27','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','14','2025-12-26 09:30:25','2025-12-26 14:34:14'),(127,'KETRIN RIEKE SILVIANA','P','Desa Banjarsari','2000-12-04','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','14','2025-12-26 09:30:25','2025-12-26 14:34:14'),(128,'MADIYO','L','Desa Banjarsari','1979-03-05','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(129,'ISWANTO','L','Desa Banjarsari','1986-07-30','Islam','Warga','Dukuhan Nayu','21','01','FAMILI LAIN','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:25','2025-12-26 14:34:14'),(130,'CAHYA DARMOKO, S.T.','L','Desa Banjarsari','1989-12-26','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(131,'SARASWATI KARTIKASARI,S.Pd, M.Pd','P','Desa Banjarsari','1982-09-21','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(132,'RASHIDA RASYA DARMOKO','P','Desa Banjarsari','2018-10-22','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(133,'PARTI','P','Desa Banjarsari','1970-06-15','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(134,'PAIDI','L','Desa Banjarsari','1968-06-01','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(135,'HARYANI','P','Desa Banjarsari','1970-01-30','Islam','Warga','Dukuhan Nayu','21','01','ISTRI','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(136,'RAHMAT APRIYANTO','L','Desa Banjarsari','1997-04-21','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','3','2025-12-26 09:30:53','2025-12-26 14:34:14'),(137,'TAUFIQ RIYADI','L','Desa Banjarsari','2003-01-01','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','3','2025-12-26 09:30:53','2025-12-26 14:34:14'),(138,'YUSUF KURNIAWAN','L','Desa Banjarsari','2014-03-06','Islam','Warga','Dukuhan Nayu','21','01','ANAK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14'),(139,'SUHARNO, ST','L','Desa Banjarsari','1978-05-23','Islam','Warga','Dukuhan Nayu','21','01','KK','Warga Tetap','Dukuhan, RW 21, RT 01, Kelurahan Banjarsari','2025-12-26 09:30:53','2025-12-26 14:34:14');
/*!40000 ALTER TABLE `warga` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-27  5:58:26
