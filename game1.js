const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const ui = {
    wave: document.getElementById('wave'),
    score: document.getElementById('score'),
    enemyCount: document.getElementById('enemyCount'),
    hp: document.getElementById('hp'),
    gameOver: document.getElementById('game1-over'),
    finalScore: document.getElementById('finalScore'),
    restartBtn: document.getElementById('restartBtn'),
};

const state = {
    width: canvas.width,
    height: canvas.height,
    keys: {},
    players: null,
    enemies: [],
    bullets: [],
    pickups: [],
    mouse: { x: 0, y: 0 },
    score: 0,
    wave: 1,
    maxHealth: 100,
    health: 100,
    spawnTimer: 0,
    waveClear: false,
    gameOver: false,
    bulletClock: 0,
    powerUp: false,
    powerUpEnd: 0,
    nextPowerUpScore: 1000,
};

function resetGame() {
    state.enemies = [];
    state.bullets = [];
    state.pickups = [];
    state.score = 0;
    state.wave = 1;
    state.health = state.maxHealth;
    state.spawnTimer = 0;
    state.gameOver = false;
    state.waveClear = false;
    state.bulletClock = 0;
    state.powerUp = false;
    state.powerUpEnd = 0;
    state.nextPowerUpScore = 1000;
    ui.gameOver.style.display = 'none';
    updateUI();
}

function createPlayer() {
    state.players = {
        x: state.width / 2,
        y: state.height / 2,
        size: 10,
        speed: 200,
        fireRate: 160,
    };
}

function spawnEnemy() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) {
        x = -20;
        y = Math.random() * state.height;
    } else if (edge === 1) {
        x = state.width + 20;
        y = Math.random() * state.height;
    } else if (edge === 2) {
        x = Math.random() * state.width;
        y = -20;
    } else {
        x = Math.random() * state.width;
        y = state.height + 20;
    }

    
    let speed = 66 + Math.min(state.wave * 3.6, 66);
    let size = 10 + Math.min(state.wave, 6);
    let hp = 1 + Math.floor(state.wave / 3);
    let enemyType = 'normal';

    
    if (state.score >= 1000) {
        const difficultyMultiplier = 1 + Math.floor((state.score - 1000) / 500) * 0.25; 
        speed *= difficultyMultiplier;
        size *= Math.min(difficultyMultiplier, 2);
        hp = Math.ceil(hp * difficultyMultiplier);
        enemyType = 'hard';
    }

    state.enemies.push({ x, y, size, speed, hp, enemyType });
}

function spawnWave() {
    const count = 4 + state.wave * 2;
    for (let i = 0; i < count; i++) spawnEnemy();
    state.waveClear = false;
    state.spawnTimer = 0;
    updateUI();
}

function addPickup(x, y) {
    state.pickups.push({ x, y, size: 8, type: 'health', duration: performance.now() + 12000 });
}

function updateUI() {
    ui.wave.textContent = state.wave + (state.score >= 1000 ? ' (HARD)' : '');
    ui.score.textContent = state.score;
    ui.enemyCount.textContent = state.enemies.length;
    const hpRate = Math.max(0, state.health / state.maxHealth) * 100;
    ui.hp.style.width = hpRate + '%';
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
}

function gameOver() {
    state.gameOver = true;
    ui.finalScore.textContent = 'Score: ' + state.score;
    ui.gameOver.style.display = 'block';
}

