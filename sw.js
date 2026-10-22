/**
 * ==========================================
 * SERVICE WORKER - CACHE & OFFLINE HANDLER
 * ==========================================
 * File ini berjalan di background browser untuk meng-cache 
 * aset statis sehingga web tetap bisa dibuka tanpa koneksi internet.
 */

// Nama versi cache (ubah versinya jika ada pembaruan aset besar-besaran)
const CACHE_NAME = 'portal-belajar-v1';

// Daftar file aset krusial yang wajib disimpan di memori cache browser
const ASSETS_TO_CACHE = [
    './index.html',
    './manifest.json',
    './css/style.css',
    './css/components.css',
    './css/darkmode.css',
    './js/app.js',
    './js/storage.js',
    './js/quiz-generator.js',
    './js/planner-streak.js',
    './js/subjects.js',
    './data/subjects-data.js',
    './data/cheatsheets.js'
];

/**
 * ==========================================
 * 1. EVENT: INSTALL SERVICE WORKER
 * ==========================================
 * Fungsi: Mengunduh dan menyimpan seluruh aset daftar di atas 
 * ke dalam Local Cache browser saat pertama kali PWA diinstal.
 */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Menginstal Service Worker & Melakukan Caching...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Menyimpan aset statis ke cache.');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

/**
 * ==========================================
 * 2. EVENT: ACTIVATE SERVICE WORKER
 * ==========================================
 * Fungsi: Membersihkan cache versi lama jika ada pembaruan nama cache,
 * memastikan aplikasi selalu memakai file versi terbaru.
 */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Mengaktifkan Service Worker baru...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Menghapus cache lama:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

/**
 * ==========================================
 * 3. EVENT: FETCH (PENGAMBILAN DATA/ASET)
 * ==========================================
 * Fungsi: Mencegat setiap permintaan (request) jaringan dari web,
 * lalu menyajikan file langsung dari cache jika perangkat sedang offline.
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Jika file ditemukan di cache, kembalikan versi cache
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Jika tidak ada di cache, ambil dari jaringan internet
                return fetch(event.request);
            })
            .catch(() => {
                // Fallback (opsional): Jika offline dan halaman tidak ada di cache
                console.log('[Service Worker] Gagal mengambil data, jaringan offline.');
            })
    );
});
