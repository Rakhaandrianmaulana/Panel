// Menunggu hingga seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // --- PENGAMBILAN ELEMEN DOM ---
    const elements = {
        btnLokasi: document.getElementById('btnLokasi'),
        statusLokasi: document.getElementById('statusLokasi'),
        textLokasi: document.getElementById('textLokasi'),
        badgeLokasi: document.getElementById('badgeLokasi'),
        btnAudio: document.getElementById('btnAudio'),
        statusAudio: document.getElementById('statusAudio'),
        textAudio: document.getElementById('textAudio'),
        badgeAudio: document.getElementById('badgeAudio'),
        infoPenyimpanan: document.getElementById('infoPenyimpanan'),
        detailLokasiWrapper: document.getElementById('detailLokasiWrapper'),
        lokasiDetail: document.getElementById('lokasiDetail'),
        koordinat: document.getElementById('koordinat'),
        btnSalinLokasi: document.getElementById('btnSalinLokasi'),
        btnSenter: document.getElementById('btnSenter'),
        btnGetar: document.getElementById('btnGetar'),
        btnPutarMusik: document.getElementById('btnPutarMusik'),
        player: document.getElementById('player'),
        volumeSlider: document.getElementById('volumeSlider'),
    };

    // Variabel state
    let senterAktif = false;
    let streamTrack = null;
    let locationWatchId = null;

    // --- FUNGSI UTILITAS ---

    /**
     * Memperbarui UI status izin
     * @param {string} type - 'lokasi' atau 'audio'
     * @param {string} state - 'granted', 'denied', atau 'prompt'
     */
    const updatePermissionUI = (type, state) => {
        const textEl = (type === 'lokasi') ? elements.textLokasi : elements.textAudio;
        const badgeEl = (type === 'lokasi') ? elements.badgeLokasi : elements.badgeAudio;
        const buttonEl = (type === 'lokasi') ? elements.btnLokasi : elements.btnAudio;

        badgeEl.className = 'status-badge'; // Reset class
        badgeEl.classList.add(state);
        badgeEl.textContent = state;
        buttonEl.disabled = (state === 'denied');

        switch (state) {
            case 'granted':
                textEl.textContent = 'Diizinkan';
                buttonEl.style.display = 'none'; // Sembunyikan tombol jika sudah diizinkan
                break;
            case 'denied':
                textEl.textContent = 'Ditolak';
                break;
            case 'prompt':
                textEl.textContent = 'Perlu Izin';
                break;
        }
    };

    /**
     * Menghitung dan menampilkan penggunaan localStorage
     */
    const updatePenyimpananInfo = () => {
        let totalBytes = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const value = localStorage.getItem(key);
                totalBytes += (key.length + value.length) * 2; // Perkiraan 2 bytes per karakter
            }
        }
        elements.infoPenyimpanan.innerHTML = `<span class="label">Penyimpanan Terpakai:</span> ${totalBytes.toLocaleString()} Bytes`;
    };

    // --- FUNGSI INTI ---

    // 1. LOKASI
    const tampilkanLokasi = (posisi) => {
        elements.detailLokasiWrapper.style.display = 'block';
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = posisi.coords;
        const detailText = `Latitude      : ${latitude}\nLongitude     : ${longitude}\nAkurasi       : ${accuracy} meter\n\nKetinggian    : ${altitude || 'N/A'} meter\nAkurasi Keting. : ${altitudeAccuracy || 'N/A'} meter\nArah          : ${heading || 'N/A'}\nKecepatan     : ${speed || 'N/A'}`;
        
        elements.koordinat.textContent = detailText;
        localStorage.setItem('detailLokasi', detailText);
        updatePenyimpananInfo();
    };

    const handleLokasiError = (error) => {
        elements.koordinat.textContent = `Error mendapatkan lokasi: ${error.message}`;
        if (error.code === 1) { // PERMISSION_DENIED
            updatePermissionUI('lokasi', 'denied');
            localStorage.setItem('permission_geolocation', 'denied');
            updatePenyimpananInfo();
        }
    };

    const mintaAksesLokasi = () => {
        if ('geolocation' in navigator) {
            if (locationWatchId) navigator.geolocation.clearWatch(locationWatchId); // Hapus listener lama
            locationWatchId = navigator.geolocation.watchPosition(tampilkanLokasi, handleLokasiError, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
            localStorage.setItem('permission_geolocation', 'granted');
            updatePermissionUI('lokasi', 'granted');
        } else {
            elements.koordinat.textContent = 'Geolocation tidak didukung di peramban ini.';
        }
    };

    const salinLokasi = () => {
        const textToCopy = elements.koordinat.textContent;
        // Fallback untuk browser lama
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Detail lokasi berhasil disalin!');
        } catch (err) {
            alert('Gagal menyalin. Coba salin secara manual.');
        }
        document.body.removeChild(textArea);
    };

    // 2. AUDIO
    const mintaAksesAudio = () => {
        if ('mediaDevices' in navigator) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    updatePermissionUI('audio', 'granted');
                    localStorage.setItem('permission_microphone', 'granted');
                    updatePenyimpananInfo();
                })
                .catch(() => {
                    updatePermissionUI('audio', 'denied');
                    localStorage.setItem('permission_microphone', 'denied');
                    updatePenyimpananInfo();
                });
        } else {
            elements.textAudio.textContent = 'MediaDevices tidak didukung.';
        }
    };

    // 3. SENTER
    const toggleSenter = async () => {
        // Logika senter tetap sama, karena ini adalah implementasi standar
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            try {
                if (!senterAktif) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    streamTrack = stream.getVideoTracks()[0];
                    await streamTrack.applyConstraints({ advanced: [{ torch: true }] });
                    senterAktif = true;
                    elements.btnSenter.textContent = 'Matikan Senter';
                    elements.btnSenter.classList.add('toggled');
                } else {
                    streamTrack.applyConstraints({ advanced: [{ torch: false }] });
                    streamTrack.stop();
                    senterAktif = false;
                    streamTrack = null;
                    elements.btnSenter.textContent = 'Nyalakan Senter';
                    elements.btnSenter.classList.remove('toggled');
                }
            } catch (error) {
                alert(`Error senter: ${error.message}. Pastikan Anda menggunakan perangkat dengan senter dan memberikan izin kamera.`);
            }
        } else {
            alert('Fitur ini tidak didukung di peramban Anda.');
        }
    };

    // 4. GETAR
    const getarkanPerangkat = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        } else {
            alert('Perangkat Anda tidak mendukung fitur getar.');
        }
    };

    // 5. MUSIK
    const toggleMusik = () => {
        if (elements.player.paused) {
            elements.player.play();
            elements.btnPutarMusik.textContent = 'Jeda Musik';
            elements.btnPutarMusik.classList.add('toggled');
        } else {
            elements.player.pause();
            elements.btnPutarMusik.textContent = 'Putar Musik';
            elements.btnPutarMusik.classList.remove('toggled');
        }
    };

    const aturVolume = () => {
        elements.player.volume = elements.volumeSlider.value;
    };

    // --- INISIALISASI HALAMAN ---
    const init = () => {
        // 1. Cek izin yang ada menggunakan Permissions API
        if ('permissions' in navigator) {
            // Cek Lokasi
            navigator.permissions.query({ name: 'geolocation' }).then(result => {
                updatePermissionUI('lokasi', result.state);
                if (result.state === 'granted') {
                    mintaAksesLokasi(); // Langsung aktifkan jika sudah diizinkan
                }
            });
            // Cek Mikrofon
            navigator.permissions.query({ name: 'microphone' }).then(result => {
                updatePermissionUI('audio', result.state);
            });
        } else {
            // Fallback untuk browser yang tidak mendukung Permissions API
            // Cek dari localStorage
            const geoPerm = localStorage.getItem('permission_geolocation');
            if (geoPerm) updatePermissionUI('lokasi', geoPerm); else updatePermissionUI('lokasi', 'prompt');
            const micPerm = localStorage.getItem('permission_microphone');
            if (micPerm) updatePermissionUI('audio', micPerm); else updatePermissionUI('audio', 'prompt');
        }
        
        // 2. Muat data dari localStorage
        if (localStorage.getItem('detailLokasi')) {
            elements.koordinat.textContent = localStorage.getItem('detailLokasi');
            elements.detailLokasiWrapper.style.display = 'block';
        }
        
        // 3. Atur volume awal dan update info penyimpanan
        elements.player.volume = elements.volumeSlider.value;
        updatePenyimpananInfo();

        // 4. Tambahkan Event Listeners
        elements.btnLokasi.addEventListener('click', mintaAksesLokasi);
        elements.btnAudio.addEventListener('click', mintaAksesAudio);
        elements.btnSalinLokasi.addEventListener('click', salinLokasi);
        elements.btnSenter.addEventListener('click', toggleSenter);
        elements.btnGetar.addEventListener('click', getarkanPerangkat);
        elements.btnPutarMusik.addEventListener('click', toggleMusik);
        elements.volumeSlider.addEventListener('input', aturVolume);
    };

    // Jalankan inisialisasi
    init();
});
