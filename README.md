# Stickman Soldier

> ⚠️ **Note:** This project is currently in active development.

**Stickman Soldier** is a fast-paced, 2D side-scrolling run-and-gun browser game deeply inspired by the classic arcade game *Contra*. The most unique aspect of this project is its visual engine: **it uses absolutely zero image assets.** Every character, weapon, projectile, and environment is crafted dynamically using Pure CSS (`<div>` elements, pseudo-elements, transforms, and gradients).

## Features
- **Pure CSS Graphics:** No sprites, no images. All graphics are DOM elements styled with complex CSS techniques.
- **Contra-Style Physics & Animation:** Features a highly articulated 4-phase sprint cycle with bending knees and realistic upper-body bobbing. The stickman leans into the run while perfectly stabilizing the gun with a two-handed grip.
- **8-Way Aiming:** Run and aim dynamically in 8 different directions with full arm articulation.
- **Classic Powerups:** Pick up floating capsules to upgrade your firepower:
  - **[S] Spread Gun:** Fires three bullets simultaneously in a destructive arc.
  - **[M] Machine Gun:** Vastly increases your firing rate.
- **Level System:** Features handcrafted, themed stages that seamlessly transition into an infinite, procedurally generated runner mode once the main levels are cleared.

## Controls
- **SPACE**: Start Game
- **W / A / S / D** or **Arrow Keys**: Move and Aim
- **SHIFT**: Jump (Features a classic Contra-style tucked somersault!)
- **ENTER**: Shoot

## How to Play
There are no complex build steps, installations, or dependencies required. 
Simply open `index.html` in any modern web browser to start playing immediately. Alternatively, you can serve the directory using a local HTTP server.

## Developer Documentation
For detailed insights into the engineering and design of the game, see the included documentation:
- **[Game Design Document (GDD)](gdd.md)**
- **[Software Requirement Specification (SRS)](srs.md)**
- **[Implementation Plan](implementation_plan.md)**
- **[COCOMO Cost Analysis](cocomo_analysis.md)**

## License & Copyright
**Copyright &copy; 2026 Abhishek Kumar. All Rights Reserved.**

This project operates under a strict custom End User License Agreement.
- You are granted **read-only access** for educational purposes to view the code.
- You are **strictly prohibited** from modifying the code to rebrand, repackage, or distribute it under a different identity.
- **Commercial use is exclusively retained** by the copyright holder, Abhishek Kumar.
- Any contributions made to this repository are irrevocably assigned to the copyright holder.

For full legal terms, please carefully read the [LICENSE](LICENSE) file included in this repository.
