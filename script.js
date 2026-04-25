// Initialize AOS
AOS.init({
    duration: 1200,
    once: true,
});

// Get guest name from URL
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to');
if (guestName) {
    const guestNameEl = document.getElementById('guest-name');
    if (guestNameEl) guestNameEl.innerText = guestName;
}

// Elements
const music = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
let isPlaying = false;
let ytPlayer;
let isYtReady = false;

// GANTI DISINI: ID Video YouTube
// Pastikan ID ini benar (contoh: QivSQG8Fpjj0qS-a)
const youtubeVideoId = 'QivSQG8Fpjj0qS-a'; 

// YouTube IFrame API initialization
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Ready, initializing player...");
    ytPlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: youtubeVideoId,
        playerVars: {
            'autoplay': 0,
            'loop': 1,
            'playlist': youtubeVideoId,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'enablejsapi': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log("YouTube Player is ready");
    isYtReady = true;
    // Mute initially to comply with some browser policies, will unmute on click
    event.target.mute(); 
}

function onPlayerError(event) {
    console.error("YouTube Player Error:", event.data);
    isYtReady = false;
}

// Open Invitation Function
function openInvitation() {
    const splash = document.getElementById('splash-screen');
    const main = document.getElementById('main-content');
    const body = document.body;
    
    console.log("Opening invitation and starting music...");
    
    // Mulai musik segera setelah tombol diklik (interaksi user)
    playMusic();
    
    splash.style.opacity = '0';
    setTimeout(() => {
        splash.style.display = 'none';
        main.style.display = 'block';
        body.classList.remove('scroll-hidden');
        
        // Refresh AOS
        AOS.refresh();
    }, 1000);
}

// Music Controls
function playMusic() {
    isPlaying = true;
    if (musicIcon) musicIcon.classList.add('fa-spin');

    if (isYtReady && ytPlayer) {
        console.log("Playing YouTube music...");
        ytPlayer.unMute();
        ytPlayer.setVolume(100);
        ytPlayer.playVideo();
        
        // Cek jika dalam 2 detik YouTube tidak berputar, gunakan fallback lokal
        setTimeout(() => {
            if (ytPlayer.getPlayerState() !== 1) { // 1 = playing
                console.log("YouTube failed to play, falling back to local audio...");
                if (music) music.play().catch(e => console.log("Local audio blocked"));
            }
        }, 2000);
    } else {
        console.log("YouTube not ready, playing local audio...");
        if (music) music.play().catch(err => console.log("Local audio play blocked"));
    }
}

function toggleMusic() {
    if (isPlaying) {
        if (isYtReady && ytPlayer) {
            ytPlayer.pauseVideo();
        } else if (music) {
            music.pause();
        }
        if (musicIcon) musicIcon.classList.remove('fa-spin');
    } else {
        if (isYtReady && ytPlayer) {
            ytPlayer.playVideo();
        } else if (music) {
            music.play();
        }
        if (musicIcon) musicIcon.classList.add('fa-spin');
    }
    isPlaying = !isPlaying;
}

// Countdown Timer
const weddingDate = new Date("May 17, 2026 10:00:00").getTime();

const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerHTML = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.innerHTML = hours.toString().padStart(2, '0');
    if (minsEl) minsEl.innerHTML = minutes.toString().padStart(2, '0');
    if (secsEl) secsEl.innerHTML = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdown);
        const countdownEl = document.getElementById("countdown");
        if (countdownEl) countdownEl.innerHTML = "<h3 class='text-2xl font-serif text-wedding-secondary'>HARI BAHAGIA TELAH TIBA!</h3>";
    }
}, 1000);
