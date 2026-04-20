let cat = document.getElementById('cat');
const catWrapper = document.getElementById('cat-wrapper');
const container = document.getElementById('container');
const background = document.getElementById('background');

let isSpinning = false;
let rotation = 0;
let rotationSpeed = 5;
let animationId = null;
let usingImage = true;

const audioTrack = new Audio('images/oo ee a e a Cat.mp3');
audioTrack.loop = true;
audioTrack.volume = 0.85;
let isAudioPlaying = false;

let shakeIntensity = 0;
const maxShakeIntensity = 8;

let colorIndex = 0;

function createFallbackCat() {
    const fallback = document.createElement('div');
    fallback.id = 'cat-fallback';
    fallback.className = cat.className;
    fallback.innerHTML = '<div class="cat-eye"><div class="cat-pupil"></div></div><div class="cat-eye"><div class="cat-pupil"></div></div><div class="cat-nose"></div><div class="cat-mouth"></div>';
    catWrapper.innerHTML = '';
    catWrapper.appendChild(fallback);
    cat = fallback;
    usingImage = false;
}

cat.addEventListener('error', () => {
    createFallbackCat();
});
const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
];

function playMusicLoop() {
    if (!isAudioPlaying) {
        audioTrack.currentTime = 0;
        audioTrack.volume = 0.85;
        audioTrack.play().catch(() => {
        });
        isAudioPlaying = true;
    }
}

function stopMusic() {
    if (isAudioPlaying) {
        const fadeInterval = setInterval(() => {
            audioTrack.volume = Math.max(0, audioTrack.volume - 0.05);
            if (audioTrack.volume <= 0.05) {
                clearInterval(fadeInterval);
                audioTrack.pause();
                audioTrack.currentTime = 0;
                audioTrack.volume = 0.85;
                isAudioPlaying = false;
            }
        }, 50);
    }
}

function applyScreenShake() {
    if (shakeIntensity > 0) {
        const shakeX = (Math.random() - 0.5) * shakeIntensity * 2;
        const shakeY = (Math.random() - 0.5) * shakeIntensity * 2;
        container.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
        shakeIntensity -= 0.3;
    } else {
        container.style.transform = 'translate(0, 0)';
    }
}

function cycleBackgroundColor() {
    colorIndex = (colorIndex + 1) % colors.length;
    background.style.background = colors[colorIndex];
    document.body.style.background = colors[colorIndex];
}

function spin() {
    let targetSpeed = 5;
    if (isAudioPlaying) {
        const time = audioTrack.currentTime;
        if (time < 11) {
            targetSpeed = Math.min(15, 5 + time * 0.5);
        } else if (time >= 11 && time < 17) {
            targetSpeed = 2;
        } else if (time >= 17) {
            targetSpeed = 15;
        }
    }

    const diff = targetSpeed - rotationSpeed;
    rotationSpeed += diff * 0.05;

    rotation += rotationSpeed;

    cat.style.transform = `rotate(${rotation}deg)`;

    applyScreenShake();

    if (rotation % 60 < Math.abs(rotationSpeed)) {
        cycleBackgroundColor();
    }

    animationId = requestAnimationFrame(spin);
}

function toggleSpin() {
    if (isSpinning) {
        isSpinning = false;
        cat.classList.remove('spinning');
        if (usingImage) {
            cat.src = 'images/cat-still.png';
        }
        stopMusic();
        cancelAnimationFrame(animationId);
        cat.style.transform = 'rotate(0deg)';
        rotationSpeed = 5;
        shakeIntensity = 0;
        container.style.transform = 'translate(0, 0)';
    } else {
        isSpinning = true;
        cat.classList.add('spinning');
        if (usingImage) {
            cat.src = 'images/cat-spinning.png';
        }
        rotation = 0;
        rotationSpeed = 5;
        shakeIntensity = 0;
        playMusicLoop();
        spin();
    }
}

cat.addEventListener('click', toggleSpin);
container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    toggleSpin();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        toggleSpin();
    }
});

document.addEventListener('click', () => {
    if (!isAudioPlaying && isSpinning) {
        audioTrack.play().catch(() => {});
    }
});

document.addEventListener('touchstart', () => {
    if (!isAudioPlaying && isSpinning) {
        audioTrack.play().catch(() => {});
    }
});

