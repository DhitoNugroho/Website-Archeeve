-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 13 Jun 2025 pada 12.42
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `archeeve-web`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `articles`
--

CREATE TABLE `articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `views_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `articles`
--

INSERT INTO `articles` (`id`, `user_id`, `category_id`, `title`, `slug`, `content`, `image`, `status`, `published_at`, `views_count`, `created_at`, `updated_at`) VALUES
(1, 13, 22, 'Valorant Game', 'valorant-game-1', 'Valorant adalah game tembak-menembak taktis berbasis tim yang dikembangkan oleh Riot Games, dikenal luas karena menggabungkan elemen gameplay dari Counter-Strike dan Overwatch. Dalam game ini, dua tim yang masing-masing terdiri dari lima pemain saling bertarung untuk menyelesaikan objektif seperti menanam atau menjinakkan spike (bom). Yang membuat Valorant unik adalah kehadiran agen dengan kemampuan khusus yang dapat digunakan untuk bertahan, menyerang, atau memberi keuntungan taktis kepada tim.\r\n\r\nSelain mekanisme gameplay yang kompetitif, Valorant juga menuntut koordinasi tim dan strategi yang matang. Pemain tidak hanya harus memiliki aim yang akurat, tetapi juga harus bisa membaca permainan lawan dan beradaptasi dengan cepat. Setiap agen memiliki peran yang berbeda — dari duelist yang fokus pada serangan, hingga controller yang mengatur jalannya pertempuran — yang semuanya saling melengkapi dalam formasi tim.\r\n\r\nKomunitas Valorant terus berkembang sejak peluncurannya pada tahun 2020, dengan dukungan turnamen e-sports global seperti VCT (Valorant Champions Tour). Riot Games juga secara rutin memperbarui game dengan konten baru seperti map, agen, dan balancing patch untuk menjaga keseimbangan permainan. Dengan kombinasi antara gameplay yang kompetitif, karakter yang menarik, dan dukungan komunitas yang kuat, Valorant berhasil menjadi salah satu game FPS paling populer di dunia saat ini.', '/storage/articles_images/Vfbg6FbxDm004WbpkTyJtyNNf4UvuSKTFQYvtGGs.jpg', 'published', '2025-06-03 07:15:03', 16, '2025-06-03 07:15:03', '2025-06-10 18:20:04'),
(2, 13, 3, 'Pesona Gunung Bromo', 'pesona-gunung-bromo-2', 'Gunung Bromo adalah salah satu destinasi wisata alam paling terkenal di Indonesia, terletak di kawasan Taman Nasional Bromo Tengger Semeru, Jawa Timur. Dikenal dengan pemandangan matahari terbitnya yang menakjubkan, Bromo menawarkan pengalaman alam yang luar biasa bagi para wisatawan. Dari Puncak Penanjakan, pengunjung bisa menyaksikan panorama gunung yang dikelilingi lautan pasir luas dan kabut pagi yang memesona.\r\n\r\nSelain keindahan alamnya, Bromo juga memiliki nilai budaya yang kuat. Suku Tengger, penduduk asli di sekitar gunung, secara rutin menggelar upacara Yadnya Kasada, sebuah tradisi persembahan kepada Sang Hyang Widhi dan para leluhur. Dalam upacara ini, hasil bumi dilemparkan ke kawah Gunung Bromo sebagai bentuk rasa syukur dan permohonan keselamatan. Tradisi ini menjadi daya tarik tersendiri yang menggabungkan spiritualitas dan pariwisata.\r\n\r\n\r\nBromo bukan hanya tempat untuk berfoto atau melihat pemandangan; ia juga merupakan simbol kekuatan alam dan kearifan lokal. Dengan akses yang semakin mudah dan fasilitas pariwisata yang berkembang, Gunung Bromo tetap menjadi tujuan favorit bagi para pelancong, baik dari dalam maupun luar negeri. Setiap perjalanan ke Bromo selalu meninggalkan kesan yang dalam dan menginspirasi untuk kembali lagi.', '/storage/articles_images/Q4KA4CDmv7D2TkWfDD81dDrJgC97CVAoT9V8aGIj.jpg', 'published', '2025-06-03 07:32:15', 12, '2025-06-03 07:32:15', '2025-06-03 08:55:36'),
(3, 13, 13, 'Bitcoin Crypto', 'bitcoin-crypto-3', 'Bitcoin adalah mata uang kripto pertama di dunia yang diperkenalkan pada tahun 2009 oleh seseorang (atau sekelompok orang) dengan nama samaran Satoshi Nakamoto. Berbasis teknologi blockchain, Bitcoin memungkinkan transaksi keuangan dilakukan tanpa perantara seperti bank atau pemerintah. Sistemnya yang terdesentralisasi dan transparan membuat Bitcoin menjadi simbol kebebasan finansial serta alat lindung nilai dari inflasi di mata sebagian investor.\r\n\r\nSeiring waktu, Bitcoin berkembang dari sekadar alat tukar digital menjadi aset investasi yang banyak diminati. Banyak orang melihat Bitcoin sebagai “emas digital” karena jumlahnya yang terbatas—hanya akan ada 21 juta koin yang pernah beredar. Hal ini menciptakan kelangkaan yang membuat nilainya cenderung meningkat dalam jangka panjang. Fluktuasi harga yang tinggi juga menjadikannya menarik bagi para trader dan spekulan.\r\n\r\nMeski kontroversial dan sempat diragukan, Bitcoin kini telah diakui secara luas dan bahkan diadopsi oleh berbagai institusi keuangan besar. Beberapa negara mulai menjajaki potensi Bitcoin sebagai bagian dari sistem keuangan mereka, sementara yang lain masih membatasi penggunaannya. Dengan perkembangan teknologi dan meningkatnya kesadaran masyarakat terhadap keuangan digital, Bitcoin diyakini akan terus memainkan peran penting dalam masa depan ekonomi global.', '/storage/articles_images/HqohnNE3yO21Em3NKTXmgOGUlWnEIguxzyCJEVk3.jpg', 'published', '2025-06-03 07:35:16', 54, '2025-06-03 07:35:16', '2025-06-04 01:59:51'),
(4, 13, 1, 'Artificial Intelegent (AI)', 'artificial-intelegent-ai-68401988d4081', 'Kecerdasan Buatan, atau Artificial Intelligence (AI), adalah cabang ilmu komputer yang berfokus pada penciptaan sistem yang dapat meniru kemampuan berpikir manusia, seperti belajar, menganalisis, dan mengambil keputusan. Teknologi ini kini menjadi bagian penting dalam berbagai sektor, mulai dari industri, kesehatan, pendidikan, hingga hiburan. Dari asisten virtual seperti Siri dan ChatGPT hingga mobil otonom dan sistem diagnosis medis, AI telah membawa efisiensi dan inovasi dalam kehidupan sehari-hari.\r\n\r\nSalah satu kekuatan utama AI terletak pada kemampuannya memproses data dalam jumlah besar dengan kecepatan tinggi. Dengan teknik seperti machine learning dan deep learning, AI dapat mengenali pola dan memprediksi hasil lebih akurat daripada manusia dalam banyak kasus. Ini menjadikan AI sangat berguna dalam pengambilan keputusan berbasis data, otomatisasi proses, serta pengembangan teknologi masa depan seperti robotika dan augmented reality.\r\n\r\nNamun, perkembangan AI juga menimbulkan tantangan dan kekhawatiran, mulai dari isu privasi, etika, hingga potensi hilangnya lapangan kerja. Oleh karena itu, penting bagi masyarakat dan pembuat kebijakan untuk memahami dan mengatur penggunaan AI dengan bijak. Dengan pendekatan yang tepat, AI tidak hanya akan mempercepat kemajuan teknologi, tetapi juga menciptakan solusi yang bermanfaat bagi umat manusia secara menyeluruh.', '/storage/articles_images/ERUwNuivx5F1p01ssmIpt1YE8OelRoYCtyMJBiVn.jpg', 'published', '2025-06-04 03:01:44', 20, '2025-06-04 03:01:44', '2025-06-04 07:33:21'),
(5, 13, 3, 'Keindahan Raja ampat', 'keindahan-raja-ampat-5', 'Raja Ampat adalah sebuah kepulauan yang terletak di ujung barat Pulau Papua, Indonesia. Terdiri dari lebih dari 1.500 pulau kecil, atol, dan beting, kawasan ini terkenal karena keindahan alamnya yang luar biasa dan kekayaan hayati lautnya. Nama Raja Ampat sendiri berarti \"Empat Raja\", merujuk pada empat pulau utama yaitu Waigeo, Batanta, Salawati, dan Misool, yang masing-masing dipimpin oleh seorang raja menurut legenda setempat.\r\n\r\nKeanekaragaman hayati di perairan Raja Ampat termasuk yang tertinggi di dunia. Kawasan ini merupakan surga bagi para penyelam dan pencinta laut, karena dihuni oleh lebih dari 1.300 spesies ikan, 600 jenis terumbu karang, dan berbagai spesies langka seperti pari manta dan penyu laut. Selain bawah lautnya yang memukau, daratan Raja Ampat juga menyimpan keindahan hutan tropis, laguna biru jernih, dan kehidupan budaya masyarakat adat yang masih terjaga.\r\n\r\nPariwisata di Raja Ampat semakin berkembang, namun tetap dijalankan dengan prinsip ekowisata agar keaslian alam dan budaya tetap terpelihara. Wisatawan dapat menikmati aktivitas seperti snorkeling, diving, kayaking, hingga mengunjungi desa-desa tradisional dan melihat tarian adat. Dengan pesona alam yang masih alami dan suasana yang tenang, Raja Ampat menjadi destinasi ideal bagi siapa pun yang ingin menikmati keindahan Indonesia yang autentik.', '/storage/articles_images/8eRwc8LaOznBSG6WNL5zoVI4hlUSwkDjPD2Ij0pQ.jpg', 'published', '2025-06-05 01:20:10', 4, '2025-06-05 01:20:10', '2025-06-05 01:43:21'),
(6, 14, 16, 'PesonaIndonesia', 'pesonaindonesia-6', 'Pesona Indonesia adalah sebuah kampanye pariwisata Indonesia yang dicanangkan oleh Kementerian Pariwisata RI untuk mempromosikan tempat-tempat wisata di Indonesia. Nama \"Pesona Indonesia\" digunakan untuk pasar domestik, sedangkan untuk pasar internasional yang umumnya berbahasa Inggris digunakan nama Wonderful Indonesia.\n\nKampanye Pesona Indonesia beserta logonya berawal dari Tahun Kunjungan Indonesia 2008 (Visit Indonesia 2008), yang diluncurkan oleh Departemen Kebudayaan dan Pariwisata RI – nama kementerian tersebut sebelumnya – pada tanggal 26 Desember 2007.[1] Kampanye tersebut dibuat dalam rangka merayakan 100 tahun kebangkitan nasional Indonesia,[2] yang dimulai dari pendirian Budi Utomo pada tahun 1908. Kampanye ini kemudian dilanjutkan dengan nama serupa pada tahun 2009 dan 2010, hingga pada tahun 2011 saat pemerintah memutuskan mengganti nama kampanye menjadi Wonderful Indonesia.[3] Nama \"Pesona Indonesia\" baru mulai digunakan pada tahun 2015.[4] Di tahun yang sama pula lagu tema untuk kampanye ini diluncurkan; lagu yang masing-masing berbahasa Indonesia dan Inggris tersebut dinyanyikan oleh Rossa.[5]', '/storage/articles_images/3tSNDQeCQTCVNniLyb4vSsIE4xarAqnGasyagkLP.jpg', 'published', '2025-06-10 07:45:52', 2, '2025-06-10 07:45:52', '2025-06-10 08:00:35'),
(7, 13, 5, 'Pembantaian Indonesia', 'pembantaian-indonesia-6848e6d5443e0', 'Timnas Indonesia harus menelan pil pahit usai dibantai Jepang dengan skor telak 6-0 dalam laga persahabatan yang berlangsung semalam. Sejak peluit awal dibunyikan, Jepang langsung tampil agresif dan mendominasi jalannya pertandingan. Kombinasi permainan cepat, akurasi umpan, serta pressing ketat yang diterapkan oleh Samurai Biru membuat lini pertahanan Indonesia kewalahan dan sulit keluar dari tekanan.\r\n\r\nSepanjang pertandingan, lini tengah Indonesia kesulitan mengimbangi tempo permainan Jepang. Kesalahan individu dan buruknya koordinasi lini belakang dimanfaatkan dengan baik oleh para pemain Jepang untuk menciptakan peluang-peluang berbahaya. Kiper Indonesia pun dipaksa bekerja ekstra, namun gempuran serangan lawan yang datang bertubi-tubi membuat gawang Garuda harus kebobolan enam gol tanpa balas.\r\n\r\nKekalahan telak ini menjadi bahan evaluasi serius bagi timnas Indonesia, terutama dalam menghadapi tim-tim besar dengan kualitas permainan kelas dunia. Pelatih dan jajaran staf harus segera melakukan pembenahan, baik dari sisi taktik, mental bertanding, maupun penguatan fisik pemain. Meski hasil ini mengecewakan, pengalaman menghadapi tim sekelas Jepang diharapkan bisa menjadi pelajaran berharga untuk meningkatkan performa timnas di laga-laga internasional berikutnya.', '/storage/articles_images/Nuj59iObK37h23bQr39qIlsQxFtm260B8mN1Mfyz.jpg', 'published', '2025-06-10 19:15:49', 6, '2025-06-10 19:15:49', '2025-06-10 19:19:40');

