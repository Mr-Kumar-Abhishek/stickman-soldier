const world = document.getElementById('world');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 0.6;

// Key input tracking
const keys = { w: false, a: false, s: false, d: false, j: false, k: false };
let gameState = 'playing'; // playing, gameover
let score = 0;
let cameraX = 0;

window.addEventListener('keydown', (e) => {
    let key = e.key.toLowerCase();
    if (key === 'arrowup') key = 'w';
    if (key === 'arrowdown') key = 's';
    if (key === 'arrowleft') key = 'a';
    if (key === 'arrowright') key = 'd';
    if (key === 'z') key = 'j';
    if (key === 'x') key = 'k';

    if (keys.hasOwnProperty(key)) keys[key] = true;
    if (key === 'r' && gameState === 'gameover') restartGame();
});

window.addEventListener('keyup', (e) => {
    let key = e.key.toLowerCase();
    if (key === 'arrowup') key = 'w';
    if (key === 'arrowdown') key = 's';
    if (key === 'arrowleft') key = 'a';
    if (key === 'arrowright') key = 'd';
    if (key === 'z') key = 'j';
    if (key === 'x') key = 'k';

    if (keys.hasOwnProperty(key)) keys[key] = false;
});

function createStickmanHTML(isPlayer = false) {
    const el = document.createElement('div');
    el.className = `stickman ${isPlayer ? 'player' : 'enemy'}`;
    el.innerHTML = `
        <div class="head"></div>
        <div class="torso"></div>
        <div class="arm left"></div>
        <div class="arm right"><div class="gun"></div></div>
        <div class="leg left"></div>
        <div class="leg right"></div>
    `;
    world.appendChild(el);
    return el;
}

class Entity {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.vx = 0; this.vy = 0;
        this.el = null; this.dead = false;
    }
    update() {}
    render() {
        if(this.el) this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}

class Platform extends Entity {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.el = document.createElement('div');
        this.el.className = 'platform';
        this.el.style.width = w + 'px';
        this.el.style.height = h + 'px';
        world.appendChild(this.el);
        this.render();
    }
}

class Bullet extends Entity {
    constructor(x, y, vx, vy, isPlayer = true) {
        super(x, y, 12, 12);
        this.vx = vx; this.vy = vy; this.isPlayer = isPlayer;
        this.el = document.createElement('div');
        this.el.className = 'bullet';
        // Add color variance based on owner
        if (!isPlayer) {
            this.el.style.backgroundColor = '#ff0055';
            this.el.style.boxShadow = '0 0 10px #ff0055, 0 0 20px #ff0000';
        }
        world.appendChild(this.el);
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < cameraX - 100 || this.x > cameraX + GAME_WIDTH + 100 || this.y < -100 || this.y > GAME_HEIGHT + 100) {
            this.dead = true;
        }
    }
}

class Character extends Entity {
    constructor(x, y, isPlayer=false) {
        super(x, y, 40, 80);
        this.el = createStickmanHTML(isPlayer);
        this.isPlayer = isPlayer;
        this.grounded = false;
        this.speed = 4;
        this.jumpForce = -12;
        this.facing = 1; // 1 right, -1 left
        this.cooldown = 0;
        this.lives = isPlayer ? 3 : 1;
        this.crouching = false;
    }
    
    update(platforms, bullets, enemies) {
        if (this.dead) return;

        this.vy += GRAVITY;
        if (this.vy > 15) this.vy = 15; // terminal velocity

        if (this.isPlayer) {
            this.crouching = keys.s && this.grounded;
            
            if (!this.crouching) {
                if (keys.a) { this.vx = -this.speed; this.facing = -1; }
                else if (keys.d) { this.vx = this.speed; this.facing = 1; }
                else { this.vx = 0; }
                
                if (keys.k && this.grounded) {
                    this.vy = this.jumpForce;
                    this.grounded = false;
                }
            } else {
                this.vx = 0; // cannot walk while crouched
            }

            if (this.cooldown > 0) this.cooldown--;
            if (keys.j && this.cooldown <= 0) {
                this.shoot(bullets);
                this.cooldown = 12; // fire rate
            }

            // CSS classes for animation and aiming
            this.updateClasses();

        } else {
            // Simple enemy logic
            if (this.grounded) {
                this.vx = -2;
                this.facing = -1;
                this.el.className = "stickman enemy running aim-forward";
            }
            // Shoot occasionally
            if (Math.random() < 0.01) {
                this.shoot(bullets);
            }
        }

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Platform collision
        this.grounded = false;
        for (let p of platforms) {
            // Landing on top
            if (this.x + 10 < p.x + p.w && this.x + this.w - 10 > p.x &&
                this.y + this.h - this.vy <= p.y + GRAVITY + 1 && 
                this.y + this.h >= p.y) {
                
                if (this.vy > 0 && !this.crouching) { 
                    this.vy = 0;
                    this.y = p.y - this.h;
                    this.grounded = true;
                }
            }
        }

        if (this.y > GAME_HEIGHT) this.takeDamage(); // fell in pit
    }

    updateClasses() {
        // Reset state classes
        this.el.classList.remove('running', 'jumping', 'crouching', 'aim-up', 'aim-down', 'aim-forward', 'aim-up-forward', 'aim-down-forward');
        
        if (!this.grounded) this.el.classList.add('jumping');
        else if (this.crouching) this.el.classList.add('crouching');
        else if (Math.abs(this.vx) > 0) this.el.classList.add('running');

        // Aiming logic
        if (keys.w && (keys.a || keys.d)) this.el.classList.add('aim-up-forward');
        else if (keys.w) this.el.classList.add('aim-up');
        else if (keys.s && !this.grounded) this.el.classList.add('aim-down'); // jump shooting down
        else this.el.classList.add('aim-forward');
    }

