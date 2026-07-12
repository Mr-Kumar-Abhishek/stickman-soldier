# Game Design Document (GDD)

## 1. Game Overview
**Title:** Stickman Soldier
**Genre:** Run-and-Gun Action, Side-scroller
**Inspiration:** Contra (SNES)
**Visual Style:** CSS-only stickman graphics.

## 2. Core Gameplay Mechanics
### 2.1 Controls
- **W / Up Arrow:** Aim Up
- **A / Left Arrow:** Move Left
- **S / Down Arrow:** Crouch / Aim Down
- **D / Right Arrow:** Move Right
- **J / Z:** Shoot
- **K / X:** Jump

### 2.2 Player Character
- **Visuals:** A stickman constructed entirely out of CSS `div` elements, utilizing `border-radius`, `transform`, and pseudo-elements.
- **Health:** One-hit kill system. The player has 3 lives by default. 
- **States:** Idle, Running, Jumping, Crouching, Dead.

### 2.3 Combat & Weapons
- **Default Weapon:** Standard rifle, fires a single fast-moving CSS pellet.
- **Spread Gun (Power-up):** Fires 3-5 CSS pellets in a spread arc, similar to Contra's iconic 'S' weapon.
- **Shooting Mechanics:** The player can shoot in 8 directions depending on the movement keys pressed.

### 2.4 Enemies
- **Basic Grunt:** Runs towards the player, dies in one hit. Represented as a red-colored stickman.
- **Stationary Turret:** A CSS-built turret that aims at the player and periodically fires projectiles.

## 3. Visual & Audio Design
### 3.1 Aesthetics
- **Background:** Parallax scrolling CSS gradients or simple CSS shapes to simulate depth (mountains, trees).
- **Entities:** All entities are created using HTML elements. Animations are handled via CSS `@keyframes` and JS class toggles (e.g., `.running`, `.jumping`).
- **Color Palette:** High contrast. Neon colors for projectiles to make them stand out against the background. Dark mode default aesthetic for a modern arcade feel.

### 3.2 Audio (Optional for initial release)
- Synth-based sound effects for shooting, jumping, and explosions.

## 4. Level Design
- **Level 1 (The Base):** A jungle-to-base transition. Features simple platforming, basic enemies, and an end-of-level boss.
- Platforms are solid CSS blocks. Some platforms can be jumped through from below.
