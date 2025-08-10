// Menunggu seluruh konten halaman dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // --- Mengambil elemen-elemen dari HTML ---
    const startButton = document.getElementById('start-button');
    const startSection = document.getElementById('start-section');
    const progressSection = document.getElementById('progress-section');
    
    // Elemen untuk proses unduhan
    const downloadContainer = document.getElementById('download-container');
    const downloadProgressBar = document.getElementById('download-progress-bar');
    const downloadStatus = document.getElementById('download-status');
    const progressLabel = document.getElementById('progress-label');

    // Elemen untuk proses antrian
    const queueContainer = document.getElementById('queue-container');
    const queueTimer = document.getElementById('queue-timer');
    const queueLabel = document.getElementById('queue-label');

    // Elemen layar utama
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    // --- Variabel untuk simulasi ---
    const totalSizeMB = 10.00; // Ukuran file total dalam MB
    const downloadDuration = 4000; // Durasi simulasi unduhan dalam milidetik (4 detik)
    const queueDurationMinutes = 40; // Durasi antrian dalam menit (untuk tampilan)

    // --- Event Listener untuk Tombol Mulai ---
    startButton.addEventListener('click', () => {
        // Sembunyikan tombol mulai dan tampilkan bagian progress
        startSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        // Mulai simulasi unduhan
        simulateDownload();
    });

    /**
     * Mensimulasikan proses pengunduhan file.
     */
    function simulateDownload() {
        let downloadedMB = 0;
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / downloadDuration, 1);

            // Update ukuran yang sudah diunduh
            downloadedMB = progress * totalSizeMB;
            
            // Update progress bar
            downloadProgressBar.style.width = `${progress * 100}%`;
            
            // Update status teks
            downloadStatus.textContent = `${downloadedMB.toFixed(2)} MB / ${totalSizeMB.toFixed(2)} MB`;

            // Jika unduhan selesai
            if (progress >= 1) {
                clearInterval(interval);
                progressLabel.textContent = '✅ 1. Unduhan File Selesai';
                downloadProgressBar.classList.remove('bg-green-500');
                downloadProgressBar.classList.add('bg-cyan-500');
                
                // Tampilkan dan mulai simulasi antrian setelah jeda singkat
                setTimeout(() => {
                    queueContainer.classList.remove('hidden');
                    simulateQueue();
                }, 500);
            }
        }, 50); // Update setiap 50ms untuk animasi yang mulus
    }

    /**
     * Mensimulasikan waktu tunggu dalam antrian.
     * Waktu dipercepat: 1 detik nyata = 1 menit di timer
     */
    function simulateQueue() {
        let timeLeft = queueDurationMinutes;

        const interval = setInterval(() => {
            timeLeft--;

            // Format waktu menjadi MM:SS
            const minutes = Math.floor(timeLeft);
            const seconds = 0; // Detik selalu 00 karena kita mengurangi per menit
            const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            // Update timer di layar
            queueTimer.textContent = formattedTime;

            // Jika waktu antrian habis
            if (timeLeft <= 0) {
                clearInterval(interval);
                queueLabel.textContent = '✅ 2. Posisi Antrian Ditemukan';
                queueTimer.textContent = '00:00';
                queueTimer.classList.remove('text-yellow-400');
                queueTimer.classList.add('text-green-400');

                // Berikan akses setelah jeda singkat
                setTimeout(grantAccess, 1000);
            }
        }, 1000); // Interval 1 detik (1000 ms)
    }

    /**
     * Memberikan akses dengan menampilkan konten utama.
     */
    function grantAccess() {
        // Animasi fade out untuk layar pemuatan
        loadingScreen.classList.add('transition-opacity', 'duration-500', 'opacity-0');
        
        // Setelah animasi selesai, sembunyikan layar pemuatan dan tampilkan konten utama
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('transition-opacity', 'duration-500', 'opacity-100');
        }, 500);
    }
});