    shoot(bullets) {
        let bvx = this.facing * 12;
        let bvy = 0;
        let aimClass = '';
        
        if (this.isPlayer) {
            if (keys.w && (keys.a || keys.d)) { bvy = -8.5; bvx = this.facing * 8.5; }
            else if (keys.w) { bvy = -12; bvx = 0; }
            else if (keys.s && !this.grounded) { bvy = 12; bvx = 0; }
        }

        let sx = this.x + 20;
        let sy = this.y + 35;
        
        // Adjust spawn point based on aim
        if (bvx !== 0 && bvy === 0) { sx += this.facing * 20; sy -= 10; }
        if (bvx === 0 && bvy < 0) { sy -= 40; }
        if (this.crouching) { sy += 20; }
        
        bullets.push(new Bullet(sx, sy, bvx, bvy, this.isPlayer));
    }

    takeDamage() {
        this.lives--;
        if (this.isPlayer) {
            livesEl.innerText = `LIVES: ${this.lives}`;
            if (this.lives <= 0) {
                this.dead = true;
                gameState = 'gameover';
            } else {
                this.x = cameraX + 50; this.y = 100; this.vy = 0;
            }
        } else {
            this.dead = true;
            score += 100;
            scoreEl.innerText = `SCORE: ${score}`;
        }
    }

    render() {
        if (this.dead) {
            if (this.el) { this.el.remove(); this.el = null; }
            return;
        }
        let scaleX = this.facing === 1 ? 1 : -1;
        let baseTransform = `translate(${this.x}px, ${this.y}px) scaleX(${scaleX})`;
        if (this.crouching) {
            this.el.style.transform = baseTransform + ` scaleY(0.6) translateY(26px)`;
        } else {
            this.el.style.transform = baseTransform;
        }
    }
}

let player;
let platforms = [];
let bullets = [];
let enemies = [];
let enemySpawnTimer = 0;

function initMap() {
    platforms = [
        new Platform(0, 500, 1400, 100),
        new Platform(400, 380, 200, 20),
        new Platform(700, 280, 150, 20),
        new Platform(1000, 400, 200, 20),
        new Platform(1500, 500, 1200, 100),
        new Platform(2800, 500, 1000, 100)
    ];
}

function restartGame() {
    world.innerHTML = '';
    platforms = []; bullets = []; enemies = [];
    score = 0; cameraX = 0;
    gameState = 'playing';
    scoreEl.innerText = 'SCORE: 0';
    livesEl.innerText = 'LIVES: 3';
    gameOverScreen.classList.add('hidden');
    
    initMap();
    player = new Character(100, 300, true);
}

function update() {
    if (gameState !== 'playing') return;

    player.update(platforms, bullets, enemies);
    
    // Camera logic
    if (player.x > cameraX + 350) {
        cameraX = player.x - 350;
        world.style.transform = `translateX(${-cameraX}px)`;
        document.getElementById('background').style.backgroundPositionX = `${-cameraX * 0.2}px`;
    }

    // Spawn enemies
    enemySpawnTimer++;
    if (enemySpawnTimer > 90) {
        if (Math.random() > 0.4 && enemies.length < 5) {
            // Spawn just offscreen right
            enemies.push(new Character(cameraX + GAME_WIDTH + 100, 400, false));
        }
        // Infinite terrain generator
        if (platforms[platforms.length-1].x < cameraX + GAME_WIDTH + 1500) {
            let lastP = platforms[platforms.length-1];
            let gap = Math.random() * 200 + 100;
            let w = Math.random() * 800 + 400;
            platforms.push(new Platform(lastP.x + lastP.w + gap, 500, w, 100));
            // Add some mid-air platforms
            if (Math.random() > 0.5) {
                platforms.push(new Platform(lastP.x + lastP.w + gap + 200, 350, 200, 20));
            }
        }
        enemySpawnTimer = 0;
    }

    bullets.forEach(b => b.update());
    enemies.forEach(e => e.update(platforms, bullets, enemies));

    // Collision checks
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        if (b.dead) continue;

        if (b.isPlayer) {
            for (let e of enemies) {
                if (!e.dead && b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
                    e.takeDamage();
                    b.dead = true;
                    break;
                }
            }
        } else {
            if (!player.dead && b.x < player.x + player.w && b.x + b.w > player.x && b.y < player.y + player.h && b.y + b.h > player.y) {
                player.takeDamage();
                b.dead = true;
            }
        }
    }

    for (let e of enemies) {
        if (!e.dead && !player.dead) {
            // Simple bounding box for body collision
            if (player.x + 10 < e.x + e.w - 10 && player.x + player.w - 10 > e.x + 10 && 
                player.y + 10 < e.y + e.h && player.y + player.h > e.y + 10) {
                player.takeDamage();
                e.takeDamage();
            }
        }
    }

    // Garbage collection
    bullets.forEach(b => { if(b.dead && b.el) { b.el.remove(); b.el = null; } });
    bullets = bullets.filter(b => !b.dead);
    enemies = enemies.filter(e => !e.dead);
}

function render() {
    if (gameState === 'playing') {
        player.render();
        bullets.forEach(b => b.render());
        enemies.forEach(e => e.render());
    } else {
        gameOverScreen.classList.remove('hidden');
    }
}

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

// Start
restartGame();
loop();