function update(dt) {
    if (state.gameOver) return;

    const p = state.players;
    const speed = p.speed * (state.powerUp ? 1.35 : 1) * (dt / 1000);

    if (state.keys['w'] || state.keys['ArrowUp']) p.y -= speed;
    if (state.keys['s'] || state.keys['ArrowDown']) p.y += speed;
    if (state.keys['a'] || state.keys['ArrowLeft']) p.x -= speed;
    if (state.keys['d'] || state.keys['ArrowRight']) p.x += speed;

    p.x = clamp(p.x, p.size, state.width - p.size);
    p.y = clamp(p.y, p.size, state.height - p.size);

    if (state.powerUp && performance.now() > state.powerUpEnd) {
        state.powerUp = false;
    }

    state.bulletClock += dt;
    const fireRate = state.powerUp ? 60 : p.fireRate;
    if (state.bulletClock > fireRate) {
        state.bulletClock = 0;
        const angle = Math.atan2(state.mouse.y - p.y, state.mouse.x - p.x);
        const bullets = state.powerUp ? 5 : 1;

        for (let i = 0; i < bullets; i++) {
            const spread = (i - (bullets - 1) / 2) * 0.16;
            state.bullets.push({
                x: p.x + Math.cos(angle + spread) * 14,
                y: p.y + Math.sin(angle + spread) * 14,
                vx: Math.cos(angle + spread) * 516,
                vy: Math.sin(angle + spread) * 516,
                size: 4,
                life: 1.2,
            });
        }
    }

    state.bullets = state.bullets.filter((b) => {
        b.x += b.vx * (dt / 1000);
        b.y += b.vy * (dt / 1000);
        b.life -= dt / 1000;
        return b.life > 0 && b.x > -20 && b.x < state.width + 20 && b.y > -20 && b.y < state.height + 20;
    });

    for (const e of state.enemies) {
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const dist = Math.hypot(dx, dy);
        const moveSpeed = e.speed * (dt / 1000);
        e.x += (dx / dist) * moveSpeed;
        e.y += (dy / dist) * moveSpeed;

        if (dist < e.size + p.size) {
            state.health -= 12;
            e.hp = 0;
            if (state.health <= 0) {
                state.health = 0;
                gameOver();
            }
        }
    }

    state.enemies = state.enemies.filter((e) => e.hp > 0);

    for (const b of state.bullets) {
        for (const e of state.enemies) {
            if (distance(b, e) < b.size + e.size) {
                e.hp -= state.powerUp ? 2 : 1;
                b.life = 0;
                if (e.hp <= 0) {
                    let baseScore = 15 + state.wave;
                    
                    if (e.enemyType === 'hard') {
                        baseScore += 25;
                    }
                    state.score += baseScore;
                    if (Math.random() < 0.12) addPickup(e.x, e.y);
                }
                break;
            }
        }
    }

    state.pickups = state.pickups.filter((pck) => {
        if (distance(pck, state.players) < pck.size + state.players.size) {
            state.health = clamp(state.health + 24, 0, state.maxHealth);
            return false;
        }
        return performance.now() < pck.duration;
    });

    if (state.enemies.length === 0 && !state.waveClear) {
        state.waveClear = true;
        state.wave += 1;
        state.spawnTimer = 0;
    }

    if (state.waveClear) {
        state.spawnTimer += dt;
        if (state.spawnTimer > 1000) {
            spawnWave();
        }
    }

    if (!state.waveClear && state.enemies.length < 2 + state.wave) {
        if (Math.random() < 0.015) spawnEnemy();
    }

    if (!state.powerUp && state.score >= state.nextPowerUpScore) {
        state.powerUp = true;
        state.powerUpEnd = performance.now() + 13500;
        state.nextPowerUpScore += 1800;
    }

    updateUI();
}

function draw() {
    ctx.clearRect(0, 0, state.width, state.height);

    ctx.fillStyle = '#0f0f13';
    ctx.fillRect(0, 0, state.width, state.height);

    const p = state.players;
    ctx.save();
    const px = p.x;
    const py = p.y;
    const angle = Math.atan2(state.mouse.y - py, state.mouse.x - px);

    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.fillStyle = '#f2e673';
    ctx.beginPath();
    ctx.arc(0, 0, p.size + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#464646';
    ctx.fillRect(0, -3, 15, 6);
    ctx.restore();

    for (const e of state.enemies) {
        
        ctx.fillStyle = e.enemyType === 'hard' ? '#8b0000' : '#a52b2b'; 
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();

        
        const maxHp = e.enemyType === 'hard' ? Math.ceil((1 + Math.floor(state.wave / 3)) * (1 + Math.floor((state.score - 1000) / 500) * 0.25)) : 1 + Math.floor(state.wave / 3);
        ctx.fillStyle = '#111';
        ctx.fillRect(e.x - e.size * 0.8, e.y + e.size + 2, (e.hp / maxHp) * e.size * 1.6, 4);
    }

    for (const b of state.bullets) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
    }

    for (const pck of state.pickups) {
        ctx.fillStyle = '#35f94a';
        ctx.beginPath();
        ctx.arc(pck.x, pck.y, pck.size, 0, Math.PI * 2);
        ctx.fill();
    }

    if (state.powerUp) {
        ctx.fillStyle = 'rgba(210,190,70,0.2)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 54, 0, Math.PI * 2);
        ctx.fill();
    }

    if (state.gameOver) {
    }
}

let last = performance.now();
function gameLoop() {
    const now = performance.now();
    const dt = now - last;
    last = now;

    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    state.keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    state.keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    state.mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    state.mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

ui.restartBtn.addEventListener('click', () => {
    resetGame();
    spawnWave();
});

createPlayer();
resetGame();
spawnWave();
gameLoop();