-- --------------------------------------------------------

--
-- Struktur dari tabel `article_tag`
--

CREATE TABLE `article_tag` (
  `article_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `article_tag`
--

INSERT INTO `article_tag` (`article_id`, `tag_id`) VALUES
(1, 14),
(1, 19),
(1, 25),
(2, 7),
(3, 17),
(3, 31),
(3, 32),
(4, 26),
(4, 33),
(5, 20),
(5, 34),
(6, 35),
(7, 38),
(7, 39);

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Teknologi', 'teknologi', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(2, 'Gaya Hidup', 'gaya-hidup', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(3, 'Perjalanan', 'perjalanan', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(4, 'Kuliner', 'kuliner', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(5, 'Olahraga', 'olahraga', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(6, 'Pendidikan', 'pendidikan', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(7, 'Bisnis', 'bisnis', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(8, 'Seni & Budaya', 'seni-budaya', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(9, 'Kesehatan', 'kesehatan', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(10, 'Opini', 'opini', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(11, 'Berita', 'berita', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(12, 'Pengembangan Diri', 'pengembangan-diri', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(13, 'Keuangan', 'keuangan', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(14, 'Hobi', 'hobi', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(15, 'Otomotif', 'otomotif', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(16, 'Musik', 'musik', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(17, 'Film', 'film', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(18, 'Sains', 'sains', '2025-06-03 06:54:38', '2025-06-03 06:54:38'),
(19, 'Lingkungan', 'lingkungan', '2025-06-03 06:54:38', '2025-06-03 06:54:38'),
(20, 'Sejarah', 'sejarah', '2025-06-03 06:54:38', '2025-06-03 06:54:38'),
(21, 'Fotografi', 'fotografi', '2025-06-03 06:54:38', '2025-06-03 06:54:38'),
(22, 'Gaming', 'gaming', '2025-06-03 06:54:38', '2025-06-03 06:54:38'),
(23, 'Parenting', 'parenting', '2025-06-03 06:54:38', '2025-06-03 06:54:38'),
(24, 'Resep', 'resep', '2025-06-03 06:54:38', '2025-06-03 06:54:38'),
(25, 'DIY & Kerajinan', 'diy-kerajinan', '2025-06-03 06:54:38', '2025-06-03 06:54:38'),
(26, 'Korea', 'korea', '2025-06-10 08:15:19', '2025-06-10 08:15:19'),
(27, 'Japan', 'japan', '2025-06-10 18:24:15', '2025-06-10 18:24:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `article_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `guest_email` varchar(255) DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `article_id`, `content`, `guest_name`, `guest_email`, `approved`, `created_at`, `updated_at`) VALUES
(2, 13, 4, 'baguss', NULL, NULL, 1, '2025-06-04 04:25:06', '2025-06-05 01:23:03'),
(3, 13, 5, 'bagus', NULL, NULL, 1, '2025-06-05 01:20:32', '2025-06-05 01:22:58'),
(4, 13, 5, 'indah', NULL, NULL, 1, '2025-06-05 01:43:28', '2025-06-05 01:44:56'),
(5, 14, 1, 'Bagus artikelnya.', NULL, NULL, 1, '2025-06-10 07:30:03', '2025-06-10 08:18:54'),
(7, 13, 7, 'walawee', NULL, NULL, 1, '2025-06-10 19:16:30', '2025-06-10 19:19:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_05_23_005128_create_categories_table', 1),
(6, '2025_05_23_005129_create_tags_table', 1),
(7, '2025_05_23_005130_create_articles_table', 1),
(8, '2025_05_23_005131_create_article_tag_pivot_table', 1),
(9, '2025_05_23_005131_create_comments_table', 1),
(10, '2025_06_03_170930_add_profile_fields_to_users_table', 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tags`
--

INSERT INTO `tags` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Programming', 'programming', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(2, 'Web Development', 'web-development', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(3, 'Laravel', 'laravel', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(4, 'React', 'react', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(5, 'JavaScript', 'javascript', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(6, 'Resep Masakan', 'resep-masakan', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(7, 'Destinasi Wisata', 'destinasi-wisata', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(8, 'Tips & Trik', 'tips-trik', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(9, 'Review Produk', 'review-produk', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(10, 'Tutorial', 'tutorial', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(11, 'Startup', 'startup', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(12, 'Produktivitas', 'produktivitas', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(13, 'Kesehatan Mental', 'kesehatan-mental', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(14, 'Indonesia', 'indonesia', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(15, 'Teknologi Terbaru', 'teknologi-terbaru', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(16, 'Belajar Online', 'belajar-online', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(17, 'Investasi', 'investasi', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(18, 'Fotografi', 'fotografi', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(19, 'Gaming', 'gaming', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(20, 'Alam', 'alam', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(21, 'Tutorial Pemula', 'tutorial-pemula', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(22, 'Tips Produktif', 'tips-produktif', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(23, 'Wisata Murah', 'wisata-murah', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(24, 'Makanan Viral', 'makanan-viral', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(25, 'Game Indie', 'game-indie', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(26, 'AI', 'ai', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(27, 'Machine Learning', 'machine-learning', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(28, 'Data Science', 'data-science', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(29, 'Cybersecurity', 'cybersecurity', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(30, 'Cloud Computing', 'cloud-computing', '2025-06-03 07:11:44', '2025-06-03 07:11:44'),
(31, 'crypto', 'crypto', '2025-06-03 07:59:29', '2025-06-03 07:59:29'),
(32, 'trader', 'trader', '2025-06-03 09:01:15', '2025-06-03 09:01:15'),
(33, 'chatgpt', 'chatgpt', '2025-06-04 03:01:45', '2025-06-04 03:01:45'),
(34, 'papua', 'papua', '2025-06-05 01:20:10', '2025-06-05 01:20:10'),
(35, 'wisata', 'wisata', '2025-06-10 07:45:52', '2025-06-10 07:45:52'),
(36, 'mobil', 'mobil', '2025-06-10 08:16:37', '2025-06-10 08:16:37'),
(37, 'motor', 'motor', '2025-06-10 18:25:33', '2025-06-10 18:25:33'),
(38, 'pembantaian', 'pembantaian', '2025-06-10 19:15:49', '2025-06-10 19:15:49'),
(39, 'bola', 'bola', '2025-06-10 19:15:49', '2025-06-10 19:15:49');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `profile_image_path` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `bio`, `profile_image_path`, `profile_image_url`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@example.com', NULL, NULL, NULL, NULL, '$2y$12$40aWG70xWwpLsPN3w/ix1uPRigm55AU7K8oRpYWMgsvJ3SaU5HqDq', 'admin', NULL, '2025-06-03 06:54:35', '2025-06-03 07:07:24'),
(5, 'Clay Sporer', 'fadel.joe@example.com', NULL, NULL, NULL, '2025-06-03 06:54:37', '$2y$12$zTcLqxhf53.v5cDhwoxQkOJfYoSlKs2mV62HxHvP92dtOMaJEBtuC', 'user', 'R4elwYQeZM', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(6, 'Lonny Kuphal IV', 'moconner@example.org', NULL, NULL, NULL, '2025-06-03 06:54:37', '$2y$12$zTcLqxhf53.v5cDhwoxQkOJfYoSlKs2mV62HxHvP92dtOMaJEBtuC', 'user', 'MMNTWad7fU', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(7, 'Zella Schneider', 'bahringer.amanda@example.org', NULL, NULL, NULL, '2025-06-03 06:54:37', '$2y$12$zTcLqxhf53.v5cDhwoxQkOJfYoSlKs2mV62HxHvP92dtOMaJEBtuC', 'user', 'M7o6xQX0M6', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(8, 'Patrick Bauch', 'leonardo.erdman@example.org', NULL, NULL, NULL, '2025-06-03 06:54:37', '$2y$12$zTcLqxhf53.v5cDhwoxQkOJfYoSlKs2mV62HxHvP92dtOMaJEBtuC', 'user', 'rr2YAEwEUW', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(9, 'Prof. Carmelo Bechtelar', 'mollie.friesen@example.org', NULL, NULL, NULL, '2025-06-03 06:54:37', '$2y$12$zTcLqxhf53.v5cDhwoxQkOJfYoSlKs2mV62HxHvP92dtOMaJEBtuC', 'user', '9k1rTm74x9', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(10, 'Beth Gleichner', 'shakira22@example.com', NULL, NULL, NULL, '2025-06-03 06:54:37', '$2y$12$zTcLqxhf53.v5cDhwoxQkOJfYoSlKs2mV62HxHvP92dtOMaJEBtuC', 'user', 'jhoIJ72Iio', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(11, 'Shyann Upton', 'orn.libbie@example.net', NULL, NULL, NULL, '2025-06-03 06:54:37', '$2y$12$zTcLqxhf53.v5cDhwoxQkOJfYoSlKs2mV62HxHvP92dtOMaJEBtuC', 'user', '4TMfn6b75U', '2025-06-03 06:54:37', '2025-06-03 06:54:37'),
(13, 'dhito nugroho', 'dhito123@gmail.com', 'halo', 'profile_pictures/lww0NxSIAQNdGHNMKNlmPqR87vtqbZMDzZyxxiOI.jpg', '/storage/profile_pictures/lww0NxSIAQNdGHNMKNlmPqR87vtqbZMDzZyxxiOI.jpg', NULL, '$2y$12$bnFdRPORAUCQrlaOFUL7/.SXtdLIejNvKx0DgTbOJl9qVrCELhkpq', 'user', NULL, '2025-06-03 07:02:38', '2025-06-10 19:17:19'),
(14, 'Kharis Hendroh', 'kharis123@gmail.com', 'Hobi saya menulis', NULL, NULL, NULL, '$2y$12$dieaz.s4nd3vusKx/10.pu.6GKUtVhqTaqwBAZDEd5RzGSPAKG4Pa', 'user', NULL, '2025-06-10 07:01:05', '2025-06-10 18:21:32'),
(15, 'rifky ramadan', 'rifkyramadan@gmail.com', NULL, NULL, NULL, NULL, '$2y$12$InXY9zhCoB0IirFTPcCVQetIbHxNdbdeXpj/moZqzfQdRufsP7Z7G', 'user', NULL, '2025-06-10 08:09:51', '2025-06-10 08:09:51');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `articles_slug_unique` (`slug`),
  ADD KEY `articles_user_id_foreign` (`user_id`),
  ADD KEY `articles_category_id_foreign` (`category_id`);

--
-- Indeks untuk tabel `article_tag`
--
ALTER TABLE `article_tag`
  ADD PRIMARY KEY (`article_id`,`tag_id`),
  ADD KEY `article_tag_tag_id_foreign` (`tag_id`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Indeks untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_user_id_foreign` (`user_id`),
  ADD KEY `comments_article_id_foreign` (`article_id`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indeks untuk tabel `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tags_name_unique` (`name`),
  ADD UNIQUE KEY `tags_slug_unique` (`slug`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `articles`
--
ALTER TABLE `articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `articles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `article_tag`
--
ALTER TABLE `article_tag`
  ADD CONSTRAINT `article_tag_article_id_foreign` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `article_tag_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_article_id_foreign` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
