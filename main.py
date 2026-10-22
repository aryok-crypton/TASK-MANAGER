from datetime import datetime

# Data awal untuk percobaan
daftar_tugas = [
    
]

def hitung_skor_prioritas(tenggat_str, kesulitan):
    """
    Fungsi cerdas untuk menghitung prioritas berdasarkan sisa hari dan kesulitan.
    """
    try:
        tenggat_dt = datetime.strptime(tenggat_str, "%Y-%m-%d").date()
        hari_ini = datetime.now().date()
        sisa_hari = (tenggat_dt - hari_ini).days
        
        # Jika deadline sudah lewat
        if sisa_hari < 0:
            return 999, "TERLAMBAT! 🚨", sisa_hari
        
        # Formula Sederhana Prioritas:
        # Semakin kecil sisa_hari, bobot waktu makin besar.
        # Bobot Waktu = (10 - sisa_hari) [maksimal rentang 10 hari]
        bobot_waktu = max(1, 10 - sisa_hari)
        skor = (kesulitan * 2) + bobot_waktu
        
        if skor >= 12 or sisa_hari <= 1:
            label = "TINGGI (Mendesak) 🔥"
        elif skor >= 7:
            label = "SEDANG ⚠️"
        else:
            label = "RENDAH ☕"
            
        return skor, label, sisa_hari
    except ValueError:
        return 0, "Format Tanggal Salah", 0

def tampilkan_tugas_cerdas():
    """Menampilkan tugas yang diurutkan berdasarkan prioritas tertinggi"""
    print("\n==================================================")
    print("      DAFTAR TUGAS (DIURUTKAN BERDASARKAN PRIORITAS) ")
    print("==================================================")
    
    if not daftar_tugas:
        print("Belum ada tugas yang tercatat. Bebas tugas!")
        return

    # Urutkan tugas secara otomatis berdasarkan skor prioritas terbanyak
    tugas_terurut = sorted(
        daftar_tugas, 
        key=lambda x: hitung_skor_prioritas(x['tenggat'], x['kesulitan'])[0], 
        reverse=True
    )
    
    for i, t in enumerate(tugas_terurut, 1):
        skor, label_prioritas, sisa_hari = hitung_skor_prioritas(t['tenggat'], t['kesulitan'])
        
        print(f"{i}. [{t['status']}] - Prioritas: {label_prioritas}")
        print(f"   Mata Pelajaran : {t['mapel']}")
        print(f"   Tugas          : {t['tugas']}")
        print(f"   Tenggat Waktu  : {t['tenggat']} ({sisa_hari} hari lagi)")
        print(f"   Kesulitan      : {t['kesulitan']}/5")
        print("-" * 50)

def tambah_tugas():
    """Fungsi tambah tugas dengan input tingkat kesulitan"""
    print("\n--- TAMBAH TUGAS BARU ---")
    mapel = input("Masukkan Nama Mata Pelajaran        : ")
    tugas = input("Masukkan Deskripsi Tugas           : ")
    tenggat = input("Masukkan Tenggat (Date-Month-Year)      : ")
    
    try:
        # Validasi format tanggal
        datetime.strptime(tenggat, "%Y-%m-%d")
        
        # Input tingkat kesulitan (1-5)
        kesulitan = int(input("Tingkat Kesulitan Tugas (Skala 1-5) : "))
        if kesulitan < 1 or kesulitan > 5:
            print(" Kesulitan harus di antara 1 sampai 5. Diset otomatis ke 3.")
            kesulitan = 3
            
        new_item = {
            "mapel": mapel,
            "tugas": tugas,
            "tenggat": tenggat,
            "kesulitan": kesulitan,
            "status": "Belum Selesai"
        }
        daftar_tugas.append(new_item)
        print(" Sukses! Tugas baru berhasil dianalisis & ditambahkan.")
    except ValueError:
        print(" Input tidak valid! Pastikan tanggal sesuai YYYY-MM-DD dan kesulitan berupa angka.")

def main():
    while True:
        print("\n========================================")
        print("   SMART STUDY MANAGER (STARTUP VERSION) ")
        print("========================================")
        print("1. Lihat Daftar Tugas (Smart Priority)")
        print("2. Tambah Tugas Baru")
        print("3. Keluar")
        
        pilihan = input("Pilih menu (1-3): ")
        if pilihan == "1":
            tampilkan_tugas_cerdas()
        elif pilihan == "2":
            tambah_tugas()
        elif pilihan == "3":
            print("\nTerima kasih, Sobat! Selamat melanjutkan belajar.")
            break
        else:
            print("\nPilihan tidak valid!")

if __name__ == "__main__":
    main()
