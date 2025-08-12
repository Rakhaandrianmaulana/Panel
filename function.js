// --- Bagian 1: Setup Efek 3D "I Love You" ---

// Cek apakah Three.js sudah termuat
if (typeof THREE === 'undefined') {
    console.error('Three.js library is not loaded.');
} else {
    const container = document.getElementById('three-container');
    let scene, camera, renderer, textMesh;

    function init3D() {
        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 20;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffc0cb, 1.5, 100); // Pinkish light
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);
        const pointLight2 = new THREE.PointLight(0xff4500, 1, 100); // Reddish light
        pointLight2.position.set(-10, -10, 5);
        scene.add(pointLight2);

        // 3D Text
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
            const textGeometry = new THREE.TextGeometry('I Love You', {
                font: font,
                size: 5,
                height: 1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.2,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 5
            });
            textGeometry.center(); // Center the geometry

            const material = new THREE.MeshPhongMaterial({ color: 0xff4500, shininess: 100 }); // OrangeRed color
            textMesh = new THREE.Mesh(textGeometry, material);
            scene.add(textMesh);
        });

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (textMesh) {
            textMesh.rotation.y += 0.005;
            textMesh.rotation.x += 0.002;
        }
        renderer.render(scene, camera);
    }
    
    // Inisialisasi 3D
    init3D();
    animate();
}


// --- Bagian 2: Logika Interaksi dan Halaman ---

document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua elemen yang dibutuhkan dari DOM
    const revealButton = document.getElementById('revealButton');
    const startButtonContainer = document.getElementById('startButtonContainer');
    const messageCard = document.getElementById('messageCard');
    const greetingEl = document.getElementById('greeting');
    const loveMessageEl = document.getElementById('loveMessage');
    const typingCursor = document.getElementById('typing-cursor');
    const memoriesButton = document.getElementById('memoriesButton');
    const memoriesPage = document.getElementById('memoriesPage');
    const backButton = document.getElementById('backButton');

    // Teks pesan cinta
    const messageText = "Aku mungkin bukan orang yang paling puitis, tapi perasaanku nyata. Setiap hari bersamamu adalah anugerah. Kamu adalah alasanku tersenyum dan semangatku untuk jadi lebih baik. Terima kasih sudah hadir di hidupku. Aku sayang kamu, selamanya.";
    let charIndex = 0;

    // Fungsi untuk efek ketik
    function typeMessage() {
        if (charIndex < messageText.length) {
            loveMessageEl.textContent += messageText.charAt(charIndex);
            charIndex++;
            setTimeout(typeMessage, 70); // Kecepatan ketikan (ms)
        } else {
            typingCursor.style.display = 'none'; // Sembunyikan kursor
            memoriesButton.classList.remove('hidden'); // Tampilkan tombol kenangan
        }
    }

    // Event listener untuk tombol utama
    revealButton.addEventListener('click', () => {
        const partnerName = prompt("Siapakah nama panggilan sayang untukmu?");
        
        if (partnerName && partnerName.trim() !== "") {
            // Sembunyikan tombol utama
            startButtonContainer.style.display = 'none';

            // Tampilkan kartu pesan
            greetingEl.textContent = `Untuk ${partnerName} tersayang,`;
            messageCard.classList.remove('hidden');
            setTimeout(() => {
                messageCard.classList.add('visible');
            }, 100);

            // Mulai efek ketik setelah kartu muncul
            setTimeout(typeMessage, 1200);
        } else {
            alert("Tolong masukkan nama ya, biar pesannya sampai :)");
        }
    });

    // Event listener untuk tombol "Lihat Kenangan"
    memoriesButton.addEventListener('click', () => {
        messageCard.classList.remove('visible');
        setTimeout(() => {
            messageCard.classList.add('hidden');
            memoriesPage.classList.remove('hidden');
            setTimeout(() => {
                memoriesPage.classList.add('visible');
            }, 100);
        }, 600); // Tunggu transisi selesai
    });

    // Event listener untuk tombol "Kembali" dari halaman kenangan
    backButton.addEventListener('click', () => {
        memoriesPage.classList.remove('visible');
        setTimeout(() => {
            memoriesPage.classList.add('hidden');
            messageCard.classList.remove('hidden');
            setTimeout(() => {
                messageCard.classList.add('visible');
            }, 100);
        }, 600); // Tunggu transisi selesai
    });
});
