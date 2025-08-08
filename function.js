// Menunggu hingga seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // Mengambil semua elemen yang diperlukan dari HTML
    const btnLokasi = document.getElementById('btnLokasi');
    const statusLokasi = document.getElementById('statusLokasi');
    const btnAudio = document.getElementById('btnAudio');
    const statusAudio = document.getElementById('statusAudio');
    const btnSenter = document.getElementById('btnSenter');
    const btnGetar = document.getElementById('btnGetar');
    const btnPutarMusik = document.getElementById('btnPutarMusik');
    const player = document.getElementById('player');
    const volumeSlider = document.getElementById('volumeSlider');

    // Variabel untuk mengelola state senter
    let senterAktif = false;
    let streamTrack = null;

    // --- FUNGSI-FUNGSI UTAMA ---

    // 1. Fungsi untuk meminta akses lokasi
    const mintaAksesLokasi = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (posisi) => {
                    const { latitude, longitude } = posisi.coords;
                    const infoLokasi = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
                    statusLokasi.innerHTML = `<span class="label">Diizinkan:</span> ${infoLokasi}`;
                    // Simpan data ke localStorage
                    localStorage.setItem('lokasiDiizinkan', 'true');
                    localStorage.setItem('infoLokasi', infoLokasi);
                },
                (error) => {
                    statusLokasi.innerHTML = `<span class="label">Ditolak:</span> ${error.message}`;
                    localStorage.setItem('lokasiDiizinkan', 'false');
                }
            );
        } else {
            statusLokasi.textContent = 'Geolocation tidak didukung di peramban ini.';
        }
    };

    // 2. Fungsi untuk meminta akses audio (mikrofon)
    const mintaAksesAudio = () => {
        if ('mediaDevices' in navigator) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    statusAudio.innerHTML = `<span class="label">Status:</span> Akses audio diizinkan.`;
                    localStorage.setItem('audioDiizinkan', 'true');
                })
                .catch((error) => {
                    statusAudio.innerHTML = `<span class="label">Status:</span> Akses audio ditolak.`;
                    localStorage.setItem('audioDiizinkan', 'false');
                });
        } else {
            statusAudio.textContent = 'MediaDevices tidak didukung di peramban ini.';
        }
    };

    // 3. Fungsi untuk menyalakan/mematikan senter
    const toggleSenter = async () => {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            try {
                if (!senterAktif) {
                    // Minta akses kamera belakang
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'environment' }
                    });
                    streamTrack = stream.getVideoTracks()[0];
                    // Nyalakan senter
                    await streamTrack.applyConstraints({
                        advanced: [{ torch: true }]
                    });
                    senterAktif = true;
                    btnSenter.textContent = 'Matikan Senter';
                    btnSenter.classList.add('toggled');
                } else {
                    // Matikan senter dan hentikan stream
                    streamTrack.applyConstraints({ advanced: [{ torch: false }] });
                    streamTrack.stop();
                    senterAktif = false;
                    streamTrack = null;
                    btnSenter.textContent = 'Nyalakan Senter';
                    btnSenter.classList.remove('toggled');
                }
            } catch (error) {
                alert(`Error senter: ${error.message}. Pastikan Anda menggunakan perangkat dengan senter dan memberikan izin kamera.`);
            }
        } else {
            alert('Fitur ini tidak didukung di peramban Anda.');
        }
    };

    // 4. Fungsi untuk menggetarkan perangkat
    const getarkanPerangkat = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(200); // Getar selama 200ms
        } else {
            alert('Perangkat Anda tidak mendukung fitur getar.');
        }
    };

    // 5. Fungsi untuk memutar atau menjeda musik
    const toggleMusik = () => {
        if (player.paused) {
            player.play();
            btnPutarMusik.textContent = 'Jeda Musik';
            btnPutarMusik.classList.add('toggled');
        } else {
            player.pause();
            btnPutarMusik.textContent = 'Putar Musik';
            btnPutarMusik.classList.remove('toggled');
        }
    };

    // 6. Fungsi untuk mengatur volume
    const aturVolume = () => {
        player.volume = volumeSlider.value;
    };

    // --- MEMUAT DATA DARI LOCALSTORAGE SAAT HALAMAN DIBUKA ---
    const muatDariStorage = () => {
        // Cek status izin lokasi
        if (localStorage.getItem('lokasiDiizinkan') === 'true') {
            statusLokasi.innerHTML = `<span class="label">Diizinkan:</span> ${localStorage.getItem('infoLokasi')}`;
        } else if (localStorage.getItem('lokasiDiizinkan') === 'false') {
            statusLokasi.innerHTML = `<span class="label">Status:</span> Pernah ditolak.`;
        }

        // Cek status izin audio
        if (localStorage.getItem('audioDiizinkan') === 'true') {
            statusAudio.innerHTML = `<span class="label">Status:</span> Akses audio diizinkan.`;
        } else if (localStorage.getItem('audioDiizinkan') === 'false') {
            statusAudio.innerHTML = `<span class="label">Status:</span> Akses audio ditolak.`;
        }
        
        // Atur volume awal dari slider
        player.volume = volumeSlider.value;
    };

    // --- MENAMBAHKAN EVENT LISTENER KE SETIAP ELEMEN ---
    btnLokasi.addEventListener('click', mintaAksesLokasi);
    btnAudio.addEventListener('click', mintaAksesAudio);
    btnSenter.addEventListener('click', toggleSenter);
    btnGetar.addEventListener('click', getarkanPerangkat);
    btnPutarMusik.addEventListener('click', toggleMusik);
    volumeSlider.addEventListener('input', aturVolume);

    // Panggil fungsi untuk memuat data dari storage saat halaman pertama kali dibuka
    muatDariStorage();
});
