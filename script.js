const world = document.getElementById('world');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const startScreen = document.getElementById('start-screen');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GRAVITY = 0.6;

// Key input tracking
const keys = { w: false, a: false, s: false, d: false, enter: false, shift: false };
let gameState = 'menu'; // playing, gameover, levelcomplete, menu
let score = 0;
let cameraX = 0;
let currentLevel = 1;

window.addEventListener('keydown', (e) => {
    let key = e.key.toLowerCase();
    if (key === 'arrowup') key = 'w';
    if (key === 'arrowdown') key = 's';
    if (key === 'arrowleft') key = 'a';
    if (key === 'arrowright') key = 'd';

    if (keys.hasOwnProperty(key)) keys[key] = true;
    
    if (key === ' ' && gameState === 'menu') {
        gameState = 'playing';
        startScreen.classList.add('hidden');
    }

    if (key === 'r') {
        if (gameState === 'gameover') {
            currentLevel = 1;
            score = 0;
            restartGame();
        } else if (gameState === 'levelcomplete') {
            currentLevel++;
            restartGame();
        }
    }
});

window.addEventListener('keyup', (e) => {
    let key = e.key.toLowerCase();
    if (key === 'arrowup') key = 'w';
    if (key === 'arrowdown') key = 's';
    if (key === 'arrowleft') key = 'a';
    if (key === 'arrowright') key = 'd';

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
        if(this.el && !this.dead) this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
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

class Powerup extends Entity {
    constructor(x, y, type) {
        super(x, y, 24, 24);
        this.type = type; // 'spread' or 'rapid'
        this.el = document.createElement('div');
        this.el.className = `powerup ${type}`;
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
        this.facing = 1;
        this.cooldown = 0;
        this.shootTimer = 0;
        this.lives = isPlayer ? 3 : 1;
        this.crouching = false;
        this.weapon = 'default';
    }
    
    update(platforms, bullets, enemies) {
        if (this.dead) return;

        this.vy += GRAVITY;
        if (this.vy > 15) this.vy = 15;

        if (this.isPlayer) {
            this.crouching = keys.s && this.grounded;
            
            if (!this.crouching) {
                if (keys.a) { this.vx = -this.speed; this.facing = -1; }
                else if (keys.d) { this.vx = this.speed; this.facing = 1; }
                else { this.vx = 0; }
                
                if (keys.shift && this.grounded) {
                    this.vy = this.jumpForce;
                    this.grounded = false;
                }
            } else {
                this.vx = 0;
            }

            if (this.shootTimer > 0) this.shootTimer--;
            if (this.cooldown > 0) this.cooldown--;
            if (keys.enter && this.cooldown <= 0) {
                this.shoot(bullets);
                this.cooldown = this.weapon === 'rapid' ? 5 : 12;
                this.shootTimer = 30;
            }

            this.updateClasses();

        } else {
            if (this.grounded) {
                this.vx = -2;
                this.facing = -1;
                this.el.className = "stickman enemy running aim-forward";
            }
            if (Math.random() < 0.01) {
                this.shoot(bullets);
            }
        }

        this.x += this.vx;
        this.y += this.vy;

        this.grounded = false;
        for (let p of platforms) {
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

        if (this.y > GAME_HEIGHT) this.takeDamage();
    }

    updateClasses() {
        this.el.classList.remove('running', 'jumping', 'crouching', 'aim-up', 'aim-down', 'aim-forward', 'aim-up-forward', 'aim-down-forward', 'aim-rest');
        
        let isMoving = Math.abs(this.vx) > 0;
        let isShooting = keys.enter || this.shootTimer > 0;

        if (!this.grounded) this.el.classList.add('jumping');
        else if (this.crouching) this.el.classList.add('crouching');
        else if (isMoving) this.el.classList.add('running');

        if (keys.w && (keys.a || keys.d)) this.el.classList.add('aim-up-forward');
        else if (keys.w) this.el.classList.add('aim-up');
        else if (keys.s && !this.grounded) this.el.classList.add('aim-down');
        else if (!isMoving && !isShooting && this.grounded && !this.crouching) this.el.classList.add('aim-rest');
        else this.el.classList.add('aim-forward');
    }

    shoot(bullets) {
        let bvx = this.facing * 12;
        let bvy = 0;
        
        if (this.isPlayer) {
            if (keys.w && (keys.a || keys.d)) { bvy = -8.5; bvx = this.facing * 8.5; }
            else if (keys.w) { bvy = -12; bvx = 0; }
            else if (keys.s && !this.grounded) { bvy = 12; bvx = 0; }
        }

        let sx = this.x + 20;
        let sy = this.y + 35;
        
        if (bvx !== 0 && bvy === 0) { sx += this.facing * 20; sy -= 10; }
        if (bvx === 0 && bvy < 0) { sy -= 40; }
        if (this.crouching) { sy += 20; }
        
        if (this.isPlayer && this.weapon === 'spread') {
            bullets.push(new Bullet(sx, sy, bvx, bvy, true));
            if (bvx !== 0 && bvy === 0) {
                bullets.push(new Bullet(sx, sy, bvx, -3, true));
                bullets.push(new Bullet(sx, sy, bvx, 3, true));
            } else if (bvx === 0 && bvy !== 0) {
                bullets.push(new Bullet(sx, sy, -3, bvy, true));
                bullets.push(new Bullet(sx, sy, 3, bvy, true));
            } else {
                bullets.push(new Bullet(sx, sy, bvx*1.2, bvy*0.8, true));
                bullets.push(new Bullet(sx, sy, bvx*0.8, bvy*1.2, true));
            }
        } else {
            bullets.push(new Bullet(sx, sy, bvx, bvy, this.isPlayer));
        }
    }

    takeDamage() {
        this.lives--;
        if (this.isPlayer) {
            livesEl.innerText = `LIVES: ${this.lives}`;
            if (this.lives <= 0) {
                this.dead = true;
                gameState = 'gameover';
                gameOverScreen.innerHTML = '<h1>GAME OVER</h1><p>Press R to Restart</p>';
            } else {
                this.x = cameraX + 50; this.y = 100; this.vy = 0;
                this.weapon = 'default';
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
let powerups = [];
let enemySpawnTimer = 0;
let levelLength = 5000;

function initLevel(level) {
    document.body.className = `level-${level}`;
    platforms = []; bullets = []; enemies = []; powerups = [];
    cameraX = 0;
    
    if (level === 1) {
        levelLength = 4000;
        platforms.push(new Platform(0, 500, 1400, 100));
        platforms.push(new Platform(400, 380, 200, 20));
        platforms.push(new Platform(700, 280, 150, 20));
        powerups.push(new Powerup(750, 240, 'spread'));
        platforms.push(new Platform(1000, 400, 200, 20));
        platforms.push(new Platform(1500, 500, 1200, 100));
        powerups.push(new Powerup(1800, 460, 'rapid'));
        platforms.push(new Platform(2800, 500, 1500, 100));
        platforms.push(new Platform(3200, 380, 200, 20));
        platforms.push(new Platform(3600, 300, 300, 20));
    } else if (level === 2) {
        levelLength = 5000;
        platforms.push(new Platform(0, 500, 1000, 100));
        platforms.push(new Platform(1100, 500, 800, 100));
        platforms.push(new Platform(1300, 380, 150, 20));
        powerups.push(new Powerup(1350, 340, 'spread'));
        platforms.push(new Platform(2000, 500, 600, 100));
        platforms.push(new Platform(2700, 450, 200, 20));
        platforms.push(new Platform(3000, 400, 200, 20));
        powerups.push(new Powerup(3050, 360, 'rapid'));
        platforms.push(new Platform(3300, 350, 200, 20));
        platforms.push(new Platform(3600, 500, 1600, 100));
    } else {
        levelLength = Infinity;
        platforms.push(new Platform(0, 500, 2000, 100));
    }
}

function restartGame() {
    world.innerHTML = '';
    scoreEl.innerText = `SCORE: ${score}`;
    if (gameState !== 'menu') {
        gameState = 'playing';
    }
    gameOverScreen.classList.add('hidden');
    
    initLevel(currentLevel);
    
    if (!player || player.lives <= 0) {
        player = new Character(100, 300, true);
        livesEl.innerText = `LIVES: ${player.lives}`;
    } else {
        player.x = 100;
        player.y = 300;
        player.vx = 0;
        player.vy = 0;
        player.el = createStickmanHTML(true);
        player.dead = false;
        world.appendChild(player.el);
    }
}

function update() {
    if (gameState !== 'playing') return;

    player.update(platforms, bullets, enemies);
    
    if (player.x > levelLength) {
        gameState = 'levelcomplete';
        gameOverScreen.innerHTML = `<h1>LEVEL ${currentLevel} CLEAR</h1><p>Press R to Proceed</p>`;
        gameOverScreen.classList.remove('hidden');
        return;
    }

    if (player.x > cameraX + 350) {
        cameraX = player.x - 350;
        world.style.transform = `translateX(${-cameraX}px)`;
        document.getElementById('background').style.backgroundPositionX = `${-cameraX * 0.2}px`;
    }

    if (levelLength !== Infinity || player.x < levelLength - 800) {
        enemySpawnTimer++;
        if (enemySpawnTimer > (currentLevel === 2 ? 70 : 90)) {
            if (Math.random() > 0.4 && enemies.length < 6) {
                enemies.push(new Character(cameraX + GAME_WIDTH + 100, 400, false));
            }
            enemySpawnTimer = 0;
        }
    }
    
    if (levelLength === Infinity) {
        if (platforms[platforms.length-1].x < cameraX + GAME_WIDTH + 1500) {
            let lastP = platforms[platforms.length-1];
            let gap = Math.random() * 200 + 100;
            let w = Math.random() * 800 + 400;
            platforms.push(new Platform(lastP.x + lastP.w + gap, 500, w, 100));
            if (Math.random() > 0.5) {
                platforms.push(new Platform(lastP.x + lastP.w + gap + 200, 350, 200, 20));
            }
        }
    }

    bullets.forEach(b => b.update());
    enemies.forEach(e => e.update(platforms, bullets, enemies));

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
            if (player.x + 10 < e.x + e.w - 10 && player.x + player.w - 10 > e.x + 10 && 
                player.y + 10 < e.y + e.h && player.y + player.h > e.y + 10) {
                player.takeDamage();
                e.takeDamage();
            }
        }
    }

    for (let p of powerups) {
        if (!p.dead && !player.dead) {
            if (player.x < p.x + p.w && player.x + player.w > p.x && player.y < p.y + p.h && player.y + player.h > p.y) {
                player.weapon = p.type;
                p.dead = true;
                score += 500;
                scoreEl.innerText = `SCORE: ${score}`;
            }
        }
    }

    bullets.forEach(b => { if(b.dead && b.el) { b.el.remove(); b.el = null; } });
    bullets = bullets.filter(b => !b.dead);
    enemies.forEach(e => { if(e.dead && e.el) { e.el.remove(); e.el = null; } });
    enemies = enemies.filter(e => !e.dead);
    powerups.forEach(p => { if(p.dead && p.el) { p.el.remove(); p.el = null; } });
    powerups = powerups.filter(p => !p.dead);
}

function render() {
    if (gameState === 'playing' || gameState === 'menu') {
        if(player) player.render();
        bullets.forEach(b => b.render());
        enemies.forEach(e => e.render());
        powerups.forEach(p => p.render());
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
